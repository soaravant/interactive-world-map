// Config
const CONFIG = {
    colorUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    cloudsUrl: 'https://unpkg.com/three-globe/example/img/clouds.png',
    mapUrl: 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json',
    apiBase: 'https://restcountries.com/v3.1/name'
};

const app = document.getElementById('app');
const viewport = document.getElementById('map-viewport');
const svgLayer = document.getElementById('svg-layer');
const loader = document.getElementById('loader');
const modal = document.getElementById('info-modal');

// State
let activeCountry = null;
let svg, g;
let countryDataMap = new Map(); // Cache for O(1) lookup

async function init() {
    try {
        // 1. Calculate map dimensions based on the natural 2:1 aspect ratio of the texture
        // We want the map to cover a good portion of the screen but fit safely.
        // Let's map 1 unit of longitude to X pixels based on window width.

        let mapWidth = window.innerWidth;
        const aspectRatio = 2; // Equirectangular is 2:1 width:height
        let mapHeight = mapWidth / aspectRatio;

        // If height is too tall for screen, constrain by height
        if (mapHeight > window.innerHeight) {
            mapHeight = window.innerHeight;
            mapWidth = mapHeight * aspectRatio;
        }

        // Apply dimensions
        document.getElementById('earth-texture').style.width = `${mapWidth}px`;
        document.getElementById('earth-texture').style.height = `${mapHeight}px`;

        svgLayer.style.width = `${mapWidth}px`;
        svgLayer.style.height = `${mapHeight}px`;

        viewport.style.width = `${mapWidth}px`;
        viewport.style.height = `${mapHeight}px`;

        // 2. Setup D3 Projection (Equirectangular matches the image texture)
        // D3's Equirectangular fits 360 degrees into width 960 by default?
        // We need to scale it to our container.
        const projection = d3.geoEquirectangular()
            .translate([mapWidth / 2, mapHeight / 2])
            .scale(mapWidth / (2 * Math.PI)); // Standard scaling for equirectangular to fill width

        const path = d3.geoPath().projection(projection);

        // 3. Setup SVG
        svg = d3.select('#svg-layer')
            .append('svg')
            .attr('width', mapWidth)
            .attr('height', mapHeight)
            .attr('viewBox', [0, 0, mapWidth, mapHeight]);

        g = svg.append('g');

        // 4. Zoom Behavior acting on the DOM Viewport
        // We use d3.zoom but apply the transform to the DIV, not just the SVG group.
        // This keeps the Image and SVG in sync perfectly.
        const zoom = d3.zoom()
            .scaleExtent([1, 4]) // Restricted zoom as requested
            .translateExtent([[0, 0], [mapWidth, mapHeight]])
            .on('zoom', (event) => {
                viewport.style.transform = `translate(-50%, -50%) translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`;
                // Note: We are transforming the viewport which is centered.
                // The 'translate' from zoom needs to account for the fact we are moving internal content.
                // Actually, applying d3 zoom output directly to a centered div can be tricky.
                // Standard approach: Apply transform to the inner content (images + svg).
                // Let's refactor the CSS to make 'viewport' the Scene and 'content' the target.
            });

        // REFACTORING ZOOM STRATEGY ON THE FLY:
        // Easier: viewport is the container (full screen).
        // Inner "Map Group" contains images and SVG.
        // We apply event.transform to that Map Group.
        // I will adjust the DOM in js slightly or rely on the previous CSS but careful with transform origin.

        // Let's attach zoom to the #app container (listener) but transform #map-viewport.
        // Reset transform origin to top-left to make D3 math easy.
        viewport.style.transformOrigin = '0 0';
        viewport.style.top = '0';
        viewport.style.left = '0';
        viewport.style.transform = 'none';

        // Recenter initial view manually?
        // Let's Center it.
        const initialX = (window.innerWidth - mapWidth) / 2;
        const initialY = (window.innerHeight - mapHeight) / 2;

        const zoomBehavior = d3.zoom()
            .scaleExtent([1, 4])
            .on('zoom', (event) => {
                viewport.style.transform = `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`;
            });

        d3.select('#app').call(zoomBehavior)
            .call(zoomBehavior.transform, d3.zoomIdentity.translate(initialX, initialY));

        document.getElementById('zoom-in').onclick = () => d3.select('#app').transition().call(zoomBehavior.scaleBy, 1.3);
        document.getElementById('zoom-out').onclick = () => d3.select('#app').transition().call(zoomBehavior.scaleBy, 0.7);


        // 5. Load Map Data
        const worldData = await d3.json(CONFIG.mapUrl);
        const countries = topojson.feature(worldData, worldData.objects.countries).features;

        // 6. Draw Countries (Invisible Interaction Layer)
        g.selectAll('path')
            .data(countries)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'country')
            .attr('id', d => `country-${d.id}`) // Store ID for easy lookup
            .on('click', handleCountryClick);

        // 7. Load Population Data & Create Pins
        // 7. Load Population Data, Flags, Capital, Region for ALL countries
        // We fetch from a local file for INSTANT access (no API delay).
        const popRes = await fetch('countries_data.json');
        const popData = await popRes.json();

        // 7a. Build Map and Preload Images
        popData.forEach(d => {
            // Map by common name (as fallback) and ccn3 (if available)
            if (d.name?.common) {
                countryDataMap.set(d.name.common.toLowerCase(), d);
            }
            if (d.ccn3) {
                countryDataMap.set(d.ccn3, d); // String match
            }

            // Preload Image
            if (d.flags?.svg) {
                const img = new Image();
                img.src = d.flags.svg;
            }
        });

        // Sort top 20
        const top20 = popData
            .sort((a, b) => b.population - a.population)
            .slice(0, 20);

        // Map pins to centroids
        const pinData = top20.map(d => {
            // Find matching TopoJSON feature. 
            // RestCountries uses 'ccn3' which is numeric code string '004'. 
            // TopoJSON 'id' is often numeric 4. We need to cast.
            const feature = countries.find(f => {
                // Handle various ID formats (string vs int)
                return parseInt(f.id) === parseInt(d.ccn3);
            });

            if (feature) {
                return {
                    name: d.name.common,
                    population: d.population,
                    centroid: path.centroid(feature),
                    feature: feature // Keep reference for click handling
                };
            }
            return null;
        }).filter(p => p !== null);

        // Draw Pins
        // Draw Pins (Google Maps Style Markers)
        // Path for a standard tear-drop pin. 24x24 viewBox, tip at (12, 22)
        const markerPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";

        g.selectAll('.pin-group')
            .data(pinData)
            .enter()
            .append('g')
            .attr('class', 'pin-group')
            // Position the Group at the centroid
            .attr('transform', d => `translate(${d.centroid[0]}, ${d.centroid[1]})`)
            .on('click', (event, d) => {
                handleCountryClick.call(document.getElementById(`country-${d.feature.id}`), event, d.feature);
            })
            .append('path')
            .attr('d', markerPath)
            .attr('class', 'pin')
            // Center the pin: The path is 24px wide, 24px high. Tip is at bottom center.
            // We want (0,0) of the group to be the tip.
            // The tip in the path is at roughly (12, 22). 
            // So translate path by (-12, -22).
            .attr('transform', 'translate(-12, -22) scale(1)');


        // Helper: Adjust pin size on zoom so they don't get huge?
        // Let's add that to the zoom listener if desired, but pulse effect handles visibility well.

        // 8. Add specific Marker for New York City
        const nycCoords = [-74.0060, 40.7128]; // [Longitude, Latitude]
        const nycPos = projection(nycCoords);

        g.append('g')
            .attr('class', 'pin-group custom-pin')
            .attr('transform', `translate(${nycPos[0]}, ${nycPos[1]})`)
            .style('cursor', 'pointer')
            .on('click', function (event) {
                event.stopPropagation();
                // Deselect other countries
                if (activeCountry) d3.select(activeCountry).classed('active', false);
                activeCountry = this;
                d3.select(this).classed('active', true);

                showModal('New York City, USA');
                updateModal({
                    population: 8804190,
                    region: 'North America',
                    capital: ['Albany (State Cap)'],
                    flags: { svg: 'https://flagcdn.com/w320/us.png' }
                });
            })
            .append('path')
            .attr('d', markerPath)
            .attr('class', 'pin')
            .style('fill', '#FF5722') // Distinct Orange Color
            .attr('transform', 'translate(-12, -22) scale(1)');

        loader.style.display = 'none';

        // 8. Spawn Cloud Sprites
        spawnClouds(40); // Spawn 40 random clouds

    } catch (e) {
        console.error(e);
        loader.innerHTML = "Error loading assets";
    }
}

