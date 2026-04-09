import * as THREE from 'https://esm.sh/three@0.183.0';
import { GREETING_COUNTRIES } from './data.js?v=2';

const CONFIG = {
    colorUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bumpUrl: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
    waterUrl: 'https://unpkg.com/three-globe/example/img/earth-water.png',
    bgUrl: 'https://unpkg.com/three-globe/example/img/night-sky.png',
    mapUrl: 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json'
};

const loader = document.getElementById('loader');
const modal = document.getElementById('info-modal');
const closeModalButton = document.getElementById('close-modal');
const greetingAudioButton = document.getElementById('audio-greeting');
const responseAudioButton = document.getElementById('audio-response');
const Globe = globalThis.Globe;
const d3 = globalThis.d3;
const topojson = globalThis.topojson;

let worldGlobe;
let activeCountry = null;
let activeGreeting = null;
let countries = [];
let activeAudio = null;
let activeAudioButton = null;
let slideshowScrollHandler = null;

function isMobileViewport() {
    return window.matchMedia('(max-width: 720px)').matches;
}

function clampLatitude(value) {
    return Math.min(90, Math.max(-90, value));
}

function buildFocusPointOfView(lat, lng, desktopOffset = 18, mobileOffset = -10) {
    return {
        lat: clampLatitude(lat + (isMobileViewport() ? mobileOffset : desktopOffset)),
        lng,
        altitude: 1.55
    };
}

