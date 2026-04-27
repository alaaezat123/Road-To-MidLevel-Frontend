# Week 01 — JS Core: Closures, Scope & Hoisting

> **المستوى:** Foundation (Junior Track)
> **الهدف:** تفهم إزاي JavaScript بتفكر فعلاً — مش بس تحفظ syntax

---

## 🎯 ليه التوبيك ده مهم؟

قبل ما تمسك React أو TypeScript، لازم تفهم الأساس.
90% من الـ bugs اللي بتشوفها في الكود يرجعوا لعدم فهم الـ scope والـ closures.
الـ interviewer بيسأل فيهم دايماً لأنهم بيبينوا إنك فاهم اللغة مش بس بتستخدمها.

---

## 📚 المحتوى

### 1. Scope

#### إيه هو الـ Scope؟
الـ Scope هو المكان اللي المتغير بيكون موجود فيه ومتاح منه.

```javascript
// Global Scope
const globalVar = "أنا موجود في كل حتة";

function myFunction() {
  // Function Scope
  const localVar = "أنا موجود جوه الـ function بس";
  console.log(globalVar); // ✅ يشتغل
  console.log(localVar);  // ✅ يشتغل
}

console.log(globalVar); // ✅ يشتغل
console.log(localVar);  // ❌ ReferenceError
```

#### Block Scope — الفرق بين var و let و const

```javascript
// var — مش بيحترم الـ block scope
if (true) {
  var x = 10;
}
console.log(x); // ✅ 10 — var اتسرب برا الـ block

// let و const — بيحترموا الـ block scope
if (true) {
  let y = 20;
  const z = 30;
}
console.log(y); // ❌ ReferenceError
console.log(z); // ❌ ReferenceError
```

#### Lexical Scope
الـ function بتشوف الـ variables بتاعة المكان اللي اتكتبت فيه، مش المكان اللي اتنادت منه.

```javascript
const name = "Ahmed";

function outer() {
  const name = "Mohamed";
  
  function inner() {
    console.log(name); // "Mohamed" — بياخدها من أقرب scope فوقيه
  }
  
  inner();
}

outer();
```

---

### 2. Hoisting

#### إيه هو الـ Hoisting؟
JavaScript بتاخد الـ declarations وترفعها لأول الـ scope قبل ما الكود يتشغل.

```javascript
// إنت بتكتب كده
console.log(x); // undefined — مش error!
var x = 5;

// JavaScript بتشوفها كده
var x;           // الـ declaration اتحرك لفوق
console.log(x); // undefined
x = 5;           // الـ assignment فضل في مكانه
```

#### الفرق في الـ Hoisting بين var و let و const

```javascript
// var — بتتعمل hoist وبتاخد قيمة undefined
console.log(a); // undefined
var a = 1;

// let و const — بتتعمل hoist بس في الـ Temporal Dead Zone
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 2;
```

#### Function Hoisting

```javascript
// Function Declaration — بتتعمل hoist كاملاً
sayHello(); // ✅ "Hello!" — شغال قبل الـ definition

function sayHello() {
  console.log("Hello!");
}

// Function Expression — مش بتتعمل hoist
sayBye(); // ❌ TypeError: sayBye is not a function

var sayBye = function() {
  console.log("Bye!");
};
```

---

### 3. Closures

#### إيه هو الـ Closure؟
الـ closure هو لما function بتتذكر الـ variables بتاعة الـ scope اللي اتولدت فيه، حتى بعد ما الـ scope ده خلص.

```javascript
function makeCounter() {
  let count = 0; // هذه المتغير في scope الـ outer function
  
  return function() {
    count++; // الـ inner function بتتذكر count
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
// makeCounter خلصت بس count لسه موجودة في الـ closure
```

#### Use Cases حقيقية للـ Closures

**١. Data Privacy**
```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // مش متاح من برا
  
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        console.log("رصيد غير كافي");
        return;
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account.balance); // undefined — محمي!
```

**٢. Function Factories**
```javascript
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**٣. Memoization**
```javascript
function memoize(fn) {
  const cache = {}; // الـ closure بتتذكر الـ cache
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache[key]) {
      console.log("من الـ cache");
      return cache[key];
    }
    
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveCalculation = memoize((n) => {
  console.log("بيحسب...");
  return n * n;
});

