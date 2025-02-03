---
id: 66edcdd18a4ef8df16e6bb7e
title: JavaScript Higher Order Functions Quiz
challengeType: 8
dashedName: quiz-javascript-higher-order-functions
---

# --description--

To pass the quiz, you must correctly answer at least 18 of the 20 questions below.

# --quizzes--

## --quiz--

### --question--

#### --text--

Which of the following statements about JavaScript higher-order functions is NOT true?

#### --distractors--

Higher-order functions can greatly enhance code readability and maintainability by enabling functional programming techniques.

---

Higher-order functions like map, filter, and reduce are powerful tools for array manipulation, but they are not unique to functional programming.

---

Higher-order functions may introduce complexity in understanding code, but they can also lead to more expressive and concise solutions.

#### --answer--

All functions in JavaScript, including those that do not take or return other functions, can be classified as higher-order functions.

### --question--

#### --text--

What is a factory function in the context of higher order functions?

#### --distractors--

A function that creates new variables.

---

A function that only works with strings.

---

A function that automatically generates code comments.

#### --answer--

A function that returns a new function based on specific parameters

### --question--

#### --text--

After code execution, what will be the value of `forEachRes` and `mapRes`?

```js
const numbers = [1, 1, 1, 1, 1];
let sum = 0;
const forEachRes = numbers.forEach(num => {
  return (sum += num);
});
const mapRes = numbers.map(num => {
  return (sum += num);
});
```

#### --distractors--

`forEachRes` is `undefined` and `mapRes` is `[1,2,3,4,5]`

---

`forEachRes` is `0` and `mapRes` is `[1,2,3,4,5]`

---

`forEachRes` is `5` and `mapRes` is `[1,2,3,4,5]`

#### --answer--

`forEachRes` is `undefined` and `mapRes` is `[6,7,8,9,10]`

### --question--

#### --text--

What is the result of this code?

```js
[, undefined, 'a', 'b', { 20: 5 }].sort();
```

#### --distractors--

Unsupported elements for an array to be sorted, hence error.

---

Callback not supplied, hence error.

---

```js
[empty, 'a', 'b', undefined, { '20': 5 }]
```

#### --answer--

```js
[{ '20': 5 }, 'a', 'b', undefined, empty]
```

### --question--

#### --text--

Which of the following describes a callback function in JavaScript?

#### --distractors--

A function that is called immediately upon declaration.

---

A function that is invoked with a specific context.

---

A function that returns another function.

#### --answer--

A function passed as an argument to another function, to be executed by that function's logic.

### --question--

#### --text--

What is the result of using `reduce()` on an array?

#### --distractors--

A boolean indicating whether any elements meet a condition.

---

An Array with all elements reduced by specified callback function.

---

An Array of booleans.

#### --answer--

It varies depending on the accumulator's initial value and the callback function.

### --question--

#### --text--

How does the `sort()` method behave if no compare function is provided in numerical sorting?

#### --distractors--

It fills the empty slots with `null`.

---

It returns an array of special characters.

---

It sorts the array in reverse order.

#### --answer--

It sorts the array as strings based on UTF-16 code units.

### --question--

#### --text--

What is the purpose of the `some()` method in JavaScript?

#### --distractors--

To create a new array with the results of a function applied to each element.

---

To iterate through an array without producing a result.

---

To reduce an array to a single value based on a callback function.

#### --answer--

To determine if any elements in an array pass a specified test.

### --question--

#### --text--

Which of the following is a valid example of method chaining?

#### --distractors--

```js
Math.random();
```

---

```js
array.push(1).pop();
```

---

```js
console.log('Hello');
```

#### --answer--

```js
str.toLowerCase().trim().replace(' ', '_');
```

### --question--

#### --text--

What is the output of the following code?

```js
let numbers = [2, 4, 8, 10];

numbers.forEach(function(number) {
    console.log(number % 2);
});
```

#### --distractors--

`2 4 8 10`

---

`null null null null`

---

`1 1 1 1`

#### --answer--

`0 0 0 0`

### --question--

#### --text--

Which of the following is a benefit of method chaining?

#### --distractors--

It inherently optimizes performance by reducing the execution time of functions.

---

It eliminates the need for temporary variables, but may increase memory usage in some cases.

---

It allows for error handling and debugging to be more straightforward.

#### --answer--

It promotes simplified syntax and more readable code by allowing multiple operations in a single expression.

### --question--

#### --text--

How can you sort an array of objects by a specific property using the `sort` method?

#### --distractors--

The sort method cannot sort objects.

---

Use the reverse method after sorting.

---

Convert the objects to strings and sort them.

#### --answer--

Use a compare function that compares the property values.

### --question--

#### --text--

In method chaining, what is a common practice to enhance clarity and debugging?

#### --distractors--

Use fewer methods in the chain.

---

Avoid chaining methods that return only primitive values.

---

Use only built-in methods.

#### --answer--

Break long chains into multiple steps.

### --question--

#### --text--

What is a potential downside of using method chaining excessively in your code?

#### --distractors--

It makes the code run slower.

---

It prevents the use of comments.

---

It makes the file size larger.

#### --answer--

It can make the code harder to debug.

### --question--

#### --text--

Which method would you use to determine if all elements in an array are strings?

#### --distractors--

`some()`

---

`everyInstance()`

---

`filter()`

#### --answer--

`every()`

### --question--

#### --text--

What will be the value of originalArray after the following code is run?

```js
const originalArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
const filteredArray = originalArray.filter(item => item.id > 1);
filteredArray[0].id = 4;
```

#### --distractors--

`[{ id: 1 }, { id: 2 }, { id: 3 }]`

---

`[{ id: 1 }]`

---

`[{ id: 4 }, { id: 2 }, { id: 3 }]`

#### --answer--

`[{ id: 1 }, { id: 4 }, { id: 3 }]`
### --question--

#### --text--

What would be the output of the following code?

```js
const multiply = (a) => (b) => a * b;
const operations = [multiply(2), multiply(3)];
const result = operations.reduce((acc, fn) => fn(acc), 5);

console.log(result);
```

#### --distractors--

`10`

---

`100`

---

`20`

#### --answer--

`30`

### --question--

#### --text--

What is the purpose of providing an initial value as an argument to the `reduce()` method?

#### --distractors--

To set the length of the array.

---

To limit the number of iterations.

---

To specify the return type of the function.

#### --answer--

To define the starting value for the accumulator.

### --question--

#### --text--

Can the `map` method be used on objects that are not arrays?

#### --distractors--

Yes, it can be used on any object.

---

Yes, but only on objects with numeric properties.

---

It depends on the JavaScript version.

#### --answer--

No, it is specifically designed for arrays.

### --question--

#### --text--

What is the primary purpose of the `map` method in JavaScript?

#### --distractors--

To sort an array and return a new array while maintaining the original order. 

---

To filter elements from an array and remove or add elements based on a condition.

---

To find a specific element in an array and return its index along with the element.

#### --answer--

To create a new array containing the results of calling a provided function on each element in the starting array.
