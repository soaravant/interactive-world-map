// Config
const CONFIG = {
    colorUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bumpUrl: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
    waterUrl: 'https://unpkg.com/three-globe/example/img/earth-water.png',
    cloudsUrl: 'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/clouds/clouds.png',
    bgUrl: 'https://unpkg.com/three-globe/example/img/night-sky.png',
    mapUrl: 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json',
    apiBase: 'https://restcountries.com/v3.1/name'
};

const app = document.getElementById('app');
const loader = document.getElementById('loader');
const modal = document.getElementById('info-modal');

// State
let worldGlobe;
let activeCountry = null;
let countryDataMap = new Map(); // Cache for O(1) lookup

async function init() {
    try {
        // 1. Initialize 3D Globe with Globe.gl
        worldGlobe = Globe()
            (document.getElementById('globeViz'))
            .globeImageUrl(CONFIG.colorUrl)
            .bumpImageUrl(CONFIG.bumpUrl)
            .backgroundImageUrl(CONFIG.bgUrl)
            .showAtmosphere(true)
            .atmosphereColor('#3a8aff') // Bright realistically vibrant blue glow
            .atmosphereAltitude(0.25);

        // 2. Tweak Three.js materials to achieve Pixar/3D glossy aesthetic
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        const waterMap = textureLoader.load(CONFIG.waterUrl);
        const displacementMap = textureLoader.load(CONFIG.bumpUrl);

        const newGlobeMaterial = new THREE.MeshPhysicalMaterial({
            displacementMap: displacementMap,
            displacementScale: 4, // Half of 8
            displacementBias: -0.5,
            roughnessMap: waterMap,
            roughness: 0.9, // Land is very rough, water is smooth
            metalness: 0.1, // Slight base metalness
            clearcoatMap: waterMap, // Only add clearcoat over the ocean
            clearcoat: 0.8, // Strong glossy clearcoat on the water
            clearcoatRoughness: 0.1, // Smooth liquid clearcoat
            envMapIntensity: 0.8 // Enhance reflections slightly
        });

        textureLoader.load(CONFIG.colorUrl, texture => {
            newGlobeMaterial.map = texture;
            newGlobeMaterial.needsUpdate = true;
        });

        worldGlobe.globeMaterial(newGlobeMaterial);

        // Increase globe resolution to support physical height displacement
        setTimeout(() => {
            const globeMesh = worldGlobe.scene().children.find(obj => obj.type === 'Mesh' && obj.material === newGlobeMaterial);
            if (globeMesh) {
                globeMesh.geometry.dispose();
                // Drastically increase segments for more detailed bumps
                globeMesh.geometry = new THREE.SphereGeometry(100, 1024, 1024);
            }
        }, 100);

        // Setup custom lighting to make the "Pixar" look pop
        const scene = worldGlobe.scene();

        // Remove the default D3/Globe.gl lights
        scene.children = scene.children.filter(c => !(c instanceof THREE.AmbientLight || c instanceof THREE.DirectionalLight));

        // Add soft ambient light
        const ambientLight = new THREE.AmbientLight(0xdcf0ff, 0.7); // Slightly brighter ambient
        scene.add(ambientLight);

        // Key light (like a bright, warm sun)
        const dLight = new THREE.DirectionalLight(0xfff0dd, 0.8); // Significantly reduced brightness to avoid harsh spots
        dLight.position.set(200, 100, 200);
        scene.add(dLight);

        // Fill/Rim light (vibrant blue shadow cast)
        const dLight2 = new THREE.DirectionalLight(0x3b82f6, 0.5); // Reduced fill light intensity
        dLight2.position.set(-200, -100, -200);
        scene.add(dLight2);

        // Procedural 3D Smoke-like Clouds
        const cloudsGroup = new THREE.Group();

        // Custom simple async OBJ loader
        async function loadSimpleOBJ(url) {
            const text = await (await fetch(url)).text();
            const vertices = [];
            const indices = [];

            text.split('\n').forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts[0] === 'v') {
                    vertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
                } else if (parts[0] === 'f') {
                    // Obj indices are 1-based, we account for 1-based indexing and possible uv/normal slashes
                    indices.push(
                        parseInt(parts[1].split('/')[0]) - 1,
                        parseInt(parts[2].split('/')[0]) - 1,
                        parseInt(parts[3].split('/')[0]) - 1
                    );
                }
            });

            const geometry = new THREE.BufferGeometry();
            const floatArr = new Float32Array(indices.length * 3);
            for (let i = 0; i < indices.length; i++) {
                const v = vertices[indices[i]];
                if (v) {
                    floatArr[i * 3 + 0] = v[0];
                    floatArr[i * 3 + 1] = v[1];
                    floatArr[i * 3 + 2] = v[2];
                }
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(floatArr, 3));
            geometry.computeVertexNormals();
            return geometry;
        }

        const cloudGeo = await loadSimpleOBJ('cloud.obj');
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            flatShading: true,
            transparent: true,
            opacity: 0.85
        });

        // Generate 40 cloud clusters
        for (let i = 0; i < 40; i++) {
            const puff = new THREE.Mesh(cloudGeo, cloudMat);

            // Random scale constraint for low poly aesthetic
            const scale = 1.0 + Math.random() * 2.0;

            // Randomly rotate to add variety to the identical cloud obj
            puff.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Position cloud spherically around the globe
            const radius = 110 + Math.random() * 6;

            // Fibonacci sphere distribution for even spread
            const phi = Math.acos(1 - 2 * ((i + 0.5) / 40));
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

            puff.userData = {
                baseScale: scale,
                baseRadius: radius,
                phi: phi,
                theta: theta,
                speedOffset: Math.random() * 0.002
            };

            puff.position.setFromSphericalCoords(radius, phi, theta);
            puff.scale.set(scale, scale, scale);
            cloudsGroup.add(puff);
        }

        scene.add(cloudsGroup);

        // Animation loop for clouds
        const animateDecorations = () => {
            const time = Date.now() * 0.001;
            if (cloudsGroup) {
                // Clouds orbit at a totally distinct independent speed from the Earth
                cloudsGroup.rotation.y += 0.001;

                // Slowly morph and displace individual smoke puffs for organic feel
                cloudsGroup.children.forEach((puff, index) => {
                    // Separate rotating spins so they tumble and morph
                    puff.rotation.z += 0.001 + puff.userData.speedOffset;
                    puff.rotation.x += 0.0005;

                    // Morphing effect: Scale each axis independently based on sine waves with unique offsets
                    const bS = puff.userData.baseScale;
                    puff.scale.set(
                        bS + Math.sin(time * 0.5 + index) * 0.3 * bS,
                        bS + Math.cos(time * 0.4 + index) * 0.3 * bS,
                        bS + Math.sin(time * 0.6 + index) * 0.3 * bS
                    );

                    // Height Displacement: Very gradually rise and fall in the atmosphere
                    const bR = puff.userData.baseRadius;
                    const radiusOffset = Math.sin(time * 0.8 + index * 2) * 1.5;
                    puff.position.setFromSphericalCoords(bR + radiusOffset, puff.userData.phi, puff.userData.theta);
                });
            }
            requestAnimationFrame(animateDecorations);
        };
        animateDecorations();

        // 3. Set Controls
        worldGlobe.controls().autoRotate = true;
        worldGlobe.controls().autoRotateSpeed = 0.5;
        worldGlobe.controls().enableDamping = true;

        // 4. Load Map GeoJSON Data (Polygons for Country Hover)
        const worldData = await d3.json(CONFIG.mapUrl);
        const countries = topojson.feature(worldData, worldData.objects.countries).features;

        // 5. Load external data and cache
        const popRes = await fetch('countries_data.json');
        const popData = await popRes.json();

        popData.forEach(d => {
            if (d.name?.common) {
                countryDataMap.set(d.name.common.toLowerCase(), d);
            }
            if (d.ccn3) {
                countryDataMap.set(d.ccn3, d);
            }
            if (d.flags?.svg) {
                const img = new Image();
                img.src = d.flags.svg;
            }
        });

        // 6. Draw Interactive Country Polygons
        worldGlobe.polygonsData(countries)
            .polygonAltitude(0.001) // closer to the surface by default
            .polygonsTransitionDuration(250) // Make interactions snappy when extruding
            .polygonCapColor(() => 'rgba(255, 255, 255, 0.0)') // invisible until hovered
            .polygonSideColor(() => 'rgba(56, 189, 248, 0.6)') // increased extrusion opacity
            // Thickest visual opacity possible (WebView locks physical line width to 1px)
            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.6)') // Twice as bold unselected
            .onPolygonHover(hoverD => {
                if (hoverD) document.body.style.cursor = 'pointer';
                else document.body.style.cursor = 'grab';
            })
            .onPolygonClick(handleCountryClick)
            .onGlobeClick(() => {
                deselectCountry();
            });

        // 7. Add Custom Markers (Top 20 populated + NYC)
        const top20 = popData
            .sort((a, b) => b.population - a.population)
            .slice(0, 20);

        const markersData = top20.map(d => {
            const feature = countries.find(f => parseInt(f.id) === parseInt(d.ccn3));
            if (!feature) return null;

            const centroid = d3.geoCentroid(feature); // returns [lng, lat]

            return {
                lat: centroid[1],
                lng: centroid[0],
                id: d.ccn3,
                name: d.name.common,
                data: d,
                color: '#4285F4'
            };
        }).filter(m => m !== null);

        const nycMarker = {
            id: 'nyc',
            lat: 40.7128, lng: -74.0060, name: 'New York City, USA',
            data: {
                population: 8804190,
                region: 'North America',
                capital: ['Albany (State Cap)'],
                flags: { svg: 'https://flagcdn.com/w320/us.png' }
            },
            color: '#4285F4' // Blue like the rest
        };

        worldGlobe.htmlElementsData([...markersData, nycMarker])
            .htmlElement(d => {
                const el = document.createElement('div');
                // Creating a pin with the church image
                el.innerHTML = `<svg viewBox="0 0 24 24" class="globe-pin" style="width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform: translate(-50%, -100%); cursor: pointer; transform-origin: center bottom;">
                        <path class="pin-bg" data-id="${d.id}" data-default-color="${d.color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${d.color}" stroke="white" stroke-width="1" />
                        <circle cx="12" cy="9" r="5" fill="white" />
                        <image href="church.png" x="8" y="5" width="8" height="8" />
                    </svg>`;
                el.style.pointerEvents = 'auto';

                // Prioritize clicks over globe dragging, and use pointerdown so it fires
                // the instant the user clicks the moving target without waiting for a full 'click' sequence
                el.onpointerdown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const feature = countries.find(f => parseInt(f.id) === parseInt(d.id));

                    // Toggle logic
                    if (activeCountry && (activeCountry === feature || activeCountry.id === d.id)) {
                        deselectCountry();
                    } else {
                        // Activate the actual polygon feature so it extrudes properly
                        activeCountry = feature || { id: d.id, properties: { name: d.name } };
                        updateGlobeStyles();
                        // Push the focus up 15 degrees so the country falls beautifully to the bottom half of the screen
                        const offsetLat = Math.min(90, d.lat + 15);
                        worldGlobe.pointOfView({ lat: offsetLat, lng: d.lng, altitude: 1.5 }, 1000);
                        showModal(d.name);
                        updateModal(d.data);
                    }
                };
                return el;
            })
            .htmlAltitude(0.001); // Just above polygons

        // Enable resizing
        window.addEventListener('resize', () => {
            worldGlobe.width(window.innerWidth);
            worldGlobe.height(window.innerHeight);
        });

        loader.style.display = 'none';

    } catch (e) {
        console.error(e);
        loader.innerHTML = "Error loading assets";
    }
}