expensiveCalculation(5); // "بيحسب..." → 25
expensiveCalculation(5); // "من الـ cache" → 25
```

#### Closure Gotcha الشهيرة

```javascript
// المشكلة
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // بيطبع 3، 3، 3 — مش 0، 1، 2
  }, 1000);
}

// السبب: var مش بتعمل block scope
// كل الـ setTimeout بيشاركوا نفس المتغير i

// الحل الأول: let بدل var
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // ✅ 0، 1، 2
  }, 1000);
}

// الحل التاني: closure صريح
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => {
      console.log(j); // ✅ 0، 1، 2
    }, 1000);
  })(i);
}
```

---

## 🔗 مصادر للمذاكرة

### لازم تقرأ
- [MDN — Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) — الأساس
- [MDN — Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)
- [MDN — Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

### لو عايز تتعمق أكتر
- [JavaScript.info — Variable Scope](https://javascript.info/closure) — شرح ممتاز بالتفصيل
- [You Don't Know JS — Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md) — مجاني على GitHub

### فيديوهات
- ابحث على YouTube: "Closures JavaScript Fireship" — شرح سريع وواضح
- ابحث على YouTube: "JavaScript Hoisting in 5 minutes"

---

## 🧠 طريقة المذاكرة الصح

```
1. اقرأ المفهوم الأول (Scope)
2. اكتب الكود بإيدك — متنسخش
3. اتوقع الـ output قبل ما تشغل
4. لو غلط، افهم ليه — مش بس صحح
5. اعمل المثال بتاعك بفكرة مختلفة
6. افضل على التوبيك التاني
```

---

## ✅ التاسك الأسبوعي — Junior

### المطلوب
اعمل ملف `week-01-task.js` وحل المسائل دي:

**المسألة الأولى — Counter Advanced**
```javascript
// اعمل function اسمها createCounter
// بتاخد قيمة ابتدائية
// وبترجع object فيه 3 methods:
// increment() — تزود بمقدار معين (default: 1)
// decrement() — تنقص بمقدار معين (default: 1)
// reset()     — ترجع للقيمة الابتدائية
// getCount()  — ترجع القيمة الحالية

// مثال الاستخدام:
const counter = createCounter(10);
counter.increment();    // 11
counter.increment(5);   // 16
counter.decrement(3);   // 13
counter.reset();        // 10
counter.getCount();     // 10
```

**المسألة التانية — Private State**
```javascript
// اعمل function اسمها createUser
// بتاخد name و age
// وبترجع object بيعرض الـ name بس
// ومعندكش أي طريقة توصل للـ age من برا
// غير عن طريق method اسمها isAdult() بترجع true/false

// مثال:
const user = createUser("Ahmed", 20);
console.log(user.name);      // "Ahmed"
console.log(user.age);       // undefined
console.log(user.isAdult()); // true
```

**المسألة التالتة — Memoize**
```javascript
// اعمل function اسمها memoize
// بتاخد أي function
// وبترجع نسخة منها بتـ cache الـ results
// لو نفس الـ arguments اتبعتوا تاني، تاخد من الـ cache

// اختبرها مع:
function slowSquare(n) {
  // simulate slow calculation
  for(let i = 0; i < 1000000; i++) {}
  return n * n;
}

const fastSquare = memoize(slowSquare);
```

### معيار التسليم
- الكود يشتغل صح ✅
- في comments بتشرح إيه اللي بيحصل ✅
- مفيش استخدام لـ var (استخدم let أو const) ✅

---

## ❓ أسئلة للـ Session

جهز إجاباتك على الأسئلة دي للنقاش:

1. إيه الفرق بين `var` و `let` و `const` في الـ hoisting؟
2. لو قولتلك "كل function في JavaScript بتعمل closure" — صح ولا غلط؟ وليه؟
3. إيه الفرق بين الـ scope والـ closure؟

---

## 🔮 اللي جاي — Week 02
**JS Async: Promises, Event Loop, Async/Await**
هتفهم إزاي JavaScript بتتعامل مع الحاجات اللي بتاخد وقت — وليه الـ callback hell اتولد وإزاي اتحل.
