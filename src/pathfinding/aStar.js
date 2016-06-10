'use strict';

function aStarNode(x, y, cost, costMultiplier) {
    this.x = x;
    this.y = y;
    this.cost = parseInt(cost * costMultiplier);

    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.parent = null;
}

aStarNode.prototype.convertToCoordinates = function() {
    return {
        x: this.x,
        y: this.y
    };
};

aStarNode.prototype.equals = function(node) {
    return this.x == node.x && this.y == node.y;
};

let equals = function aStarEquals(node1, node2) {
    return node1.equals(node2);
};

let compare = function aStarCompare(i, j) {
    return this.heap[i].priority < this.heap[j].priority;
};

function aStar(map, start, goal, costMultiplier) {
    this.costMultiplier = costMultiplier;
    this.heuristic = new Heuristic();
    this.startNode = new aStarNode(start[0], start[1], map[start[0]][start[1]], this.costMultiplier);
    this.goalNode = new aStarNode(goal[0], goal[1], map[goal[0]][goal[1]], this.costMultiplier);

    this.openList = new PriorityQueue(null, compare, equals);
    this.closedList = new PriorityQueue(null, compare, equals);

    this.startNode.h = this.calculateH(this.startNode);
    this.startNode.f = this.startNode.g + this.startNode.h;
    this.openList.push(this.startNode, this.startNode.f);

    while (!this.openList.empty()) {
        let currentNode = this.openList.pop();

        if (currentNode.equals(this.goalNode)) {
            return this.buildPath(currentNode);
        }

        let neighbors = this.getNeighbors(currentNode, map);
        for (let j = 0; j < neighbors.length; j++) {
            let neighbor = neighbors[j];
            neighbor.parent = currentNode;

            neighbor.g = currentNode.g + neighbor.cost;
            neighbor.h = this.calculateH(neighbor);
            neighbor.f = neighbor.g + neighbor.h;

            let openIndex = this.openList.contains(neighbor);
            let closedIndex = this.closedList.contains(neighbor);

            if (openIndex != -1) {
                if (this.openList.heap[openIndex].priority <= neighbor.f) {
                    continue;
                } else {
                    this.openList.updateByIndex(openIndex, neighbor, neighbor.f);
                }
            } else if (closedIndex != -1) {
                if (this.closedList.heap[closedIndex].priority <= neighbor.f) {
                    continue;
                } else {
                    this.closedList.updateByIndex(closedIndex, neighbor, neighbor.f);
                    this.openList.push(neighbor, neighbor.f);
                }
            } else {
                this.openList.push(neighbor, neighbor.f);
            }
        }

        let closedIndex = this.closedList.contains(currentNode);

        if (closedIndex != -1) {
            this.closedList.updateByIndex(closedIndex, currentNode, currentNode.f);
        } else {
            this.closedList.push(currentNode, currentNode.f);
        }
    }

    return [];
}

aStar.prototype.calculateH = function(node) {
    return this.heuristic.manhattanDistance(node.x, node.y, this.goalNode.x, this.goalNode.y);
};

aStar.prototype.getNeighbors = function(node, map) {
    let neighbors = [];

    let left = node.x - 1;
    let right = node.x + 1;
    let top = node.y - 1;
    let bottom = node.y + 1;

    if (left >= 0) {
        neighbors.push(new aStarNode(left, node.y, map[left][node.y], this.costMultiplier));
    }
    if (right < map.length) {
        neighbors.push(new aStarNode(right, node.y, map[right][node.y], this.costMultiplier));
    }
    if (top >= 0) {
        neighbors.push(new aStarNode(node.x, top, map[node.x][top], this.costMultiplier));
    }
    if (bottom < map[node.x].length) {
        neighbors.push(new aStarNode(node.x, bottom, map[node.x][bottom], this.costMultiplier));
    }
    if (left >= 0 && top >= 0) {
        neighbors.push(new aStarNode(left, top, map[left][top], this.costMultiplier));
    }
    if (right < map.length && bottom < map[node.x].length) {
        neighbors.push(new aStarNode(right, bottom, map[right][bottom], this.costMultiplier));
    }
    if (left >= 0 && bottom < map[node.x].length) {
        neighbors.push(new aStarNode(left, bottom, map[left][bottom], this.costMultiplier));
    }
    if (right < map.length && top >= 0) {
        neighbors.push(new aStarNode(right, top, map[right][top], this.costMultiplier));
    }

    return neighbors;
};

aStar.prototype.buildPath = function(node) {
    let path = [];

    let goal = node;

    while (goal != null) {
        path.push(goal.convertToCoordinates());
        goal = goal.parent;
    }

    return path;
};