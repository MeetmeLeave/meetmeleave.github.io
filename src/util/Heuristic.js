'use strict';
function Heuristic() {
}

Heuristic.prototype = {
    distanceToGoal: function (maze_cell, goal) {
        return this.diagonalDistance(maze_cell.getX(), maze_cell.getY(), goal.getX(), goal.getY());
    },

    eightDirectionsDistance: function (x1, y1, x2, y2) {
    },

    manhattanDistance: function (x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    diagonalDistance: function (x1, y1, x2, y2) {
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    },

    buildBresenhamsLine: function (x0, y0, x1, y1, callback) {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            callback(x0, y0);

            if ((x0 == x1) && (y0 == y1)) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }
};