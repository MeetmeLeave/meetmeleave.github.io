document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        generateMap();
    }
}

function generateMap() {
    var c = document.getElementById("c");
    mapgen.config.seed = parseInt(document.getElementById('seed').value);
    mapgen.config.sizex = 350;
    mapgen.config.sizey = 350;
    mapgen.config.removeBorders = !!document.getElementById('makeWater').checked;
    mapgen.config.scale = parseFloat(document.getElementById('perlinScale').value);
    mapgen.config.countOfNoiseNormalsTimes = parseInt(document.getElementById('noiseNormaliseCount').value);
    mapgen.createRandomIslandMap();
    mapgen.vizualizeMap(c, 'color');
}