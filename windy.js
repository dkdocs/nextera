const options = {
    // Required: API key
    key: 'mvHsjfUgnACw1BXeLOLQUVIFebI6ARUv', // REPLACE WITH YOUR KEY !!!

    // Put additional console output
    verbose: true,

    // Optional: Initial state of the map
    lat: -22.911441,
    lon: -43.210902,
    zoom: 18,
};

// Initialize Windy API
windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff

    const { map } = windyAPI;
    // .map is instance of Leaflet map

    setupMap(map);
});
