// Config
const CONFIG = {
    colorUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bumpUrl: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
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
            .atmosphereColor('#3a228a')
            .atmosphereAltitude(0.25);

        // 2. Tweak Three.js materials to achieve Pixar/3D glossy aesthetic
        const globeMaterial = worldGlobe.globeMaterial();

        // Add shininess and distinct bump depth
        globeMaterial.bumpScale = 15; // Increased bump for cartoonish mountains
        new THREE.TextureLoader().load(CONFIG.colorUrl, texture => {
            globeMaterial.map = texture;
            globeMaterial.roughness = 0.2; // Very glossy like shiny plastic
            globeMaterial.metalness = 0.05; // Less metallic for pure colors
            globeMaterial.color.setScalar(1.2); // Boost saturation
        });

        // Setup custom lighting to make the "Pixar" look pop
        const scene = worldGlobe.scene();

        // Remove the default D3/Globe.gl lights
        scene.children = scene.children.filter(c => !(c instanceof THREE.AmbientLight || c instanceof THREE.DirectionalLight));

        // Add soft ambient light
        const ambientLight = new THREE.AmbientLight(0xdcf0ff, 0.8);
        scene.add(ambientLight);

        // Key light (like a bright, warm sun)
        const dLight = new THREE.DirectionalLight(0xfff0dd, 2.5);
        dLight.position.set(200, 100, 200);
        scene.add(dLight);

        // Fill/Rim light (vibrant blue shadow cast)
        const dLight2 = new THREE.DirectionalLight(0x3b82f6, 1.5);
        dLight2.position.set(-200, -100, -200);
        scene.add(dLight2);

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
            .polygonAltitude(0.01) // slightly raised off the map surface
            .polygonCapColor(() => 'rgba(255, 255, 255, 0.0)') // invisible until hovered
            .polygonSideColor(() => 'rgba(56, 189, 248, 0.2)')
            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.5)') // Stronger, visible borders initially
            .onPolygonHover(hoverD => {
                if (hoverD) document.body.style.cursor = 'pointer';
                else document.body.style.cursor = 'grab';
            })
            .onPolygonClick(handleCountryClick)
            .onGlobeClick(() => {
                activeCountry = null;
                updateGlobeStyles();
                modal.classList.add('hidden');
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
            lat: 40.7128, lng: -74.0060, name: 'New York City, USA',
            data: {
                population: 8804190,
                region: 'North America',
                capital: ['Albany (State Cap)'],
                flags: { svg: 'https://flagcdn.com/w320/us.png' }
            },
            color: '#FF5722' // Distinct Orange
        };

        worldGlobe.htmlElementsData([...markersData, nycMarker])
            .htmlElement(d => {
                const el = document.createElement('div');
                // Creating our classic pin marker!
                el.innerHTML = `<svg viewBox="0 0 24 24" class="globe-pin" style="width: 24px; height: 24px; fill: ${d.color}; stroke: white; stroke-width: 1.5px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform: translate(-50%, -100%); cursor: pointer; transform-origin: center bottom;">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                    </svg>`;
                el.style.pointerEvents = 'auto';
                el.onclick = (e) => {
                    e.stopPropagation();
                    const feature = countries.find(f => parseInt(f.id) === parseInt(d.id));
                    if (feature) {
                        handleCountryClick(feature);
                    } else {
                        activeCountry = null;
                        updateGlobeStyles();
                        showModal(d.name);
                        updateModal(d.data);
                    }
                };
                return el;
            })
            .htmlAltitude(0.05); // Just above polygons

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
    worldGlobe.polygonAltitude(d => d === activeCountry ? 0.06 : 0.01)
        .polygonCapColor(d => d === activeCountry ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.0)')
        .polygonStrokeColor(d => d === activeCountry ? '#ffffff' : 'rgba(255, 255, 255, 0.5)');

    // Pins move with layer
    worldGlobe.htmlAltitude(pinD => {
        if (activeCountry && parseInt(activeCountry.id) === parseInt(pinD.id)) {
            return 0.1;
        }
        return 0.05;
    });

    worldGlobe.controls().autoRotate = !activeCountry;
}

function handleCountryClick(d) {
    if (activeCountry === d) {
        activeCountry = null;
        updateGlobeStyles();
        modal.classList.add('hidden');
        return;
    }

    activeCountry = d;
    updateGlobeStyles();

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
        return;
    }
    document.getElementById('country-pop').textContent = new Intl.NumberFormat().format(data.population);
    document.getElementById('country-region').textContent = data.region;
    document.getElementById('country-capital').textContent = data.capital?.[0] || 'N/A';
    if (data.flags?.svg) {
        document.getElementById('country-flag').innerHTML = `<img src="${data.flags.svg}">`;
    }
}

document.getElementById('close-modal').onclick = () => {
    modal.classList.add('hidden');
};

init();