async function init() {
    try {
        worldGlobe = Globe()(document.getElementById('globeViz'))
            .globeImageUrl(CONFIG.colorUrl)
            .bumpImageUrl(CONFIG.bumpUrl)
            .backgroundImageUrl(CONFIG.bgUrl)
            .showAtmosphere(true)
            .atmosphereColor('#fb923c')
            .atmosphereAltitude(0.24);

        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        const waterMap = textureLoader.load(CONFIG.waterUrl);
        const displacementMap = textureLoader.load(CONFIG.bumpUrl);

        const newGlobeMaterial = new THREE.MeshPhysicalMaterial({
            displacementMap,
            displacementScale: 4,
            displacementBias: -0.5,
            roughnessMap: waterMap,
            roughness: 0.9,
            metalness: 0.08,
            clearcoatMap: waterMap,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1,
            envMapIntensity: 0.8
        });

        textureLoader.load(CONFIG.colorUrl, texture => {
            newGlobeMaterial.map = texture;
            newGlobeMaterial.needsUpdate = true;
        });

        worldGlobe.globeMaterial(newGlobeMaterial);

        setTimeout(() => {
            const globeMesh = worldGlobe.scene().children.find(
                obj => obj.type === 'Mesh' && obj.material === newGlobeMaterial
            );
            if (globeMesh) {
                globeMesh.geometry.dispose();
                globeMesh.geometry = new THREE.SphereGeometry(100, 1024, 1024);
            }
        }, 100);

        const scene = worldGlobe.scene();
        scene.children = scene.children.filter(
            child => !(child instanceof THREE.AmbientLight || child instanceof THREE.DirectionalLight)
        );

        scene.add(new THREE.AmbientLight(0xdcf0ff, 0.68));

        const warmLight = new THREE.DirectionalLight(0xfff0dd, 0.82);
        warmLight.position.set(200, 100, 200);
        scene.add(warmLight);

        const rimLight = new THREE.DirectionalLight(0xfb923c, 0.4);
        rimLight.position.set(-180, -80, -180);
        scene.add(rimLight);

        const cloudsGroup = new THREE.Group();
        const cloudGeo = await loadSimpleOBJ('../cloud.obj');
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            flatShading: true,
            transparent: true,
            opacity: 0.82
        });

        for (let index = 0; index < 40; index += 1) {
            const puff = new THREE.Mesh(cloudGeo, cloudMat);
            const scale = 1 + Math.random() * 2;

            puff.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            const radius = 110 + Math.random() * 6;
            const phi = Math.acos(1 - 2 * ((index + 0.5) / 40));
            const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

            puff.userData = {
                baseScale: scale,
                baseRadius: radius,
                phi,
                theta,
                speedOffset: Math.random() * 0.002
            };

            puff.position.setFromSphericalCoords(radius, phi, theta);
            puff.scale.set(scale, scale, scale);
            cloudsGroup.add(puff);
        }

        scene.add(cloudsGroup);
        animateDecorations(cloudsGroup);

        worldGlobe.controls().autoRotate = true;
        worldGlobe.controls().autoRotateSpeed = 0.46;
        worldGlobe.controls().enableDamping = true;

        const worldData = await d3.json(CONFIG.mapUrl);
        countries = topojson.feature(worldData, worldData.objects.countries).features;

        worldGlobe.polygonsData(countries)
            .polygonAltitude(0.001)
            .polygonsTransitionDuration(250)
            .polygonCapColor(() => 'rgba(255, 255, 255, 0.0)')
            .polygonSideColor(() => 'rgba(249, 115, 22, 0.58)')
            .polygonStrokeColor(feature => findGreetingByPolygonName(feature.properties.name)
                ? 'rgba(255, 255, 255, 0.62)'
                : 'rgba(255, 255, 255, 0.0)')
            .onPolygonHover(feature => {
                if (feature) {
                    document.body.style.cursor = findGreetingByPolygonName(feature.properties?.name) ? 'pointer' : 'grab';
                    return;
                }
                document.body.style.cursor = 'grab';
            })
            .onPolygonClick(handleCountryClick)
            .onGlobeClick(deselectCountry);

        GREETING_COUNTRIES.forEach(entry => {
            const polygon = countries.find(feature => entry.polygonNames.includes(feature.properties.name));
            if (polygon) {
                const centroid = d3.geoCentroid(polygon);
                entry.lng = centroid[0];
                entry.lat = centroid[1];
            }
        });

        const markersData = GREETING_COUNTRIES.map((entry, index) => ({
            id: `greeting_${index}`,
            name: entry.name,
            greetingData: entry,
            lat: entry.lat,
            lng: entry.lng,
            color: '#f97316'
        }));

        worldGlobe.htmlElementsData(markersData)
            .htmlElement(data => createPinElement(data))
            .htmlAltitude(0.001);

        window.addEventListener('resize', () => {
            worldGlobe.width(window.innerWidth);
            worldGlobe.height(window.innerHeight);

            if (!activeGreeting) {
                return;
            }

            const focusLat = activeCountry?.geometry
                ? d3.geoCentroid(activeCountry)[1]
                : activeGreeting.lat;
            const focusLng = activeCountry?.geometry
                ? d3.geoCentroid(activeCountry)[0]
                : activeGreeting.lng;

            worldGlobe.pointOfView(buildFocusPointOfView(focusLat, focusLng, 24, -10), 0);
        });

        closeModalButton.addEventListener('click', deselectCountry);
        loader.style.display = 'none';
    } catch (error) {
        console.error(error);
        loader.innerHTML = '<p>Σφάλμα φόρτωσης χάρτη.</p>';
    }
}

async function loadSimpleOBJ(url) {
    const text = await (await fetch(url)).text();
    const vertices = [];
    const indices = [];

    text.split('\n').forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts[0] === 'v') {
            vertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
        } else if (parts[0] === 'f') {
            indices.push(
                parseInt(parts[1].split('/')[0], 10) - 1,
                parseInt(parts[2].split('/')[0], 10) - 1,
                parseInt(parts[3].split('/')[0], 10) - 1
            );
        }
    });

    const geometry = new THREE.BufferGeometry();
    const floatArray = new Float32Array(indices.length * 3);

    for (let index = 0; index < indices.length; index += 1) {
        const vertex = vertices[indices[index]];
        if (!vertex) continue;
        floatArray[index * 3] = vertex[0];
        floatArray[index * 3 + 1] = vertex[1];
        floatArray[index * 3 + 2] = vertex[2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(floatArray, 3));
    geometry.computeVertexNormals();
    return geometry;
}

