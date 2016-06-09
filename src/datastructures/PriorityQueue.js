'use strict';

function PriorityQueueNode(data, priority) {
    this.data = data;
    this.priority = priority;
}

PriorityQueueNode.prototype.toString = function() {
    return this.priority;
};

// accepts an array of objects which have data and priority
// optionaly can have compare for the priorities and equal for the data of nodes
function PriorityQueue(arr, compare, equal) {
    if (compare) {
        this.isHigherPriority = compare;
    }

    if (equal) {
        this.equals = equal;
    }

    this.heap = [null];
    if (arr !== null && arr !== undefined && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            this.push(arr[i].data, arr[i].priority);
        }
    }
}

PriorityQueue.prototype = {
    // adds new node
    push: function(data, priority) {
        var node = new PriorityQueueNode(data, priority);
        this.bubble(this.heap.push(node) - 1);
    },

    // removes and returns the data of highest priority
    pop: function() {
        var topVal = this.heap[1].data;
        this.heap[0] = this.heap.shift();
        //this.sink(1); 
        return topVal;
    },

    // returns top value
    peek: function() {
        return this.heap[1].data;
    },

    // returns top prio
    peekPriority: function() {
        return this.heap[1].priority;
    },

    // removes node from the hea[]
    delete: function(data) {
        var index = this.contains(data);

        if (index != -1) {
            this.heap.splice(index, 1);
            return true;
        }

        return false;
    },

    // updates node by its index, by removing it from the heap and pushing it with new priority
    updateByIndex: function(i, data, priority) {
        this.heap.splice(i, 1);
        this.push(data, priority);
    },

    // update removes existing node and pushed new node with updated priority
    update: function(data, priority) {
        for (let i = 1; i < this.heap.length; i++) {
            if (this.equals(data, this.heap[i].data)) {
                this.heap.splice(i, 1);
                this.push(data, priority);
            }
        }
    },

    // checks that any of the nodes has the value stored
    contains: function(val) {
        for (let i = 1; i < this.heap.length; i++) {
            if (this.equals(val, this.heap[i].data)) {
                return i;
            }
        }

        return -1;
    },

    equals: function(data1, data2) {
        return data1 === data2;
    },

    // bubbles node i up the binary tree based on
    // priority until heap conditions are restored
    bubble: function(i) {
        while (i > 1) {
            var parentIndex = i >> 1; // <=> floor(i/2)

            // if equal, no bubble (maintains insertion order)
            if (!this.isHigherPriority(i, parentIndex)) break;

            this.swap(i, parentIndex);
            i = parentIndex;
        }
    },

    // does the opposite of the bubble() function
    sink: function(i) {
        while (i * 2 + 1 < this.heap.length) {
            // if equal, left bubbles (maintains insertion order)
            var leftHigher = !this.isHigherPriority(i * 2 + 1, i * 2);
            var childIndex = leftHigher ? i * 2 : i * 2 + 1;

            // if equal, sink happens (maintains insertion order)
            if (this.isHigherPriority(i, childIndex)) break;

            this.swap(i, childIndex);
            i = childIndex;
        }
    },

    // swaps the addresses of 2 nodes
    swap: function(i, j) {
        var temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    },

    // returns true if node i is higher priority than j
    isHigherPriority: function(i, j) {
        return this.heap[i].priority < this.heap[j].priority;
    },

    empty: function() {
      return this.heap.length === 0;  
    }
};