function updateGlobeStyles() {
    worldGlobe.polygonAltitude(d => d === activeCountry ? 0.05 : 0.001) // Safely above the 4.0 maximum displacement scale when active
        .polygonCapColor(d => d === activeCountry ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.0)')
        .polygonStrokeColor(d => d === activeCountry ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.6)'); // Outline follows bumpy terrain thinly when unselected, brightly when selected

    // Pins move with layer exactly on the same height
    worldGlobe.htmlAltitude(pinD => {
        if (activeCountry && (String(activeCountry.id) === String(pinD.id) || parseInt(activeCountry.id) === parseInt(pinD.id))) {
            return 0.05; // Same as active polygon altitude
        }
        return 0.001; // Same as default polygon altitude
    });

    // Update marker colors
    document.querySelectorAll('.pin-bg').forEach(path => {
        const pinId = path.dataset.id;
        const defaultColor = path.dataset.defaultColor;

        if (activeCountry && (String(activeCountry.id) === String(pinId) || parseInt(activeCountry.id) === parseInt(pinId))) {
            path.setAttribute('fill', '#FF5722'); // Orange when clicked
        } else {
            path.setAttribute('fill', defaultColor);
        }
    });

    worldGlobe.controls().autoRotate = !activeCountry;
}

function handleCountryClick(d) {
    if (activeCountry === d) {
        deselectCountry();
        return;
    }

    activeCountry = d;
    updateGlobeStyles();

    const centroid = d3.geoCentroid(d);
    // Shift camera slightly north to frame the country below the UI Modal
    const offsetLat = Math.min(90, centroid[1] + 15);
    worldGlobe.pointOfView({ lat: offsetLat, lng: centroid[0], altitude: 1.5 }, 1000);

    const name = d.properties.name;
    let data = null;

    if (d.id && countryDataMap.has(String(d.id).padStart(3, '0'))) {
        data = countryDataMap.get(String(d.id).padStart(3, '0'));
    } else if (d.id && countryDataMap.has(String(d.id))) {
        data = countryDataMap.get(String(d.id));
    } else if (name && countryDataMap.has(name.toLowerCase())) {
        data = countryDataMap.get(name.toLowerCase());
    }

    showModal(name);
    updateModal(data);
}

