'use strict';

class QueueIterator {
    /**
     *
     * @param {Queue} collection
     */
    constructor(collection) {
        if (!(collection instanceof Queue)) {
            throw new TypeError();
        }
        this._collection = collection;
        this._currentIndex = 0;
    }

    /**
     *
     * @returns {{value: *, done: boolean}|{value: undefined, done: boolean}}
     */
    next() {
        if (this._currentIndex === this._collection._size) {
            return {
                value: undefined,
                done: true,
            }
        }
        return {
            value: this._collection[this._currentIndex++],
            done: false,
        }
    }
}

class Queue {
    /**
     *
     * @param {number} maxSize
     */
    constructor(maxSize = 10000) {
        if (typeof maxSize !== 'number') {
            throw TypeError();
        }
        if (!Number.isInteger(maxSize) || maxSize < 0) {
            throw new RangeError();
        }
        this._maxSize = maxSize;
        this._size = 0;
    }

    /**
     *
     * @param {*} value
     * @returns {number}
     */
    enqueue(value) {
        if (this._size > this._maxSize - 1) {
            throw new RangeError();
        }
        this[this._size] = value;
        return ++this._size;
    }

    /**
     *
     * @returns {*}
     */
    dequeue() {
        const firstElement = this[0];
        for (let i = 1; i < this._size; i++) {
            this[i - 1] = this[i];
        }
        if (this._size) {
            delete this[--this._size];
        }
        return firstElement;
    }

    /**
     *
     * @returns {*}
     */
    front() {
        return this[0];
    }

    /**
     *
     * @returns {boolean}
     */
    get isEmpty() {
        return !this._size;
    }

    /**
     *
     * @returns {number}
     */
    get size() {
        return this._size;
    }

    /**
     *
     * @returns {QueueIterator}
     */
    [Symbol.iterator]() {
        return new QueueIterator(this);
    }
}

class PriorityQueueItem {
    /**
     *
     * @param {*} value
     * @param {number} priority
     */
    constructor(value, priority) {
        if (typeof priority !== 'number') {
            throw TypeError();
        }
        if (!Number.isInteger(priority) || priority < 0) {
            throw new RangeError();
        }
        this._value = value;
        this._priority = priority;
    }
}

class PriorityQueue extends Queue {
    /**
     *
     * @param {number} maxSize
     */
    constructor(maxSize) {
        super(maxSize);
    }

    /**
     *
     * @param {PriorityQueueItem | *} value
     * @param {number} priority
     * @returns {number}
     */
    enqueue(value, priority = 0) {
        if (typeof priority !== 'number') {
            throw TypeError();
        }
        if (!Number.isInteger(priority) || priority < 0 || this._size > this._maxSize - 1) {
            throw new RangeError();
        }
        this[this._size++] = value instanceof PriorityQueueItem ? value : {
            _value: value,
            _priority: priority,
        };
        let temp;
        for (let i = 1; i < this._size; i++) {
            if (this[i]._priority > this[i - 1]._priority) {
                temp = this[i - 1];
                this[i - 1] = this[i];
                this[i] = temp;
                i = 0;
            }
        }
        return this._size;
    }
}
