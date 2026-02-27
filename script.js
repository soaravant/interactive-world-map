// Config
const CONFIG = {
    colorUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bumpUrl: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
    waterUrl: 'https://unpkg.com/three-globe/example/img/earth-water.png',
    cloudsUrl: 'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/clouds/clouds.png',
    bgUrl: 'https://unpkg.com/three-globe/example/img/night-sky.png',
    mapUrl: 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json'
};

const app = document.getElementById('app');
const loader = document.getElementById('loader');
const modal = document.getElementById('info-modal');

// State
let worldGlobe;
let activeCountry = null;
let activeMission = null;
let countries = []; // Map polygons data scope

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
        countries = topojson.feature(worldData, worldData.objects.countries).features;

        // 5. Draw Interactive Country Polygons
        worldGlobe.polygonsData(countries)
            .polygonAltitude(0.001) // closer to the surface by default
            .polygonsTransitionDuration(250) // Make interactions snappy when extruding
            .polygonCapColor(() => 'rgba(255, 255, 255, 0.0)') // invisible until hovered
            .polygonSideColor(() => 'rgba(56, 189, 248, 0.6)') // increased extrusion opacity
            // Borders only on mission countries
            .polygonStrokeColor(d => {
                const mission = findMissionByPolygonName(d.properties.name);
                return mission ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.0)';
            })
            .onPolygonHover(hoverD => {
                // Only show pointer for mission countries
                if (hoverD) {
                    const name = hoverD.properties?.name;
                    const mission = findMissionByPolygonName(name);
                    document.body.style.cursor = mission ? 'pointer' : 'grab';
                } else {
                    document.body.style.cursor = 'grab';
                }
            })
            .onPolygonClick(handleCountryClick)
            .onGlobeClick(() => {
                deselectCountry();
            });

        // 6. Center mission markers in the middle of their polygons
        MISSION_COUNTRIES.forEach(m => {
            const poly = countries.find(c => findMissionByPolygonName(c.properties.name)?.name === m.name);
            if (poly) {
                const centroid = d3.geoCentroid(poly);
                // Special case: don't move Alaska pin to the center of USA (lower 48)
                if (m.name !== 'Αλάσκα') {
                    m.lng = centroid[0];
                    m.lat = centroid[1];
                }
            }
        });

        // 7. Add Mission Country Markers from MISSION_COUNTRIES data
        const markersData = MISSION_COUNTRIES.map((m, idx) => ({
            lat: m.lat,
            lng: m.lng,
            id: `mission_${idx}`,
            name: m.name,
            missionData: m,
            color: '#4285F4'
        }));

        worldGlobe.htmlElementsData(markersData)
            .htmlElement(d => {
                const el = document.createElement('div');
                // Creating a pin with the church image
                el.innerHTML = `<svg viewBox="0 0 24 24" class="globe-pin" style="width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform: translate(-50%, -100%); cursor: pointer; transform-origin: center bottom;">
                        <path class="pin-bg" data-mission-name="${d.missionData.name}" data-id="${d.id}" data-default-color="${d.color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${d.color}" stroke="white" stroke-width="1" />
                        <circle cx="12" cy="9" r="5" fill="white" />
                        <image href="church.png" x="8" y="5" width="8" height="8" />
                    </svg>`;
                el.style.pointerEvents = 'auto';

                // Prioritize clicks over globe dragging, and use pointerdown so it fires
                // the instant the user clicks the moving target without waiting for a full 'click' sequence
                el.onpointerdown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle logic
                    if (activeMission && activeMission.name === d.missionData.name) {
                        deselectCountry();
                    } else {
                        activeMission = d.missionData;

                        // Find the corresponding polygon to extrude it
                        const countryPolygon = countries.find(c => findMissionByPolygonName(c.properties.name)?.name === d.missionData.name);
                        activeCountry = countryPolygon || { id: d.id, properties: { name: d.name } };

                        updateGlobeStyles();
                        // Push the focus up 15 degrees so the country falls beautifully to the bottom half of the screen
                        const offsetLat = Math.min(90, d.lat + 20);
                        worldGlobe.pointOfView({ lat: offsetLat, lng: d.lng, altitude: 1.5 }, 1000);
                        showModal(d.missionData);
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
    worldGlobe.polygonAltitude(d => d === activeCountry ? 0.05 : 0.001)
        .polygonCapColor(d => d === activeCountry ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.0)')
        .polygonStrokeColor(d => {
            if (d === activeCountry) return 'rgba(255, 255, 255, 1.0)';
            const mission = findMissionByPolygonName(d.properties.name);
            return mission ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.0)';
        });

    // Pins move with layer exactly on the same height
    worldGlobe.htmlAltitude(pinD => {
        if (activeCountry && (String(activeCountry.id) === String(pinD.id) || parseInt(activeCountry.id) === parseInt(pinD.id))) {
            return 0.05; // Same as active polygon altitude
        }
        return 0.001; // Same as default polygon altitude
    });

    // Update marker colors based on active mission
    document.querySelectorAll('.pin-bg').forEach(path => {
        const missionName = path.dataset.missionName;
        const defaultColor = path.dataset.defaultColor;

        if (activeMission && activeMission.name === missionName) {
            path.setAttribute('fill', '#FF5722'); // Orange when active
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

    // Only allow clicks on mission countries
    const name = d.properties.name;
    const mission = findMissionByPolygonName(name);
    if (!mission) return; // Ignore non-mission country clicks

    activeCountry = d;
    activeMission = mission;
    updateGlobeStyles();

    const centroid = d3.geoCentroid(d);
    const offsetLat = Math.min(90, centroid[1] + 25);
    worldGlobe.pointOfView({ lat: offsetLat, lng: centroid[0], altitude: 1.5 }, 1000);

    showModal(mission);
}

function findMissionByPolygonName(polyName) {
    // Map polygon English names to Greek mission names
    const nameMap = {
        'Mexico': 'Μεξικό',
        'Taiwan': 'Ταϊβάν',
        'Sierra Leone': 'Σιέρα Λεόνε',
        'Guatemala': 'Γουατεμάλα',
        'Cameroon': 'Καμερούν',
        'Dem. Rep. Congo': 'Ζαΐρ',
        'Congo': 'Κονγκό',
        'Uganda': 'Ουγκάντα',
        'Tanzania': 'Τανζανία',
        'Kenya': 'Κένυα',
        'Madagascar': 'Μαδαγασκάρη',
        'India': 'Ινδία',
        'Indonesia': 'Ινδονησία',
        'South Korea': 'Νότια Κορέα',
        'Albania': 'Αλβανία',
        'Japan': 'Ιαπωνία',
        'Zimbabwe': 'Ζιμπάμπουε',
        'Colombia': 'Κολομβία',
        'Cuba': 'Κούβα',
        'Nigeria': 'Νιγηρία',
        'Thailand': 'Ταϋλάνδη',
        'Philippines': 'Φιλιππίνες',
        'United States of America': 'Αλάσκα' // Alaska is part of USA
    };

    const greekName = nameMap[polyName];
    if (!greekName) return null;
    return MISSION_COUNTRIES.find(m => m.name === greekName) || null;
}

function showModal(mission) {
    modal.classList.remove('hidden');
    document.getElementById('country-name').textContent = mission.name;

    // Show flag next to country name
    const flagEl = document.getElementById('country-flag');
    if (mission.flag) {
        flagEl.innerHTML = `<img src="https://flagcdn.com/w80/${mission.flag}.png" alt="${mission.name}">`;
    } else {
        flagEl.innerHTML = '';
    }

    // Build stats dynamically
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = '';

    if (mission.stats && mission.stats.length > 0) {
        mission.stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `
                <span class="label">${stat.label}</span>
                <span class="value">${stat.value}</span>
            `;
            statsGrid.appendChild(statItem);
        });
    } else {
        statsGrid.innerHTML = '<div class="stat-item"><span class="label" style="text-align:center; width:100%; color: var(--text-muted);">—</span></div>';
    }

    // Build slideshow from mission images
    const slideshowContainer = document.getElementById('country-slideshow');
    const images = mission.images || [];

    if (images.length === 0) {
        slideshowContainer.style.display = 'none';
        return;
    }

    slideshowContainer.style.display = 'block';

    const trackEl = document.getElementById('slideshow-track');
    const dotsContainer = document.getElementById('slide-dots');

    // Clear track and dots
    trackEl.innerHTML = '';
    dotsContainer.innerHTML = '';

    images.forEach((imgObj, i) => {
        // Build image slide
        const slideItem = document.createElement('div');
        slideItem.className = 'slide-item';

        const img = document.createElement('img');
        img.src = imgObj.src;
        img.alt = imgObj.title;
        img.loading = 'lazy';

        const title = document.createElement('div');
        title.className = 'slide-title';
        title.textContent = imgObj.title;

        slideItem.appendChild(img);
        slideItem.appendChild(title);
        trackEl.appendChild(slideItem);

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
    activeMission = null;
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
