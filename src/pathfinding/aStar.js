'use strict';

function aStarNode(x, y, cost) {
    this.x = x;
    this.y = y;
    this.cost = cost;

    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.parent = null;
}

aStarNode.prototype.f = function () {
    return this.g + this.h;
};

aStarNode.prototype.convertToCoordinates = function () {
    return {
        x: this.x,
        y: this.y
    };
};

aStarNode.prototype.equals = function (node) {
    return this.x == node.x && this.y == node.y;
};

let equals = function aStarEquals(node1, node2) {
    return node1.equals(node2);
};

let compare = function aStarCompare(prio1, prio2) {
    return prio1 > prio2;
};

function aStar(map, start, goal) {
    this.heuristic = new Heuristic();
    this.startNode = new aStarNode(start[0], start[1], map[start[0]][start[1]]);
    this.goalNode = new aStarNode(goal[0], goal[1], map[goal[0]][goal[1]]);

    this.setH(this.startNode);

    let queue = new PriorityQueue(null, compare, equals);

    queue.push(this.startNode, this.startNode.f());

    while (!queue.empty()) {
        let currentNode = queue.pop();

        if (currentNode.equals(this.goalNode) || currentNode.cost >= 1) {
            this.goalNode = currentNode;
            break;
        }

        let smallestCost;

        this.getNeighbors(currentNode, map).forEach(function (neighbor) {

            let cost = currentNode.g + neighbor.cost;

            if (smallestCost === undefined) {
                smallestCost = cost;
            }

            if (!neighbor.visited || cost < smallestCost) {
                neighbor.g = cost;
                this.setH(neighbor);
                neighbor.visited = true;
                neighbor.parent = currentNode;
                queue.push(neighbor, neighbor.f());
            }

        }, this);
    }

    return this.traversePath();
}

aStar.prototype.setH = function (node) {
    node.h = this.heuristic.manhattanDistance(node.x, node.y, this.goalNode.x, this.goalNode.y);
};

aStar.prototype.getNeighbors = function (node, map) {
    let neighbors = [];

    let left = node.x - 1;
    let right = node.x + 1;
    let top = node.y - 1;
    let bottom = node.y + 1;

    neighbors.push(new aStarNode(left, node.y, map[left][node.y]));
    neighbors.push(new aStarNode(right, node.y, map[right][node.y]));
    neighbors.push(new aStarNode(node.x, top, map[node.x][top]));
    neighbors.push(new aStarNode(node.x, bottom, map[node.x][bottom]));
    neighbors.push(new aStarNode(left, top, map[left][top]));
    neighbors.push(new aStarNode(right, bottom, map[right][bottom]));
    neighbors.push(new aStarNode(left, bottom, map[left][bottom]));
    neighbors.push(new aStarNode(right, top, map[right][top]));

    return neighbors;
};

aStar.prototype.traversePath = function () {
    let path = [];

    let node = this.goalNode;

    while (node !== null) {
        path.push(node.convertToCoordinates());

        node = node.parent;
    }

    return path;
};