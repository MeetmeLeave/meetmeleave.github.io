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
    mapgen.config.scale = 0.08;
    mapgen.createRandomIslandMap();
    mapgen.vizualizeMap(c, 'color');
}