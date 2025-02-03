---
id: 6732b28eeadda1158cdbff7b
title: How Can You Check if an Array Contains a Certain Value?
challengeType: 11
videoId: NjZI_TlIiXk
dashedName: how-can-you-check-if-an-array-contains-a-certain-value
---

# --description--

Watch the lecture video and answer the questions below.

# --transcript--

How can you check if an array contains a certain value?

In JavaScript, the `includes()` method is a simple and efficient way to check if an array contains a specific value. This method returns a boolean value: `true` if the array contains the specified element, and `false` otherwise. 

The `includes()` method is particularly useful when you need to quickly verify the presence of an element in an array without needing to know its exact position. Let's start with an example of how to use the `includes()` method:

```js
let fruits = ["apple", "banana", "orange", "mango"];
console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape"));  // false
```

In this example, we have an array of fruits. We use the `includes()` method to check if `banana` is in the array. It returns `true` because `banana` is indeed present. We then check for `grape`, which returns `false` because it's not in the array.

The `includes()` method is case-sensitive when dealing with strings. This means that `Banana` with a capital B and `banana` with all lowercase letters are considered different values. Here's an example that illustrates this:

```js
let fruits = ["apple", "banana", "orange"];
console.log(fruits.includes("banana")); // true
console.log(fruits.includes("Banana")); // false
```

In this case, `banana` (all in lowercase) is found in the array, but `Banana` (with the first letter capitalized) is not, so the second `includes()` call returns `false`.

The `includes()` method can also accept an optional second parameter that specifies the position in the array to start the search. This is useful if you want to check for an element's presence in a specific part of the array. Here's how you can use this feature:

```js
let numbers = [10, 20, 30, 40, 50, 30, 60];
console.log(numbers.includes(30, 3)); // true
console.log(numbers.includes(30, 4)); // true
```

For the first `console.log`, we are looking for the number `30` starting at index `3`. In this case, there is a number `30` that appears after index `3`, so the `includes()` method returns `true`. 

The same is true for the second `console.log`. We are looking for the number `30` starting at index `4`. Since the number `30` does appear after that index, then it will return `true`. 

It's worth noting that `includes()` uses the strict equality comparison (`===`), which means it can distinguish between different types. For example:

```js
let mixedArray = [1, "2", 3, "4", 5];
console.log(mixedArray.includes(2));  // false
console.log(mixedArray.includes("2")); // true
```

In this case, the number `2` and the string `"2"` are considered different data types. So, the first `console.log` will return `false`, while the second `console.log` will return `true`.

The `includes()` method is a powerful tool for checking the presence of elements in arrays. It's simple to use, efficient, and can save you from writing more complex loops or conditions to search through arrays. Whether you're working with strings, numbers, or mixed data types, `includes()` provides a straightforward way to verify if a value exists in your array.

# --questions--

## --text--

What will be the output of the following code?

```js
let arr = [1, 2, 3, 4, 5];
console.log(arr.includes(3, 3));
```

## --answers--

`true`

### --feedback--

The second parameter of ``includes()`` specifies the starting position for the search.

---

`false`

---

`undefined`

### --feedback--

The second parameter of ``includes()`` specifies the starting position for the search.

---

This will throw an error.

### --feedback--

The second parameter of ``includes()`` specifies the starting position for the search.

## --video-solution--

2

## --text--

What will be the output of the following code?

```js
let arr = ["a", "b", "c", "d", "e"];
console.log(arr.includes("C"));
```

## --answers--

`true`

### --feedback--

Remember that ``includes()`` is case-sensitive when dealing with strings.

---

`false`

---

`undefined`

### --feedback--

Remember that ``includes()`` is case-sensitive when dealing with strings.

---

This will throw an error.

### --feedback--

Remember that ``includes()`` is case-sensitive when dealing with strings.

## --video-solution--

2

## --text--

What will be the output of the following code?

```js
let arr = [1, "2", 3, "4", 5];
console.log(arr.includes("3"));
```

## --answers--

`true`

### --feedback--

The ``includes()`` method uses strict equality (`===`) for comparison.

---

`false`

---

`undefined`

### --feedback--

The ``includes()`` method uses strict equality (`===`) for comparison.

---

This will throw an error.

### --feedback--

The ``includes()`` method uses strict equality (`===`) for comparison.

## --video-solution--

2
