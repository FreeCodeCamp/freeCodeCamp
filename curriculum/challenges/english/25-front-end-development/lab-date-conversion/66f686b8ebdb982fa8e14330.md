---
id: 66f686b8ebdb982fa8e14330
title: Build a Date Conversion Program
challengeType: 26
dashedName: lab-date-conversion
---

# --description--

In this lab, you will code a date conversion program that converts a given date to different formats. For example, the current date `Fri Sep 27 2024 16:04:43 GMT+0500 (Pakistan Standard Time)` would be formatted in the following 2 ways:

- `(MM/DD/YYYY): 9/27/2024`.
- `(Month Day, Year): September 27, 2024`.

**Objective:** Fulfill the user stories below and get all the tests to pass to complete the lab. 

**User Stories:**

1. You should create a variable named `currentDate` and assign it the current date and time using the `Date` object.
2. You should create a variable named `currentDateFormat` and assign it the string `Current Date and Time: [current date]`. Replace `[current date]` with the result of the `currentDate` variable.
3. You should log the value of `currentDateFormat` to the console.
4. You should create a function named `formatDateMMDDYYYY` that takes the date object as a parameter. You can name this parameter whatever you like.
5. Your `formatDateMMDDYYYY` function should convert the current date to `month/day/year` format and return the string `Formatted Date (MM/DD/YYYY): [month]/[day]/[year]`.
6. You should create a function named `formatDateLong` that takes the date object as a parameter.
7. Your `formatDateLong` function should convert the current date to `Month Day, Year` format and return the string `Formatted Date (Month Day, Year): [formatted date]`.

**Note:** For the tests to pass, make sure that you use `en-US` for the locale when formatting the dates.

# --hints--

You should have a variable named `currentDate` that holds the current date and time using the `Date` object.

```js
// excluded timestamps
const expectedDate = new Date();
const expectedDateOnly = new Date(expectedDate.getFullYear(), expectedDate.getMonth(), expectedDate.getDate());

const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

assert.equal(currentDateOnly.toString(), expectedDateOnly.toString());
```

You should have a variable named `currentDateFormat` that holds the current date in the format `Current Date and Time: <ddd> <MMM> <dd> <yyyy> <HH>:<mm>:<ss> <TIMEZONE>`.

```js
const expectedDateString = `Current Date and Time: `;
assert.include(currentDateFormat, expectedDateString);

const currentTimestamp = new Date(currentDateFormat.replace(expectedDateString, '')).getTime();
const expectedTimestamp = new Date().getTime();
assert.approximately(currentTimestamp, expectedTimestamp, 2000);
```

You should log the value of `currentDateFormat` to the console.

```js
assert.match(code, /console\.log\(\s*currentDateFormat\s*\)/);
```

You should have a function `formatDateMMDDYYYY` 

```js
assert.isFunction(formatDateMMDDYYYY);
```

The function `formatDateMMDDYYYY` should take a single parameter.

```js
assert.lengthOf(formatDateMMDDYYYY, 1);
```

When the date object holds `Fri Sep 27 2024 16:16:11 GMT+0500 (Pakistan Standard Time)`, the function `formatDateMMDDYYYY` should return `Formatted Date (MM/DD/YYYY): 9/27/2024`.

```js
let dateString = "Fri Sep 27 2024 16:21:18 GMT+0500 (Pakistan Standard Time)";
let dateObject = new Date(dateString);

assert.equal(formatDateMMDDYYYY(dateObject).toString(), "Formatted Date (MM/DD/YYYY): 9/27/2024");

// prevent hardcoding

dateString = "Fri Sep 28 2024 18:31:18 GMT+0500 (Pakistan Standard Time)";
dateObject = new Date(dateString);

assert.strictEqual(formatDateMMDDYYYY(dateObject).toString(), "Formatted Date (MM/DD/YYYY): 9/28/2024");
```

You should have a function `formatDateLong` 

```js
assert.isFunction(formatDateLong);
```

The function `formatDateLong` should take a single a parameter.

```js
assert.lengthOf(formatDateLong, 1);
```

When the date object holds `Fri Sep 27 2024 16:16:11 GMT+0500 (Pakistan Standard Time)`, the function `formatDateLong` should return `Formatted Date (Month Day, Year): September 27, 2024`.

```js
let testDate = new Date('Fri Sep 27 2024 16:21:18 GMT+0500 (Pakistan Standard Time)');
let result = formatDateLong(testDate);

assert.strictEqual(result,'Formatted Date (Month Day, Year): September 27, 2024', `Test failed: ${result}`); 

// prevent hardcoding

testDate = new Date('Fri Sep 28 2024 18:31:18 GMT+0500 (Pakistan Standard Time)');
result = formatDateLong(testDate);
assert.strictEqual(result, 'Formatted Date (Month Day, Year): September 28, 2024'); 
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
const currentDate = new Date();
const currentDateFormat = `Current Date and Time: ${currentDate}`; 
console.log(currentDateFormat);

function formatDateMMDDYYYY(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `Formatted Date (MM/DD/YYYY): ${month}/${day}/${year}`;
}

function formatDateLong(date) {
  const longDateFormat =  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return `Formatted Date (Month Day, Year): ${longDateFormat}`;
}

// usage
console.log(formatDateMMDDYYYY(currentDate));
console.log(formatDateLong(currentDate));

```

