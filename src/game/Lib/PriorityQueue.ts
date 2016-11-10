export default class PriorityQueue<T> {

  private array: T[];
  private size: number;
  private compare: (a: T, b: T) => boolean;

  constructor(comparator?: (a: T, b: T) => boolean) {
    this.array = [];
    this.size = 0;
    this.compare = comparator || function (a: T, b: T) { return a < b };
  }

  // Add an element the the queue
  // runs in O(log n) time
  public add(value: T) {
    let i = this.size;
    this.array[this.size++] = value;
    while (i > 0) {
      const p = (i - 1) >> 1;
      const ap = this.array[p];
      if (!this.compare(value, ap)) break;
      this.array[i] = ap;
      i = p;
    }
    this.array[i] = value;
  }

  // Replace the content of the heap by provided array and "heapifies it"
  public heapify(array: T[]) {
    this.array = array;
    this.size = array.length;
    for (let i = (this.size >> 1); i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  // Internal use
  private percolateUp(i: number) {
    const myval = this.array[i];
    while (i > 0) {
      const p = (i - 1) >> 1;
      const ap = this.array[p];
      if (!this.compare(myval, ap)) break;
      this.array[i] = ap;
      i = p;
    }
    this.array[i] = myval;
  }

  // Internal use
  private percolateDown(i: number) {
    const size = this.size;
    const hsize = this.size >>> 1;
    const ai = this.array[i];
    while (i < hsize) {
      let l = (i << 1) + 1;
      const r = l + 1;
      let bestc = this.array[l];
      if (r < size) {
        if (this.compare(this.array[r], bestc)) {
          l = r;
          bestc = this.array[r];
        }
      }
      if (!this.compare(bestc, ai)) {
        break;
      }
      this.array[i] = bestc;
      i = l;
    }
    this.array[i] = ai;
  }

  // Look at the top of the queue (a smallest element)
  // executes in constant time
  //
  // This function assumes that the priority queue is
  // not empty and the caller is resposible for the check. 
  // You can use an expression such as
  // "isEmpty() ? undefined : peek()"
  // if you expect to be calling peek on an empty priority queue.
  // 
  public peek(): T {
    return this.array[0];
  }

  // Remove the element on top of the heap (a smallest element)
  // runs in logarithmic time
  //
  //
  // This function assumes that the priority queue is
  // not empty, and the caller is responsible for the check. 
  // You can use an expression such as
  // "isEmpty() ? undefined : poll()"
  // if you expect to be calling poll on an empty priority queue.
  //
  // For long-running and large priority queues, or priority queues
  // storing large objects, you may  want to call the trim function
  // at strategic times to recover allocated memory.
  public poll(): T {
    const result = this.array[0];
    if (this.size > 1) {
      this.array[0] = this.array[--this.size];
      this.percolateDown(0 | 0);
    } else --this.size;
    return result;
  }

  // Recover unused memory (for long-running priority queues)
  public trim() {
    this.array = this.array.slice(0, this.size);
  }

  // Check whether the heap is empty
  public isEmpty(): boolean {
    return this.size == 0;
  }
}