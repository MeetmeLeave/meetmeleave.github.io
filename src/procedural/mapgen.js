;
(function MapGenerator() {
    'use strict';
    let p;
    let resultingMap;

    // The circle determines height values and the noise determines moisture
    function generate2dPerlinCircularMap(xSize, ySize, scale) {
        let mapArray = [];
        let centerX = xSize / 2;
        let centerY = ySize / 2;

        for (let i = 0; i < xSize + 1; i++) {
            mapArray[i] = [];

            for (let j = 0; j < ySize + 1; j++) {
                mapArray[i][j] = Math.sqrt(Math.pow(centerX - i, 2) + Math.pow(centerY - j, 2)) / (xSize + ySize) * 2 + p.noise(i * scale, j * scale);
            }
        }

        return mapArray;
    }

    // removes 5 lines of values around the map, to become water
    function removeBorders() {
        for (let i = 0; i < resultingMap.length; i++) {
            for (let j = 0; j < resultingMap[i].length; j++) {
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
        for (let x = 0; x < resultingMap.length; x++) {
            for (let y = 0; y < resultingMap[x].length; y++) {
                let noiseval = resultingMap[x][y];
                ctx.beginPath();
                ctx.rect((x), (y), 1, 1);
                switch (mode) {
                    case 'altitude':
                        ctx.fillStyle = coloredScaleAltitudeMap(noiseval);
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

    function addNoisyEdges() {

    }

    // Performs map normalization
    function normalizeNoiseValues() {
        for (let i = 0; i < resultingMap.length; i++) {
            for (let j = 0; j < resultingMap[i].length; j++) {
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

    // Adds rivers on map
    function generateRivers() {
        let endNode = pickRiverEndPoint();
        let startNode = pickRiverStartPoint();

        let path = new aStar(resultingMap, startNode, endNode, 10); //, 0.4);

        for (let i = 0; i < path.length; i++) {
            let x = path[i].x;
            let y = path[i].y;

            // Debug
            resultingMap[x][y] = 15;
        }
    }

    function pickRiverEndPoint() {
        for (let i = 0; i < resultingMap.length; i++) {
            for (let j = 0; j < resultingMap[i].length; j++) {
                let noiseval = resultingMap[i][j];

                if (i <= 5 || j <= 5 || i + 5 >= resultingMap.length || j + 5 >= resultingMap[i].length) {
                    continue;
                }

                if (noiseval < 1.1) {
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

                if (topValue >= 1.1 &&
                    bottomValue >= 1.1 &&
                    leftValue >= 1.1 &&
                    rightValue >= 1.1 &&
                    topRightValue >= 1.1 &&
                    topLeftValue >= 1.1 &&
                    bottomRightValue >= 1.1 &&
                    bottomLeftValue >= 1.1) {
                    continue;
                }

                return [i, j];
            }
        }
    }

    function pickRiverStartPoint() {
        for (let i = 0; i < resultingMap.length; i++) {
            for (let j = 0; j < resultingMap[i].length; j++) {
                let noiseval = resultingMap[i][j];

                if (noiseval > 0.5) {
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

                if (topValue <= 0.5 &&
                    bottomValue <= 0.5 &&
                    leftValue <= 0.5 &&
                    rightValue <= 0.5 &&
                    topRightValue <= 0.5 &&
                    topLeftValue <= 0.5 &&
                    bottomRightValue <= 0.5 &&
                    bottomLeftValue <= 0.5) {
                    continue;
                }

                return [i, j];
            }
        }
    }

    // Draws map in grey shades
    function greyScaledMap(noiseval) {
        let greyval = Math.round(noiseval * 255);
        return 'rgb(' + greyval + ',' + greyval + ',' + greyval + ')';
    }

    // Uses colors to draw the map
    function coloredScaleAltitudeMap(noiseval) {
        let result;

        // // Snow Mountain
        // if (noiseval <= 0.3) {
        //     result = '#F0F8FF';
        // }
        // // Mountain
        // else if (noiseval > 0.3 && noiseval <= 0.5) {
        //     result = '#696969';
        // }
        // // Forest
        // else if (noiseval > 0.5 && noiseval <= 0.75) {
        //     result = '#228B22';
        // }
        // // Plains
        // else if (noiseval > 0.75 && noiseval <= 0.9) {
        //     result = '#00FF00';
        // }
        // // Sand 
        // else if (noiseval > 0.9 && noiseval <= 1) {
        //     result = '#FFFF00';
        // }
        // // Water
        // else if (noiseval > 1 && noiseval <= 1.1) {
        //     result = '#1E90FF';
        // } 
        // // Deep water
        // else {
        //     result = '#0000ff';
        // }

        // Mountain
        if (noiseval <= 0.5) {
            result = '#F0F8FF';
        }
        // Land
        else if (noiseval > 0.5 && noiseval <= 1) {
            result = '#939393';
        }
        // Shallow Water
        else if (noiseval > 1 && noiseval <= 1.1) {
            result = '#3f3f3f';
        }
        // Deep water
        else {
            result = '#000000';
        }

        // Debug
        if (noiseval == 15) {
            result = '#ff0000';
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
        createRandomIslandMap: function () {
            p = new Perlin(this.config.seed);
            resultingMap = generate2dPerlinCircularMap(this.config.sizex, this.config.sizey, this.config.scale);
            if (this.config.removeBorders) {
                removeBorders();
            }

            normalizeNoiseMap(this.config.countOfNoiseNormalsTimes);

            generateRivers();
            // generateHeatMap();
            // // generateRainShadowMap();
            // generateMoisture();
            // generateBiomes();
        },
        generateRainShadowMap: function () { },
        vizualizeMap: function (canvas, mode) {
            visualize2dMap(canvas, mode);
        }
    };
})();