document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        generateMap();
    }
}

function generateMap() {
    generateAltitudeMap();
    generateRainShadowMap();
}

function generateAltitudeMap() {
    let c = getCanvasById("altitudeCanvas");

    mapgen.config.seed = parseInt(document.getElementById('seed').value);
    mapgen.config.sizex = parseInt(document.getElementById('mapWidth').value);
    mapgen.config.sizey = parseInt(document.getElementById('mapHeight').value);
    mapgen.config.removeBorders = !!document.getElementById('makeWater').checked;
    mapgen.config.scale = parseFloat(document.getElementById('perlinScale').value);
    mapgen.config.countOfNoiseNormalsTimes = parseInt(document.getElementById('noiseNormaliseCount').value);
    mapgen.createRandomIslandMap();
    mapgen.vizualizeMap(c, 'color');
}

function generateRainShadowMap() {
    let c = getCanvasById("rainShadowCanvas");
    $(c).addClass('canvasTopLayer');

    mapgen.config.seed = parseInt(document.getElementById('seed').value);
    mapgen.config.sizex = parseInt(document.getElementById('mapWidth').value);
    mapgen.config.sizey = parseInt(document.getElementById('mapHeight').value);
    mapgen.config.removeBorders = !!document.getElementById('makeWater').checked;
    mapgen.config.scale = parseFloat(document.getElementById('perlinScale').value);
    mapgen.config.countOfNoiseNormalsTimes = parseInt(document.getElementById('noiseNormaliseCount').value);
    mapgen.createRandomIslandMap();
    mapgen.vizualizeMap(c, 'grey');
}

function getCanvasById(id) {
    let c = document.getElementById(id);

    if (c === null) {
        c = createNewCanvas(id);
        $(c).addClass('canvas');
        $('#island').append(c);
    } else {
        c.width = parseInt(document.getElementById('mapWidth').value);
        c.height = parseInt(document.getElementById('mapHeight').value);
    }

    return c;
}

function createNewCanvas(id) {
    let c = document.createElement("canvas");
    c.width = parseInt(document.getElementById('mapWidth').value);
    c.height = parseInt(document.getElementById('mapHeight').value);
    c.id = id;
    return c;
}