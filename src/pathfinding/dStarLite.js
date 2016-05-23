
const N_DIRECTIONS_WITHOUT_DIAGONALS = 4;
const N_DIRECTIONS_WITH_DIAGONALS = 8;
const delta_x = [0, 1, -1, 0, 1, 1, -1, -1];
const delta_y = [1, 0, 0, -1, -1, 1, 1, -1];

function comparator(node1, node2) {
    var cell1 = node1.maze_cell;
    var cell2 = node2.maze_cell;
    if (cell1.x == cell2.x && cell1.y == cell2.y) {
        return true;
    }

    return false;
}

function priority(i, j) {
    return !this.content[i].lessThanForHeap(this.content[j]);
}

function Maze(w, h, probability_to_block_a_cell, max_cost, fix_start_and_goal) {
    if (w < 2 || h < 2 || probability_to_block_a_cell > 1 || probability_to_block_a_cell < 0 || max_cost > 0x7F || max_cost < 1)
        return;

    this.w = w;
    this.h = h;
    this.cells = [];

    for (let y = 0; y < h; y++) {
        this.cells[y] = [];
        for (let x = 0; x < w; x++) {
            let blocked = (Math.random() < probability_to_block_a_cell);
            let cost = Math.floor((Math.random() * max_cost) + 1);//random.nextInt(max_cost) + 1;

            this.cells[y][x] = new MazeCell(x, y, cost);
            if (blocked)
                this.cells[y][x].block();
        }
    }

    /* Choose the start cell. */
    let x, y;
    if (fix_start_and_goal) {
        x = this.w - 1;
        y = this.h - 1;
    } else {
        x = Math.floor((Math.random() * w));//random.nextInt(w);
        y = Math.floor((Math.random() * h));//random.nextInt(h);
    }
    this.setStart(x, y);

    /* Choose the goal cell. */
    do {
        let x, y;
        if (fix_start_and_goal) {
            x = 0;
            y = 0;
        } else {
            x = Math.floor((Math.random() * w));//random.nextInt(w);
            y = Math.floor((Math.random() * h));//random.nextInt(h);
        }
        this.setGoal(x, y);
    } while (this.start == this.goal);
}

Maze.prototype = {

    /*clone: function() {
        var maze = null;
        try {
            maze = (Maze) super.clone();
        } catch (CloneNotSupportedException e) {
        }

        maze.w = this.w;
        maze.h = this.h;

        maze.cells = new MazeCell[this.h][this.w];
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                maze.cells[y][x] = this.cells[y][x].clone();
            }
        }

        maze.start = maze.cells[this.start.y][this.start.x];
        maze.goal = maze.cells[this.goal.y][this.goal.x];

        return maze;
    },*/

    drawMazeOnCanvas: function(canvas) {
        var goal = this.getGoal();

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                var ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.rect((i * 10), (j * 10), 10, 10);

                if (i == goal.x && j == goal.y) {
                    ctx.fillStyle = '#00FFFF';
                }
                else if (mz.cells[i][j].isBlocked()) {
                    ctx.fillStyle = '#CD5C5C';
                }
                else if (mz.cells[i][j].cost > 1) {
                    ctx.fillStyle = '#696969';
                }
                else {
                    ctx.fillStyle = '#FFFF00';
                }
                ctx.fill();
            }
        }
    },

    cleanPath: function() {
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                this.cells[y][x].clearPathFlag();
            }
        }
    },

    getGoal: function() {
        return this.goal;
    },

    getStart: function() {
        return this.start;
    },

    getMazeCell: function(x, y) {
        return this.cells[y][x];
    },

    getH: function() {
        return this.h;
    },

    getW: function() {
        return this.w;
    },

    copy: function(maze) {
        this.start = this.cells[maze.getStart().getY()][maze.getStart().getX()];
        this.goal = this.cells[maze.getGoal().getY()][maze.getGoal().getX()];

        if (maze.w != this.w || maze.h != this.h) {
            return;
        }

        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                this.cells[y][x].copyConfiguration(maze.getMazeCell(x, y));
            }
        }
    },

    setGoalCell: function(maze_cell) {
        this.goal = maze_cell;
        if (maze_cell.isBlocked())
            maze_cell.setCost(1);
    },

    setStartCell: function(maze_cell) {
        this.start = maze_cell;
        if (maze_cell.isBlocked())
            maze_cell.setCost(1);
    },

    setGoal: function(x, y) {
        this.setGoalCell(this.cells[y][x]);
    },

    setStart: function(x, y) {
        this.setStartCell(this.cells[y][x]);
    },

    /*toString: function() {
        StringBuilder s = new StringBuilder("W: " + this.w + " H: " + this.h + "\n");

        s.append("   ");
        for (delete x = 0; x < this.w; x++) {
            s.append(String.format("%2d ", x + 1));
        }
        s.append('\n');

        for (int y = 0; y < this.h; y++) {
            s.append(" ").append((char)('A' + y)).append(" ");
            for (int x = 0; x < this.w; x++) {
                if (this.cells[y][x] == this.goal) {
                    s.append(String.format("G%d ", this.cells[y][x].getCost()));
                } else if (this.cells[y][x] == this.start) {
                    s.append(String.format("S%d ", this.cells[y][x].getCost()));
                } else if (this.cells[y][x].isBlocked()) {
                    s.append(" X ");
                } else if (this.cells[y][x].isPathFlagOn()) {
                    s.append(" . ");
                } else {
                    s.append(String.format(" %d ", this.cells[y][x].getCost()));
                }
            }
            s.append("\n");
        }
        return s.toString();
    },*/

    equals: function(maze) {
        if (maze === null)
            return false;

        if (maze.h != this.h || maze.w != this.w || !maze.start.equalsCoordinatesAndCost(this.start) || !maze.goal.equalsCoordinatesAndCost(this.goal))
            return false;

        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                if (!maze.cells[y][x].equalsCoordinatesAndCost(this.cells[y][x])) {
                    return false;
                }
            }
        }
        return true;
    }
};

