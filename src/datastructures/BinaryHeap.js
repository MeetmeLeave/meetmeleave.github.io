function BinaryHeap(compareFunction, priorityFunction) {
    this.content = [];
    if (compareFunction) {
        this.equals = compareFunction;
    }

    if (priorityFunction) {
        this.isHigherPriority = priorityFunction;
    }
}

BinaryHeap.prototype = {
    insert: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    },

    clear: function() {
        this.content = [];
    },

    peek: function() {
        return this.content[0];
    },

    has: function(node) {
        for (var i = 0; i < this.content.length; i++) {
            if (this.equals(node, this.content[i])) {
                return true;
            }
        }

        return false;
    },

    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    },

    delete: function(node) {
        var length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < length; i++) {
            if (this.content[i] != node) continue;
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i == length - 1) break;
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    },
    
    // returns size of the heap
    size: function() {
        return this.content.length;
    },

    bubbleUp: function(i) {

        while (i > 1) {
            var parentIndex = i >> 1; // <=> floor(i/2)

            if (!this.isHigherPriority(i, parentIndex)) break;

            this.swap(i, parentIndex);
            i = parentIndex;
        }

        this.content[i].binary_heap_index = 0x80000000 | i;
    },

    sinkDown: function(i) {

        while (i * 2 + 1 < this.content.length) {
            // if equal, left bubbles (maintains insertion order)
            var leftHigher = !this.isHigherPriority(i * 2 + 1, i * 2);
            var childIndex = leftHigher ? i * 2 : i * 2 + 1;

            // if equal, sink happens (maintains insertion order)
            if (this.isHigherPriority(i, childIndex)) break;

            this.content[i].binary_heap_index = 0x80000000 | i;
            this.content[childIndex].binary_heap_index = 0x80000000 | childIndex;

            this.swap(i, childIndex);
            i = childIndex;
        }
    },

    swap: function(i, j) {
        var temp = this.content[i];
        this.content[i] = this.content[j];
        this.content[j] = temp;
    },

    equals: function(i, j) {
        return this.content[i].data == this.content[j].data;
    },

    isHigherPriority: function(i, j) {
        return this.content[i].priority < this.content[j].priority;
    }
};