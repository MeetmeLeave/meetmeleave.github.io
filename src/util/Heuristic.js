function Heuristic() {
}

Heuristic.prototype = {
    distanceToGoal: function(maze_cell, goal) {
        return this.diagonalDistance(maze_cell.getX(), maze_cell.getY(), goal.getX(), goal.getY());
    },

    eightDirectionsDistance: function(x1, y1, x2, y2) {
    },

    manhattanDistance: function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    diagonalDistance: function(x1, y1, x2, y2) {
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    }
};