function MazeCell(x, y, cost) {
    if (x < 0 || y < 0 || cost < 1 || cost >= this.BLOCKED)
        throw new IllegalArgumentException();
    this.x = x;
    this.y = y;
    this.cost = cost;
    this.next_maze_cell = null;
}

MazeCell.prototype = {
    BLOCKED: 0x7F,

    block: function() {
        this.setCost(this.BLOCKED);
    },

    clearPathFlag: function() {
        this.cost &= 0x7F;
    },

    clone: function() {
        var maze_cell = new MazeCell();

        maze_cell.x = this.x;
        maze_cell.y = this.y;
        maze_cell.cost = this.cost;
        maze_cell.next_maze_cell = this.next_maze_cell;

        return maze_cell;
    },

    getCost: function() {
        return (this.cost & 0x7F);
    },

    getNextMazeCell: function() {
        return this.next_maze_cell;
    },

    getX: function() {
        return this.x;
    },

    getY: function() {
        return this.y;
    },

    isBlocked: function() {
        return this.getCost() == this.BLOCKED;
    },

    isPathFlagOn: function() {
        return (this.cost & 0x80) !== 0;
    },

    setCost: function(cost) {
        if (cost > 0x7F)
            throw new IllegalArgumentException();
        this.cost = cost;
    },

    setNextMazeCell: function(maze_cell) {
        this.next_maze_cell = maze_cell;
    },

    unsetPathFlag: function() {
        this.cost &= ~0x80;
    },

    setPathFlag: function() {
        this.cost |= 0x80;
    },

    copyConfiguration: function(mazeCell) {
        this.cost = mazeCell.cost;
    },

    toString: function() {
        var aux = this.x + 1;
        return new String((aux < 10 ? " " : "") + Number.toString(aux) + Character.toString((char)(this.y + 'A')));
    },

    equalsCoordinatesAndCost: function(maze_cell) {
        return maze_cell.x == this.x && maze_cell.y == this.y && maze_cell.getCost() == this.getCost();
    },

    equals: function(obj) {
        if (obj === null)
            return false;

        return obj.x == this.x && obj.y == this.y;
    }
};

/* Private: */
function DStarLiteNode(mz_cell) {
    /* Public: */
    this.maze_cell = mz_cell;
    this.g = Number.MAX_VALUE;
    this.rhs = Number.MAX_VALUE;
}

DStarLiteNode.prototype = {
    lessThanForHeap: function(dStarLiteNode) {
        if (this.k1 == dStarLiteNode.k1)
            return this.k2 < dStarLiteNode.k2;
        return this.k1 < dStarLiteNode.k1;
    },

    getMazeCell: function() {
        return this.maze_cell;
    },

    CalculateKey: function(km, h) {
        this.k2 = Math.min(this.g, this.rhs);
        this.k1 = this.k2 == Number.MAX_VALUE ? Number.MAX_VALUE : this.k2 + h + km;
    },

    toString: function() {
        return String.format("%s [%2d %2d]", this.maze_cell.toString(), this.k1, this.k2);
    },

    clone: function() {
        let clone = new DStarLiteNode(this.maze_cell);

        clone.parent = this.parent;
        clone.g = this.g;
        clone.rhs = this.rhs;
        clone.k1 = this.k1;
        clone.k2 = this.k2;

        return clone;
    }
};

