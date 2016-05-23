// really stupid recursive maze solver
// haven't tested it, may be not working or treated seriously

'use strict';
const width = 100;
const height = 100;

var maze = build2dArray(100, 100); //1 The maze
var wasHere = build2dArray(100, 100);
var correctPath = build2dArray(100, 100); // The solution to the maze
var startX = 1;
var startY = 1; // Starting X and Y values of maze
var endX, endY = 50;     // Ending X and Y values of maze

//solveMaze();

function solveMaze() {
    maze = generateMaze(); // Create Maze (1 = path, 2 = wall)
    for (var row = 0; row < maze.length; row++)
        // Sets boolean Arrays to default values
        for (var col = 0; col < maze[row].length; col++) {
            wasHere[row][col] = false;
            correctPath[row][col] = false;
        }
    var b = recursiveSolve(startX, startY);
    // Will leave you with a boolean array (correctPath) 
    // with the path indicated by true values.
    // If b is false, there is no solution to the maze
}

function recursiveSolve(x, y) {
    if (x == endX && y == endY) return true; // If you reached the end
    if (maze[x][y] == 2 || wasHere[x][y]) return false;
    // If you are on a wall or already were here
    wasHere[x][y] = true;
    if (x !== 0) // Checks if not on left edge
        if (recursiveSolve(x - 1, y)) { // Recalls method one to the left
            correctPath[x][y] = true; // Sets that path value to true;
            return true;
        }
    if (x != width - 1) // Checks if not on right edge
        if (recursiveSolve(x + 1, y)) { // Recalls method one to the right
            correctPath[x][y] = true;
            return true;
        }
    if (y !== 0)  // Checks if not on top edge
        if (recursiveSolve(x, y - 1)) { // Recalls method one up
            correctPath[x][y] = true;
            return true;
        }
    if (y != height - 1) // Checks if not on bottom edge
        if (recursiveSolve(x, y + 1)) { // Recalls method one down
            correctPath[x][y] = true;
            return true;
        }
    return false;
}

function generateMaze() {
    var result = build2dArray(100,100);

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            result[i][j] = 1;
        }
    }

    return result;
}

function build2dArray(width, height) {
    var result = [];

    for (var i = 0; i < height; i++) {
        var line = [];

        result.push(line);
    }

    return result;
}