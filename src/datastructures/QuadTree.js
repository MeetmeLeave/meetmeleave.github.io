'use strict';

// Example rectangular stucture, which can be stored inside the QuadTree
function Bounds(x, y, height, width, value) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.value = value;
}

Bounds.prototype = {
    // draw rectangle on canvas
    drawBounds: function(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#00FFFF';
        ctx.font = "7pt sans-serif";
        ctx.strokeText(this.value, this.x, this.y);
        ctx.fill();
    }
};

// QuadTree leaf structure, usually used to determine collissions or simplify objects search
function QuadTree(level, bounds) {
    this.level = level;
    this.bounds = bounds;
    this.objects = [];
    this.nodes = [];
}

QuadTree.prototype = {
    // Max amount of objects before split
    MAX_OBJECTS: 10,
    // Max level in depth we can go
    MAX_LEVELS: 5,

    // function to draw the tree leaf on the canvas with all objects
    drawTree: function(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.stroke();

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].drawTree(canvas);
        }

        if (this.nodes.length === 0) {
            for (let j = 0; j < this.objects.length; j++) {
                this.objects[j].drawBounds(canvas);
            }
        }
    },

    // clears tree objects
    clear: function() {
        for (let i = 0; this.nodes.length; i++) {
            if (this.nodes[i] !== undefined) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    },

    // splits tree on 4 equal parts
    split: function() {
        let subWidth = this.bounds.width / 2;
        let subHeight = this.bounds.height / 2;
        let x = this.bounds.x;
        let y = this.bounds.y;

        this.nodes[0] = new QuadTree(this.level + 1, new Bounds(x + subWidth, y, subWidth, subHeight));
        this.nodes[1] = new QuadTree(this.level + 1, new Bounds(x, y, subWidth, subHeight));
        this.nodes[2] = new QuadTree(this.level + 1, new Bounds(x, y + subHeight, subWidth, subHeight));
        this.nodes[3] = new QuadTree(this.level + 1, new Bounds(x + subWidth, y + subHeight, subWidth, subHeight));
    },

    /* Get index of the object inside the tree
    *  This is used internally to identify the object position on the leaf
    */
    getIndex: function(rect) {
        let index = -1;

        let verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
        let horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);

        let topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
        let bottomQuadrant = (rect.y > horizontalMidpoint);

        if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            }
            else if (bottomQuadrant) {
                index = 2;
            }
        }

        // Object can completely fit within the right quadrants
        else if (rect.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            }
            else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    },

    // inserts object inside the tree
    insert: function(rect) {
        if (this.nodes[0] !== undefined) {
            let index = this.getIndex(rect);

            if (index != -1) {
                this.nodes[index].insert(rect);
                return;
            }
        }

        this.objects.push(rect);

        if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
            if (this.nodes[0] === undefined) {
                this.split();
            }

            let i = 0;
            while (i < this.objects.length) {
                let index = this.getIndex(this.objects[i]);
                if (index != -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                }
                else {
                    i++;
                }
            }
        }
    }
};