;
(function MapGenerator() {
    'use strict';
    let p;
    let resultingMap;

    // Generate perlin map - is broken at the moment need to fix it later
    function generate2dPerlinNoiseMap(xSize, ySize, scale) {
        let mapArray = [];

        for (let i = 1; i < xSize + 1; i++) {
            mapArray[i] = [];

            for (let j = 1; j < ySize + 1; j++) {
                mapArray[i][j] = p.noise(i * scale, j * scale);
            }
        }

        return mapArray;
    }

    // The circle determines height values and the noise determines moisture
    function generate2dPerlinCircularMap(xSize, ySize, scale) {
        let mapArray = [];
        let centerX = xSize / 2;
        let centerY = ySize / 2;

        for (let i = 1; i < xSize + 1; i++) {
            mapArray[i] = [];

            for (let j = 1; j < ySize + 1; j++) {
                mapArray[i][j] = Math.sqrt(Math.pow(centerX - i, 2) + Math.pow(centerY - j, 2)) / (xSize + ySize) * 2 + p.noise(i * scale, j * scale);
            }
        }

        return mapArray;
    }

    // removes 5 lines of values around the map, to become water
    function removeBorders() {
        for (let i = 1; i < resultingMap.length; i++) {
            for (let j = 1; j < resultingMap[i].length; j++) {
                if (i <= 5 || j <= 5 || i + 5 >= resultingMap.length || j + 5 >= resultingMap[i].length) {
                    resultingMap[i][j] = 1.5;
                    continue;
                }
            }
        }
    }

    // draws map on the canvas using link to the canvas obj
    function visualize2dMap(canvas, mode) {
        let ctx = canvas.getContext('2d');
        for (let x = 1; x < resultingMap.length; x++) {
            for (let y = 1; y < resultingMap[x].length; y++) {
                let noiseval = resultingMap[x][y];
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

    // Propagates similarity between neighbour values, to have map shapes more pretty
    function normalizeNoiseMap(countOfNoiseNormalsTimes) {
        for (let i = 0; i < countOfNoiseNormalsTimes; i++) {
            normalizeNoiseValues();
        }
    }

    // Performs map normalization
    function normalizeNoiseValues() {
        for (let i = 1; i < resultingMap.length; i++) {
            for (let j = 1; j < resultingMap[i].length; j++) {
                if (i <= 5 || j <= 5 || i + 5 >= resultingMap.length || j + 5 >= resultingMap[i].length) {
                    continue;
                }

                //let currentValue = resultingMap[i][j];
                let topValue = resultingMap[i][j - 1];
                let bottomValue = resultingMap[i][j + 1];
                let leftValue = resultingMap[i - 1][j];
                let rightValue = resultingMap[i + 1][j];
                let topRightValue = resultingMap[i + 1][j - 1];
                let topLeftValue = resultingMap[i - 1][j - 1];
                let bottomRightValue = resultingMap[i + 1][j + 1];
                let bottomLeftValue = resultingMap[i - 1][j + 1];

                resultingMap[i][j] = (topRightValue + topLeftValue + bottomRightValue + bottomLeftValue + topValue + bottomValue + leftValue + rightValue) / 8;
            }
        }
    }

    // Performs spread of moisture using wind
    function applyWindToSpreadTheMoisture() {

    }

    // Draws map in grey shades
    function greyScaledMap(noiseval) {
        let greyval = Math.round(noiseval * 255);
        return 'rgb(' + greyval + ',' + greyval + ',' + greyval + ')';
    }

    // Uses colors to draw the map
    function coloredScaleMap(noiseval) {
        let result;

        // Snow Mountain
        if (noiseval <= 0.3) {
            result = '#F0F8FF';
        }
        // Mountain
        else if (noiseval > 0.3 && noiseval <= 0.5) {
            result = '#696969';
        }
        // Forest
        else if (noiseval > 0.5 && noiseval <= 0.75) {
            result = '#228B22';
        }
        // Plains
        else if (noiseval > 0.75 && noiseval <= 0.9) {
            result = '#00FF00';
        }
        // Sand 
        else if (noiseval > 0.9 && noiseval <= 1) {
            result = '#FFFF00';
        }
        // Water
        else if (noiseval > 1 && noiseval <= 1.1) {
            result = '#1E90FF';
        } else {
            result = '#0000ff';
        }

        return result;
    }

    // core object promoted to the window level by the module
    // stores public config values and functions available to public use
    window.mapgen = {
        config: {
            // default values
            seed: 1024,
            sizex: 50,
            sizey: 50,
            scale: 0.5,
            removeBorders: false,
            countOfNoiseNormalsTimes: 0
        },
        createRandomPerlinMap: function () {
            p = new Perlin(this.config.seed);
            resultingMap = generate2dPerlinNoiseMap(this.config.sizex, this.config.sizey, this.config.scale);
            if (this.config.removeBorders) {
                removeBorders();
            }
            
            normalizeNoiseMap(this.config.countOfNoiseNormalsTimes);
        },
        createRandomIslandMap: function () {
            p = new Perlin(this.config.seed);
            resultingMap = generate2dPerlinCircularMap(this.config.sizex, this.config.sizey, this.config.scale);
            if (this.config.removeBorders) {
                removeBorders();
            }
            
            normalizeNoiseMap(this.config.countOfNoiseNormalsTimes);
        },
        vizualizeMap: function (canvas, mode) {
            visualize2dMap(canvas, mode);
        }
    };
})();