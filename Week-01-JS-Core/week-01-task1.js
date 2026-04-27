/* Closure: Keeps 'count' private and alive in memory
 *even after this function returns
 */
function createCounter(initialValue) {
  let initial = initialValue;
  let count = initialValue;

  return {
    // Increment by amount (default 1)
    increment(amount) {
      count += amount || 1;
      return count;
    },
    // Decrement by amount (default 1)
    decrement(amount) {
      count -= amount || 1;
      return count;
    },
    // Reset to initial value
    reset() {
      count = initial;
      return count;
    },
    // Get current value
    getCount() {
      return count;
    },
  };
}

// Example usage
const counter = createCounter(10);

console.log(counter.increment()); // 11
console.log(counter.increment(5)); // 16
console.log(counter.decrement(3)); // 13
console.log(counter.reset()); // 10
console.log(counter.getCount()); // 10