function spawnClouds(count) {
    const container = document.getElementById('clouds-container');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        // Create IMG element from external assets
        const cloud = document.createElement('img');
        cloud.classList.add('cloud-sprite');

        // Random asset 1-5 (PNG now)
        const assetId = Math.floor(Math.random() * 5) + 1;
        cloud.src = `assets/clouds/cloud${assetId}.png`;

        // Random Variable --i for animation duration
        // Range 2 (fast) to 10 (slow) -> 16s to 80s cycle
        const speedVar = 2 + Math.random() * 8;
        cloud.style.setProperty('--i', speedVar);

        // Random Position (Top 0-90%)
        cloud.style.top = `${Math.random() * 90}%`;

        // Random Width (200px to 600px)
        const width = 200 + Math.random() * 400;
        cloud.style.width = `${width}px`;

        // Optional: Random Opacity for extra depth
        cloud.style.opacity = 0.4 + Math.random() * 0.5;

        // Negative delay for scattered start
        cloud.style.animationDelay = `-${Math.random() * 100}s`;

        container.appendChild(cloud);
    }
}

function handleCountryClick(event, d) {
    event.stopPropagation();
    if (activeCountry) d3.select(activeCountry).classed('active', false);
    activeCountry = this;
    d3.select(this).classed('active', true);

    const name = d.properties.name;
    showModal(name);

    // Look up data in our preloaded map
    // d is the TopoJSON feature. d.id might constitute the ccn3 code or we match by name.
    let data = null;

    // Try by ID (CCN3) first if it exists and looks like a code
    if (d.id && countryDataMap.has(String(d.id).padStart(3, '0'))) {
        data = countryDataMap.get(String(d.id).padStart(3, '0'));
    }
    // Fallback: Try by ID as direct string match (sometimes TopoJSON has '004')
    else if (d.id && countryDataMap.has(String(d.id))) {
        data = countryDataMap.get(String(d.id));
    }
    // Fallback: Match by name
    else if (name && countryDataMap.has(name.toLowerCase())) {
        data = countryDataMap.get(name.toLowerCase());
    }

    // Update Modal
    updateModal(data);
}

// fetchData is no longer needed as we have everything in memory!

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
    if (activeCountry) d3.select(activeCountry).classed('active', false);
    activeCountry = null;
};

init();
