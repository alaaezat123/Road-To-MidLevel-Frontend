/*
 * 'age' is trapped within the function scope (Private), making it inaccessible
 * from outside. The 'isAdult' method uses Closure to access the private 'age'
 */

function createUser(name, age) {
  return {
    name: name,
    isAdult: function () {
      return age >= 18;
    },
  };
}

const user = createUser("Ahmed", 20);

console.log(user.name); // "Ahmed"
console.log(user.age); // undefined
console.log(user.isAdult()); // true..