function animateDecorations(cloudsGroup) {
    const animate = () => {
        const time = Date.now() * 0.001;
        cloudsGroup.rotation.y += 0.001;

        cloudsGroup.children.forEach((puff, index) => {
            puff.rotation.z += 0.001 + puff.userData.speedOffset;
            puff.rotation.x += 0.0005;

            const baseScale = puff.userData.baseScale;
            puff.scale.set(
                baseScale + Math.sin(time * 0.5 + index) * 0.3 * baseScale,
                baseScale + Math.cos(time * 0.4 + index) * 0.3 * baseScale,
                baseScale + Math.sin(time * 0.6 + index) * 0.3 * baseScale
            );

            const baseRadius = puff.userData.baseRadius;
            const radiusOffset = Math.sin(time * 0.8 + index * 2) * 1.5;
            puff.position.setFromSphericalCoords(baseRadius + radiusOffset, puff.userData.phi, puff.userData.theta);
        });

        requestAnimationFrame(animate);
    };

    animate();
}

function createPinElement(data) {
    const element = document.createElement('div');
    element.innerHTML = `
        <svg viewBox="0 0 24 24" class="globe-pin" style="width: 34px; height: 34px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform: translate(-50%, -100%); cursor: pointer; transform-origin: center bottom;">
            <path class="pin-bg" data-country-name="${data.greetingData.name}" data-id="${data.id}" data-default-color="${data.color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${data.color}" stroke="white" stroke-width="1" />
            <circle cx="12" cy="9" r="5" fill="white" />
            <path d="M11.8 5.8v6.8a.55.55 0 0 1-.9.42L8.4 11.1H6.3a1.1 1.1 0 0 1-1.1-1.1V8a1.1 1.1 0 0 1 1.1-1.1h2.1l2.5-1.93a.55.55 0 0 1 .9.44Zm2.3 1.45a.55.55 0 0 1 .78 0 3.85 3.85 0 0 1 0 5.45.55.55 0 1 1-.78-.78 2.75 2.75 0 0 0 0-3.89.55.55 0 0 1 0-.78Zm1.55-1.4a.55.55 0 0 1 .78 0 5.8 5.8 0 0 1 0 8.2.55.55 0 1 1-.78-.78 4.7 4.7 0 0 0 0-6.64.55.55 0 0 1 0-.78Z" fill="#f97316" transform="translate(4.7 4.7) scale(0.56)" />
        </svg>
    `;
    element.style.pointerEvents = 'auto';
    element.onpointerdown = event => {
        event.preventDefault();
        event.stopPropagation();

        if (activeGreeting?.name === data.greetingData.name) {
            deselectCountry();
            return;
        }

        activeGreeting = data.greetingData;
        activeCountry = countries.find(feature => data.greetingData.polygonNames.includes(feature.properties.name))
            || { id: data.id, properties: { name: data.name } };

        updateGlobeStyles();
        worldGlobe.pointOfView(buildFocusPointOfView(data.lat, data.lng), 1000);
        showModal(data.greetingData);
    };

    return element;
}

function updateGlobeStyles() {
    worldGlobe.polygonAltitude(feature => feature === activeCountry ? 0.05 : 0.001)
        .polygonCapColor(feature => feature === activeCountry ? 'rgba(249, 115, 22, 0.36)' : 'rgba(255, 255, 255, 0.0)')
        .polygonStrokeColor(feature => {
            if (feature === activeCountry) return 'rgba(255, 255, 255, 1)';
            return findGreetingByPolygonName(feature.properties.name)
                ? 'rgba(255, 255, 255, 0.62)'
                : 'rgba(255, 255, 255, 0.0)';
        });

    worldGlobe.htmlAltitude(pin => {
        if (!activeGreeting) return 0.001;
        return pin.greetingData.name === activeGreeting.name ? 0.05 : 0.001;
    });

    document.querySelectorAll('.pin-bg').forEach(path => {
        const countryName = path.dataset.countryName;
        path.setAttribute('fill', activeGreeting?.name === countryName ? '#facc15' : path.dataset.defaultColor);
    });

    worldGlobe.controls().autoRotate = !activeCountry;
}

function handleCountryClick(feature) {
    if (activeCountry === feature) {
        deselectCountry();
        return;
    }

    const greeting = findGreetingByPolygonName(feature.properties.name);
    if (!greeting) return;

    activeCountry = feature;
    activeGreeting = greeting;
    updateGlobeStyles();

    const centroid = d3.geoCentroid(feature);
    worldGlobe.pointOfView(buildFocusPointOfView(centroid[1], centroid[0], 24, -10), 1000);
    showModal(greeting);
}

