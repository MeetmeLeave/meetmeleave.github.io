'use strict';

function aStarNode(x, y, cost) {
    this.x = x;
    this.y = y;
    this.cost = cost;

    this.g = 0;
    this.h = 0;
    this.parent = null;
}

aStarNode.prototype.f = function() {
    return this.g + this.h;
};

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

let compare = function aStarCompare(prio1, prio2) {
    return prio1 > prio2;
};

function aStar(map, start, goal /*, cantPassVal*/ ) {
    //this.cantPassVal = cantPassVal;
    this.heuristic = new Heuristic();
    this.startNode = new aStarNode(start[0], start[1], map[start[0]][start[1]]);
    this.goalNode = new aStarNode(goal[0], goal[1], map[goal[0]][goal[1]]);

    this.setH(this.startNode);

    let closedList = new PriorityQueue(null, compare, equals);
    let openList = new PriorityQueue(null, compare, equals);

    openList.push(this.startNode, this.startNode.f());

    while (!openList.empty()) {
        let currentNode = openList.pop();

        if (currentNode.equals(this.goalNode)) {
            break;
        }

        // let smallestCost;

        this.getNeighbors(currentNode, map).forEach(function(neighbor) {
            neighbor.parent = currentNode;

            if (neighbor.equals(this.goalNode)) {
                return this.traversePath();
            }

            neighbor.g = currentNode.g + 1;
            this.setH(neighbor);
            let openPrio = openList.peekPriority();
            let closePrio = closedList.peekPriority();
            if ((openPrio != null && openPrio < neighbor.f()) || (closePrio != null && closePrio < neighbor.f())) {
                openList.push(neighbor);
            }

            // if (!this.canPass(neighbor)) {
            //     // neighbor.parent = currentNode;
            //     // this.setH(neighbor);
            //     // let cost = currentNode.g + neighbor.cost;

            //     // if (smallestCost === undefined) {
            //     //     smallestCost = cost;
            //     // }

            //     // let contains = false;

            //     // for (let i = 0; i < closedList.length; i++) {
            //     //     if (neighbor.equals(closedList[i]) && neighbor.f() > closedList[i].f()) {
            //     //         contains = true;
            //     //         break;
            //     //     }
            //     // }

            //     // if (cost <= smallestCost && !contains) {
            //     //     neighbor.g = cost;
            //     //     closedList.push(neighbor);
            //     //     queue.push(neighbor, neighbor.f());
            //     // }
            // }
        }, this);

        closedList.push(currentNode);
    }

    return this.traversePath();
}

aStar.prototype.setH = function(node) {
    node.h = this.heuristic.manhattanDistance(node.x, node.y, this.goalNode.x, this.goalNode.y);
};

// aStar.prototype.canPass = function(node) {
//     this.cantPassVal <= node.cost;
// };

aStar.prototype.getNeighbors = function(node, map) {
    let neighbors = [];

    let left = node.x - 1;
    let right = node.x + 1;
    let top = node.y - 1;
    let bottom = node.y + 1;

    if (left >= 0) {
        neighbors.push(new aStarNode(left, node.y, map[left][node.y]));
    }
    if (right < map.length) {
        neighbors.push(new aStarNode(right, node.y, map[right][node.y]));
    }
    if (top >= 0) {
        neighbors.push(new aStarNode(node.x, top, map[node.x][top]));
    }
    if (bottom < map[node.x].length) {
        neighbors.push(new aStarNode(node.x, bottom, map[node.x][bottom]));
    }
    if (left >= 0 && top >= 0) {
        neighbors.push(new aStarNode(left, top, map[left][top]));
    }
    if (right < map.length && bottom < map[node.x].length) {
        neighbors.push(new aStarNode(right, bottom, map[right][bottom]));
    }
    if (left >= 0 && bottom < map[node.x].length) {
        neighbors.push(new aStarNode(left, bottom, map[left][bottom]));
    }
    if (right < map.length && top >= 0) {
        neighbors.push(new aStarNode(right, top, map[right][top]));
    }

    return neighbors;
};

aStar.prototype.traversePath = function() {
    let path = [];

    let node = this.goalNode;

    while (node !== null) {
        path.push(node.convertToCoordinates());

        node = node.parent;
    }

    return path;
};