function DStarLite(maze, mark_path, step_by_step, heuristic, neighborhood) {
    this.heuristic = heuristic;

    this.w = maze.getW();
    this.h = maze.getH();
    this.km = 0;
    /* Initialize the graph. */
    this.graph = [];
    for (let y = 0; y < this.h; y++) {
        this.graph[y] = [];
        for (let x = 0; x < this.w; x++) {
            this.graph[y][x] = new DStarLiteNode(maze.getMazeCell(x, y));
        }
    }
    this.open_list = new BinaryHeap(comparator, priority);

    this.has_solution = false;
    this.step_by_step = step_by_step;
    this.neighborhood = neighborhood;
    this.mark_path = mark_path;

    this.last_agent_position = this.agent_position = this.graph[maze.getStart().getY()][maze.getStart().getX()];
    this.goal = this.graph[maze.getGoal().getY()][maze.getGoal().getX()];
    this.goal.rhs = 0;
    this.iteration = 0;
    this.calculateKey(this.goal);
    this.open_list.insert(this.goal);
}

DStarLite.prototype = {

    getPathCost: function getPathCost() {
        return this.path_cost;
    },

    setStepByStep: function(step_by_step) {
        this.step_by_step = step_by_step;
    },

    hasSolution: function() {
        return this.has_solution;
    },

    informNewStart: function(new_start) {
        var new_agent_position = this.graph[new_start.getY()][new_start.getX()];

        this.last_agent_position = this.agent_position;
        this.agent_position = new_agent_position;
    },

    informUnblockedCells: function(unblocked_cells) {
        this.unblocked_cells = unblocked_cells;
    },

    informBlockedCells: function(blocked_cells) {
        this.blocked_cells = blocked_cells;
    },

    solve: function() {
        if (this.iteration === 0 || !this.unfinished_iteration) {
            this.unfinished_iteration = true;
            this.execution_finished = false;
            this.has_solution = false;

            this.km += this.heuristic.distanceToGoal(this.agent_position.getMazeCell(), this.last_agent_position.getMazeCell());
            this.iteration++;
        }

        /* If some cell cost changed. */
        if (this.blocked_cells !== undefined) {
            for (let i = 0; this.blocked_cells.length; i++) {
                let mazeCell = blocked_cells[i];
                let node = this.graph[mazeCell.getY()][mazeCell.getX()];

                node.g = node.rhs = Number.MAX_VALUE;
                node.last_change_iteration = this.iteration;

                if (this.open_list.has(node)) {
                    this.open_list.delete(node);
                }

                for (let j = 0; j < this.neighborhood; j++) {
                    let x, y;
                    x = node.getMazeCell().getX() + delta_x[j];
                    y = node.getMazeCell().getY() + delta_y[j];
                    if (0 <= x && x < this.w && 0 <= y && y < this.h) {
                        let neighbour = this.graph[y][x];
                        if (neighbour.getMazeCell().isBlocked())
                            continue;
                        this.updateNode(neighbour);

                    }

                }
                if (this.step_by_step) {
                    i.remove();
                    this.execution_finished = false;
                    return;
                }
            }
            this.blocked_cells = null;
        }

        if (this.unblocked_cells !== undefined) {
            for (let i = this.unblocked_cells.iterator(); i.hasNext();) {
                let mazeCell = i.next();
                let node = this.graph[mazeCell.getY()][mazeCell.getX()];
                //assert (!node.getMazeCell().isBlocked());

                /* There is no need to initialize node. It has already been done on constructor and/or on "blocked_cells" iteration loop. */
                this.updateNode(node);

                for (let j = 0; j < this.neighborhood; j++) {
                    let x, y;
                    x = node.getMazeCell().getX() + delta_x[j];
                    y = node.getMazeCell().getY() + delta_y[j];
                    if (0 <= x && x < this.w && 0 <= y && y < this.h) {
                        let neighbour = this.graph[y][x];
                        if (neighbour.getMazeCell().isBlocked())
                            continue;
                        this.updateNode(neighbour);

                    }
                }
                if (this.step_by_step) {
                    i.remove();
                    this.execution_finished = false;
                    return;
                }
            }
            this.unblocked_cells = null;
        }

        this.execution_finished = this.computeShortesPath();
        if (this.execution_finished) {
            this.unfinished_iteration = false;
            if (this.agent_position.g != Number.MAX_VALUE) {
                this.has_solution = true;
                this.path_cost = this.agent_position.rhs;
                if (this.mark_path)
                    this.markPath();
            }
        }
    },

    getMazeCellLastChangeIteration: function(maze_cell) {
        return this.graph[maze_cell.getY()][maze_cell.getX()].last_change_iteration;
    },

    getMazeCellG: function(maze_cell) {
        return this.graph[maze_cell.getY()][maze_cell.getX()].g;
    },

    getMazeCellRHS: function(maze_cell) {
        return this.graph[maze_cell.getY()][maze_cell.getX()].rhs;
    },

    getMazeCellH: function(maze_cell) {
        return this.heuristic.distanceToGoal(maze_cell, this.agent_position.getMazeCell());
    },

    /*getOpenListText: function() {
        StringBuilder stringBuilder = new StringBuilder();

        for (BinaryHeapElement e : this.open_list.asSortedList()) {
            stringBuilder.append(e.toString()).append('\n');
        }

        return stringBuilder.toString();
    },*/

    isInOpenList: function(maze_cell) {
        return this.open_list.has(this.graph[maze_cell.getY()][maze_cell.getX()]);
    },

    getLastIteration: function() {
        return this.iteration;
    },

    hasExecutionFinished: function() {
        return this.execution_finished;
    },

    calculateKey: function(node) {
        let h = this.heuristic.distanceToGoal(node.getMazeCell(), this.agent_position.getMazeCell());
        node.CalculateKey(this.km, h);
    },

    getNodeCost: function(node) {
        //assert !node.getMazeCell().isBlocked();assert
        return node.getMazeCell().getCost();
    },

    computeShortesPath: function() {
        //try {
        for (let c = 0; ; c++) {
            let node, aux;

            /* Check the condition to continue. */
            if (this.open_list.size() === 0)
                break;
            aux = this.agent_position.clone();
            this.calculateKey(aux);
            node = this.open_list.peek();
            if (!(node.lessThanForHeap(aux) || this.agent_position.rhs != this.agent_position.g))
                break;

            if (this.step_by_step && c > 0) {
                return false;
            }

            node = this.open_list.pop();
            aux = node.clone();
            this.calculateKey(node);
            if (aux.lessThanForHeap(node)) {
                this.open_list.insert(node);

            } else if (node.g > node.rhs) {
                node.g = node.rhs;
                node.last_change_iteration = this.iteration;

                for (let i = 0; i < this.neighborhood; i++) {
                    let x, y;
                    x = node.getMazeCell().getX() + delta_x[i];
                    y = node.getMazeCell().getY() + delta_y[i];
                    if (0 <= x && x < this.w && 0 <= y && y < this.h) {
                        let neighbour = this.graph[y][x];
                        if (neighbour.getMazeCell().isBlocked())
                            continue;
                        this.updateNode(neighbour);

                    }
                }

            } else {
                node.g = Number.MAX_VALUE;
                node.last_change_iteration = this.iteration;

                for (let i = 0; i < this.neighborhood; i++) {
                    let x, y;
                    x = node.getMazeCell().getX() + delta_x[i];
                    y = node.getMazeCell().getY() + delta_y[i];
                    if (0 <= x && x < this.w && 0 <= y && y < this.h) {
                        let neighbour = this.graph[y][x];
                        if (neighbour.getMazeCell().isBlocked())
                            continue;
                        this.updateNode(neighbour);

                    }
                }

                this.updateNode(node);
            }

        }

        /*} catch (e) {
            console.log(e);
        }*/

        return true;
    },

    markPath: function() {
        let node, node_parent;

        node = this.agent_position;
        node_parent = node.parent;

        while (true) {
            node.getMazeCell().setNextMazeCell(node_parent.getMazeCell());
            node.getMazeCell().setPathFlag();
            node = node_parent;
            node_parent = node.parent;
            if (node_parent === undefined) {
                node.getMazeCell().setNextMazeCell(undefined);
                break;
            }
            node.getMazeCell().setNextMazeCell(node_parent.getMazeCell());
            console.log(node.maze_cell);
        }
    },

    updateNode: function(node) {
        if (node != this.goal) {

            node.rhs = Number.MAX_VALUE;
            node.parent = null;

            for (let i = 0; i < this.neighborhood; i++) {
                let x, y;

                x = node.getMazeCell().getX() + delta_x[i];
                y = node.getMazeCell().getY() + delta_y[i];
                let cost = this.getNodeCost(node);

                if (0 <= x && x < this.w && 0 <= y && y < this.h) {
                    let neighbour = this.graph[y][x];

                    /* The start cell cannot generate children. */
                    if (neighbour.getMazeCell().isBlocked())
                        continue;

                    let aux = neighbour.g == Number.MAX_VALUE ? Number.MAX_VALUE : neighbour.g + cost;
                    if (node.rhs > aux) {
                        node.rhs = aux;
                        node.parent = neighbour;
                        node.last_change_iteration = this.iteration;
                    }
                }
            }
        }
        if (this.open_list.has(node))
            this.open_list.delete(node);

        if (node.g != node.rhs) {
            this.calculateKey(node);
            this.open_list.insert(node);
        }
    }
};