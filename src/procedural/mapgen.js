; (function MapGenerator() {
    'use strict';
    var p;
    var resultingMap;

    function generate2dPerlinNoiseMap(xSize, ySize, scale) {
        var mapArray = [];

        for (var i = 1; i < xSize + 1; i++) {
            mapArray[i] = [];

            for (var j = 1; j < ySize + 1; j++) {
                mapArray[i][j] = p.noise(i * scale, j * scale);
            }
        }

        return mapArray;
    }

    function generate2dPerlinCircularMap(xSize, ySize, scale) {
        var mapArray = [];
        var centerX = xSize / 2;
        var centerY = ySize / 2;

        for (var i = 1; i < xSize + 1; i++) {
            mapArray[i] = [];

            for (var j = 1; j < ySize + 1; j++) {
                mapArray[i][j] = Math.sqrt(Math.pow(centerX - i, 2) + Math.pow(centerY - j, 2)) / (xSize + ySize) * 2 + p.noise(i * scale, j * scale);
            }
        }

        return mapArray;
    }

    function visualize2dMap(canvas, mode) {
        var ctx = canvas.getContext('2d');
        for (var x = 1; x < resultingMap.length; x++) {
            for (var y = 1; y < resultingMap[x].length; y++) {
                var noiseval = resultingMap[x][y];
                ctx.beginPath();
                ctx.rect((x * 2), (y * 2), 2, 2);
                switch (mode) {
                    case 'color':
                        ctx.fillStyle = coloredScaleMap(noiseval);
                        break;

                    case 'grey':
                        ctx.fillStyle = greyScaledMap(noiseval);
                        break;
                }

                ctx.fill();
            }
        }
    }

    function greyScaledMap(noiseval) {
        var greyval = Math.round(noiseval * 255);
        return 'rgb(' + greyval + ',' + greyval + ',' + greyval + ')';
    }

    function coloredScaleMap(noiseval) {
        var result;

        if (noiseval <= 0.3) {
            result = '#F0F8FF';
        }
        else if (noiseval > 0.3 && noiseval <= 0.5) {
            result = '#696969';
        }
        else if (noiseval > 0.5 && noiseval <= 0.75) {
            result = '#228B22';
        }
        else if (noiseval > 0.75 && noiseval <= 0.9) {
            result = '#00FF00';
        }
        else if (noiseval > 0.9 && noiseval <= 1) {
            result = '#FFFF00';
        }
        else {
            result = '#1E90FF';
        }

        return result;
    }
    
    window.mapgen = {
        config: {
            // default values
            seed: 1024,
            sizex: 50,
            sizey: 50,
            scale: 0.5
        },
        createRandomPerlinMap: function () {
            p = new Perlin(this.config.seed);
            resultingMap = generate2dPerlinNoiseMap(this.config.sizex, this.config.sizey, this.config.scale);
        },
        createRandomIslandMap: function () {
            p = new Perlin(this.config.seed);
            resultingMap = generate2dPerlinCircularMap(this.config.sizex, this.config.sizey, this.config.scale);
        },
        vizualizeMap: function (canvas, mode) {
            visualize2dMap(canvas, mode);
        }
    };
})();