function findGreetingByPolygonName(polygonName) {
    return GREETING_COUNTRIES.find(entry => entry.polygonNames.includes(polygonName)) || null;
}

function showModal(entry) {
    modal.classList.remove('hidden');
    document.getElementById('country-name').textContent = entry.name;
    document.getElementById('greeting-text').textContent = entry.greeting;
    document.getElementById('greeting-pronunciation').textContent = entry.greetingPronunciation || entry.greeting;
    document.getElementById('response-text').textContent = entry.response;
    document.getElementById('response-pronunciation').textContent = entry.responsePronunciation || entry.response;

    const flag = document.getElementById('country-flag');
    flag.innerHTML = entry.flag
        ? `<img src="https://flagcdn.com/w80/${entry.flag}.png" alt="${entry.name}">`
        : '';

    greetingAudioButton.onclick = () => playAudio(entry.greetingAudioSrc, greetingAudioButton);
    responseAudioButton.onclick = () => playAudio(entry.responseAudioSrc, responseAudioButton);
    buildSlideshow(entry.images || []);
}

function buildSlideshow(images) {
    const slideshowContainer = document.getElementById('country-slideshow');
    const track = document.getElementById('slideshow-track');
    const dots = document.getElementById('slide-dots');

    if (!images.length) {
        slideshowContainer.style.display = 'none';
        return;
    }

    slideshowContainer.style.display = 'block';
    track.innerHTML = '';
    dots.innerHTML = '';

    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide-item';
        const media = document.createElement('div');
        media.className = 'slide-media';

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.title;
        img.loading = 'lazy';
        img.addEventListener('error', () => {
            slide.classList.add('is-fallback');
            media.innerHTML = '<div class="slide-fallback">Η εικόνα θα προστεθεί σύντομα.</div>';
        });

        media.appendChild(img);
        slide.appendChild(media);

        const title = document.createElement('div');
        title.className = 'slide-title';
        title.textContent = image.title;
        slide.appendChild(title);
        track.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => {
            track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
        };
        dots.appendChild(dot);
    });

    if (slideshowScrollHandler) {
        track.removeEventListener('scroll', slideshowScrollHandler);
    }

    slideshowScrollHandler = () => {
        const slideIndex = Math.round(track.scrollLeft / track.clientWidth);
        Array.from(dots.children).forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
    };

    track.addEventListener('scroll', slideshowScrollHandler, { passive: true });

    document.getElementById('slide-prev').onclick = () => {
        if (track.scrollLeft <= 5) {
            track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
            return;
        }
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    };

    document.getElementById('slide-next').onclick = () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    };

    track.scrollTo({ left: 0, behavior: 'auto' });
}

function playAudio(src, button) {
    if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
    }
    if (activeAudioButton) {
        activeAudioButton.classList.remove('is-playing');
    }

    const audio = new Audio(src);
    activeAudio = audio;
    activeAudioButton = button;
    if (button) {
        button.classList.add('is-playing');
    }

    audio.addEventListener('ended', () => {
        if (activeAudio === audio) {
            activeAudio = null;
        }
        if (activeAudioButton === button && button) {
            button.classList.remove('is-playing');
            activeAudioButton = null;
        }
    });

    audio.addEventListener('error', () => {
        if (activeAudioButton === button && button) {
            button.classList.remove('is-playing');
            activeAudioButton = null;
        }
        if (activeAudio === audio) {
            activeAudio = null;
        }
    });

    audio.play().catch(error => {
        console.error(error);
        if (activeAudioButton === button && button) {
            button.classList.remove('is-playing');
            activeAudioButton = null;
        }
        if (activeAudio === audio) {
            activeAudio = null;
        }
    });
}

function deselectCountry() {
    activeCountry = null;
    activeGreeting = null;
    if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio = null;
    }
    if (activeAudioButton) {
        activeAudioButton.classList.remove('is-playing');
        activeAudioButton = null;
    }
    modal.classList.add('hidden');
    updateGlobeStyles();
}

init();
