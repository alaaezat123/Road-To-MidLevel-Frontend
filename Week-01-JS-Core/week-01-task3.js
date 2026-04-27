function memoize(fn) {
  // This cache object (Closure)
  const cache = {};

  return function (n) {
    // Check if we have the result in the cache
    if (n in cache) {
      console.log("Fetching from cache for:", n);
      return cache[n];
    }
    //do the calculation
    console.log("Calculating result for:", n);
    const result = fn(n);
    // Store the result in the cache 
    cache[n] = result;

    return result;
  };
}

//Test 
function slowSquare(n) {
  for (let i = 0; i < 1000000; i++) {}
  return n * n;
}

const fastSquare = memoize(slowSquare);

console.log(fastSquare(5)); // Calculating... (slow)
console.log(fastSquare(5)); // Fetching from cache... (instant)
console.log(fastSquare(10)); // Calculating... (slow)
console.log(fastSquare(10)); // Fetching from cache... (instant)