function showModal(name) {
    modal.classList.remove('hidden');
    document.getElementById('country-name').textContent = name;
    document.getElementById('country-pop').textContent = '...';
    document.getElementById('country-region').textContent = '...';
    document.getElementById('country-capital').textContent = '...';
    document.getElementById('country-flag').innerHTML = '';
}

function updateModal(data) {
    if (!data) {
        document.getElementById('country-pop').textContent = 'N/A';
        document.getElementById('country-slideshow').style.display = 'none';
        return;
    }
    document.getElementById('country-pop').textContent = new Intl.NumberFormat().format(data.population);
    document.getElementById('country-region').textContent = data.region;
    document.getElementById('country-capital').textContent = data.capital?.[0] || 'N/A';
    if (data.flags?.svg) {
        document.getElementById('country-flag').innerHTML = `<img src="${data.flags.svg}">`;
    }

    // Set up slideshow using dynamic Unsplash images related to the country
    const slideshowContainer = document.getElementById('country-slideshow');
    slideshowContainer.style.display = 'block';

    // We'll generate 3 random unsplash placeholder images related to the country or region
    // (Note: source.unsplash.com was deprecated, so we use lorempicsum for reliable fast placeholders)
    const images = [
        `https://picsum.photos/400/200?random=${Math.random()}`,
        `https://picsum.photos/400/200?random=${Math.random()}`,
        `https://picsum.photos/400/200?random=${Math.random()}`
    ];
    let currentSlide = 0;

    const trackEl = document.getElementById('slideshow-track');
    const dotsContainer = document.getElementById('slide-dots');

    // Clear track and dots
    trackEl.innerHTML = '';
    dotsContainer.innerHTML = '';

    images.forEach((imgSrc, i) => {
        // Build image slide
        const img = document.createElement('img');
        img.src = imgSrc;
        trackEl.appendChild(img);

        // Build dot
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => {
            trackEl.scrollTo({
                left: trackEl.clientWidth * i,
                behavior: 'smooth'
            });
        };
        dotsContainer.appendChild(dot);
    });

    // Handle button arrows
    document.getElementById('slide-prev').onclick = () => {
        if (trackEl.scrollLeft <= 5) {
            // cycle to end
            trackEl.scrollTo({ left: trackEl.scrollWidth, behavior: 'smooth' });
        } else {
            trackEl.scrollBy({ left: -trackEl.clientWidth, behavior: 'smooth' });
        }
    };

    document.getElementById('slide-next').onclick = () => {
        if (trackEl.scrollLeft + trackEl.clientWidth >= trackEl.scrollWidth - 5) {
            // cycle to beginning
            trackEl.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            trackEl.scrollBy({ left: trackEl.clientWidth, behavior: 'smooth' });
        }
    };

    // Auto-update dots indicator on manual touch swipe or scroll
    const updateActiveDot = () => {
        const slideIndex = Math.round(trackEl.scrollLeft / trackEl.clientWidth);
        Array.from(dotsContainer.children).forEach((dot, i) => {
            dot.classList.toggle('active', i === slideIndex);
        });
    };

    trackEl.addEventListener('scroll', updateActiveDot);

    // Reset to first slide
    trackEl.scrollTo({ left: 0, behavior: 'auto' });
}

function deselectCountry() {
    activeCountry = null;
    updateGlobeStyles();
    modal.classList.add('hidden');
    // Zoom back out to default orbit altitude (approx 2.5 depending on initial)
    worldGlobe.pointOfView({ altitude: 2.5 }, 1000);
}

document.getElementById('close-modal').onclick = deselectCountry;

// Prevent clicks and drags inside the modal from bubbling up to the globe and closing it
['pointerdown', 'pointerup', 'pointermove', 'click', 'wheel', 'touchstart', 'touchend', 'touchmove'].forEach(evt => {
    modal.addEventListener(evt, e => e.stopPropagation());
});

init();
