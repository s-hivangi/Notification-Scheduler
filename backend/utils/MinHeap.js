class MinHeap {
  constructor() {
    this.heap = [];
  }

  _compare(a, b) {
    if (a.priorityScore !== b.priorityScore) {
      return a.priorityScore > b.priorityScore;
    }
    return new Date(a.scheduledTime).getTime() < new Date(b.scheduledTime).getTime();
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(element) {
    this.heap.push(element);
    this._bubbleUp(this.heap.length - 1);
  }

  extract() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this._compare(this.heap[index], this.heap[parentIndex])) {
        this._swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let swapIndex = index;

      if (left < length && this._compare(this.heap[left], this.heap[swapIndex])) {
        swapIndex = left;
      }
      if (right < length && this._compare(this.heap[right], this.heap[swapIndex])) {
        swapIndex = right;
      }

      if (swapIndex === index) break;

      this._swap(index, swapIndex);
      index = swapIndex;
    }
  }

  removeById(id) {
    const index = this.heap.findIndex(
      (el) => el._id && el._id.toString() === id.toString()
    );
    if (index === -1) return null;

    const removed = this.heap[index];

    if (index === this.heap.length - 1) {
      this.heap.pop();
      return removed;
    }

    this.heap[index] = this.heap.pop();
    this._bubbleUp(index);
    this._bubbleDown(index);

    return removed;
  }

  updateById(id, newElement) {
    this.removeById(id);
    this.insert(newElement);
  }

  size() {
    return this.heap.length;
  }

  clear() {
    this.heap = [];
  }

  toArray() {
    return [...this.heap];
  }
}

module.exports = MinHeap;
