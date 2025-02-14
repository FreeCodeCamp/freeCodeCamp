---
id: 657bdcb9a322aae1eac38391
title: Build a Telephone Number Validator
challengeType: 14
forumTopicId: 16090
dashedName: build-a-telephone-number-validator
---

# --description--

In the US, phone numbers can be formatted in many ways. Here are some examples of valid formats for US phone numbers:

<blockquote>
1 555-555-5555<br>
1 (555) 555-5555<br>
1(555)555-5555<br>
1 555 555 5555<br>
5555555555<br>
555-555-5555<br>
(555)555-5555<br>
</blockquote>

Note that the area code is required. Also, if the country code is provided, you must confirm that the country code is `1`.

**Objective:** Build an app that is functionally similar to <a href="https://telephone-number-validator.freecodecamp.rocks" target="_blank" rel="noopener noreferrer nofollow">https://telephone-number-validator.freecodecamp.rocks</a>.

**User Stories:**

1. You should have an `input` element with an `id` of `"user-input"`.
1. You should have a `button` element with an `id` of `"check-btn"`.
1. You should have a `button` element with an `id` of `"clear-btn"`.
1. You should have a `div`, `span` or `p` element with an `id` of `"results-div"`.
1. When you click on the `#check-btn` element without entering a value into the `#user-input` element, an alert should appear with the text `"Please provide a phone number"`.
1. When you click on the `#clear-btn` element, the content within the `#results-div` element should be removed.
1. When the `#user-input` element contains `1 555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 555-555-5555"`.
1. When the `#user-input` element contains `1 (555) 555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 (555) 555-5555"`.
1. When the `#user-input` element contains `5555555555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 5555555555"`.
1. When the `#user-input` element contains `555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 555-555-5555"`.
1. When the `#user-input` element contains `(555)555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: (555)555-5555"`.
1. When the `#user-input` element contains `1(555)555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1(555)555-5555"`.
1. When the `#user-input` element contains `555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 555-5555"`.
1. When the `#user-input` element contains `5555555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 5555555"`.
1. When the `#user-input` element contains `1 555)555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 1 555)555-5555"`.
1. When the `#user-input` element contains `1 555 555 5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 555 555 5555"`.
1. When the `#user-input` element contains `1 456 789 4444` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 456 789 4444"`.
1. When `#user-input` contains `123**&!!asdf#` and `#check-btn` is clicked, `#results-div` should contain the text `"Invalid US number: 123**&!!asdf#"`.
1. When the `#user-input` element contains `55555555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 55555555"`.
1. When the `#user-input` element contains `(6054756961)` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: (6054756961)"`.
1. When the `#user-input` element contains `2 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2 (757) 622-7382"`.
1. When the `#user-input` element contains `0 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 0 (757) 622-7382"`.
1. When the `#user-input` element contains `-1 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: -1 (757) 622-7382"`.
1. When the `#user-input` element contains `2 757 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2 757 622-7382"`.
1. When the `#user-input` element contains `10 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 10 (757) 622-7382"`.
1. When the `#user-input` element contains `27576227382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 27576227382"`.
1. When the `#user-input` element contains `(275)76227382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: (275)76227382"`.
1. When the `#user-input` element contains `2(757)6227382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2(757)6227382"`.
1. When the `#user-input` element contains `2(757)622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2(757)622-7382"`.
1. When the `#user-input` element contains `555)-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 555)-555-5555"`.
1. When the `#user-input` element contains `(555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: (555-555-5555"`.
1. When `#user-input` contains `(555)5(55?)-5555` and `#check-btn` is clicked, `#results-div` should contain the text `"Invalid US number: (555)5(55?)-5555"`.
1. When the `#user-input` element contains `55 55-55-555-5` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 55 55-55-555-5"`.
1. When the `#user-input` element contains `11 555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 11 555-555-5555"`.
1. When the `#user-input` element contains a valid US number and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: "` followed by the number.
1. When the `#user-input` element contains an invalid US number and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: "` followed by the number.

Fulfill the user stories and pass all the tests below to complete this project. Give it your own personal style. Happy Coding!

# --hints--

You should have an `input` element with an `id` of `"user-input"`.

```js
const el = document.getElementById('user-input');
assert.strictEqual(el?.nodeName?.toLowerCase(), 'input');
```

You should have a `button` element with an `id` of `"check-btn"`.

```js
const el = document.getElementById('check-btn');
assert.strictEqual(el?.nodeName?.toLowerCase(), 'button');
```

You should have a `button` element with an `id` of `"clear-btn"`.

```js
const el = document.getElementById('clear-btn');
assert.strictEqual(el?.nodeName?.toLowerCase(), 'button');
```

You should have a `div`, `span`, or `p` element with an `id` of `"results-div"`.

```js
const el = document.getElementById('results-div');
assert(['div', 'span', 'p'].includes(el?.nodeName?.toLowerCase()));
```

When you click on the `#check-btn` element without entering a value into the `#user-input` element, an alert should appear with the text `"Please provide a phone number"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');

assert.exists(userInput);
assert.exists(checkBtn);

let alertMessage;
window.alert = (message) => alertMessage = message; // Override alert and store message

userInput.value = '';
checkBtn.click();
assert.strictEqual(alertMessage?.trim().replace(/[.,?!]+$/g, '').toLowerCase(), 'please provide a phone number');
```

When you click on the `#clear-btn` element, the content within the `#results-div` element should be removed.

```js
const resultsDiv = document.getElementById('results-div');
const clearBtn = document.getElementById('clear-btn');

assert.exists(clearBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = `Testing testing 123
Ladies and gentlemen, we are floating in space.`;
clearBtn.click();
assert.isEmpty(resultsDiv.textContent);
```

When the `#user-input` element contains `1 555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 555-555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '1 555-555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: 1 555-555-5555');
```

When the `#user-input` element contains `1 (555) 555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 (555) 555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '1 (555) 555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: 1 (555) 555-5555');
```

When the `#user-input` element contains `5555555555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 5555555555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '5555555555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: 5555555555');
```

When the `#user-input` element contains `555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 555-555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '555-555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: 555-555-5555');
```

When the `#user-input` element contains `(555)555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: (555)555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '(555)555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: (555)555-5555');
```

When the `#user-input` element contains `1(555)555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1(555)555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '1(555)555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: 1(555)555-5555');
```

When the `#user-input` element contains `555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 555-5555');
```

When the `#user-input` element contains `5555555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 5555555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '5555555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 5555555');
```

When the `#user-input` element contains `1 555)555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 1 555)555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '1 555)555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 1 555)555-5555');
```

When the `#user-input` element contains `1 555 555 5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 555 555 5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '1 555 555 5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: 1 555 555 5555');
```

When the `#user-input` element contains `1 456 789 4444` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: 1 456 789 4444"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '1 456 789 4444';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'valid us number: 1 456 789 4444');
```

When `#user-input` contains `123**&!!asdf#` and `#check-btn` is clicked, `#results-div` should contain the text `"Invalid US number: 123**&!!asdf#"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '123**&!!asdf#';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 123**&!!asdf#');
```

When the `#user-input` element contains `55555555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 55555555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '55555555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 55555555');
```

When the `#user-input` element contains `(6054756961)` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: (6054756961)"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '(6054756961)';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: (6054756961)');
```

When the `#user-input` element contains `2 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2 (757) 622-7382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '2 (757) 622-7382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 2 (757) 622-7382');
```

When the `#user-input` element contains `0 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 0 (757) 622-7382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '0 (757) 622-7382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 0 (757) 622-7382');
```

When the `#user-input` element contains `-1 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: -1 (757) 622-7382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '-1 (757) 622-7382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: -1 (757) 622-7382');
```

When the `#user-input` element contains `2 757 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2 757 622-7382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '2 757 622-7382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 2 757 622-7382');
```

When the `#user-input` element contains `10 (757) 622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 10 (757) 622-7382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '10 (757) 622-7382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 10 (757) 622-7382');
```

When the `#user-input` element contains `27576227382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 27576227382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '27576227382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 27576227382');
```

When the `#user-input` element contains `(275)76227382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: (275)76227382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '(275)76227382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: (275)76227382');
```

When the `#user-input` element contains `2(757)6227382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2(757)6227382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '2(757)6227382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 2(757)6227382');
```

When the `#user-input` element contains `2(757)622-7382` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 2(757)622-7382"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '2(757)622-7382';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 2(757)622-7382');
```

When the `#user-input` element contains `555)-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 555)-555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '555)-555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 555)-555-5555');
```

When the `#user-input` element contains `(555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: (555-555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '(555-555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: (555-555-5555');
```

When `#user-input` contains `(555)5(55?)-5555` and `#check-btn` is clicked, `#results-div` should contain the text `"Invalid US number: (555)5(55?)-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '(555)5(55?)-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: (555)5(55?)-5555');
```

When the `#user-input` element contains `55 55-55-555-5` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 55 55-55-555-5"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '55 55-55-555-5';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 55 55-55-555-5');
```

When the `#user-input` element contains `11 555-555-5555` and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: 11 555-555-5555"`.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

resultsDiv.innerHTML = '';
userInput.value = '11 555-555-5555';
userInput.dispatchEvent(new Event('change'));
checkBtn.click();
assert.strictEqual(resultsDiv.innerText.trim().toLowerCase(), 'invalid us number: 11 555-555-5555');
```

When the `#user-input` element contains a valid US number and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Valid US number: "` followed by the number.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

const validPatterns = [
  '1 XXX-XXX-XXXX',
  '1 (XXX)XXX-XXXX',
  '1(XXX)XXX-XXXX',
  '1 XXX XXX XXXX',
  'XXXXXXXXXX',
  'XXX-XXX-XXXX',
  '(XXX)XXX-XXXX',
];

validPatterns.forEach(pattern => {
  while (pattern.includes('X')) {
    pattern = pattern.replace('X',  Math.floor(Math.random() * 7) + 2); //While this may seem weird at first, it's required for the CI build to pass
    //This is apparently because the solution provided for CI purposes actually checks for valid area and exchange codes.
  }
  resultsDiv.innerHTML = '';
  userInput.value = pattern;
  userInput.dispatchEvent(new Event('change'));
  checkBtn.click();
  assert.strictEqual(document.getElementById('results-div').innerText.trim().toLowerCase(), `valid us number: ${pattern}`);
});
```

When the `#user-input` element contains an invalid US number and the `#check-btn` element is clicked, the `#results-div` element should contain the text `"Invalid US number: "` followed by the number.

```js
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resultsDiv = document.getElementById('results-div');

assert.exists(userInput);
assert.exists(checkBtn);
assert.exists(resultsDiv);

const invalidPatterns = [
  '10 XXX-XXX-XXXX',
  '1 (XX)XXX-XXXX',
  '1!(XXX)XXX-XXXX',
  '-1 XXX XXX XXXX',
  'XXXXXXXX',
  'XXX#XXX-XXXX',
  '(XXXXXX-XXXX',
];

invalidPatterns.forEach(pattern => {
  while (pattern.includes('X')) {
    pattern = pattern.replace('X',  Math.floor(Math.random() * 10));
  }
  resultsDiv.innerHTML = '';
  userInput.value = pattern;
  userInput.dispatchEvent(new Event('change'));
  checkBtn.click();
  assert.strictEqual(document.getElementById('results-div').innerText.trim().toLowerCase(), `invalid us number: ${pattern}`);
});
```

# --seed--

## --seed-contents--

```html

```

```css

```

```js

```

# --solutions--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="icon"
      type="image/png"
      href="https://cdn.freecodecamp.org/universal/favicons/favicon.ico"
    />
    <title>Telephone Number Validator</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <img
        class="freecodecamp-logo"
        src="https://cdn.freecodecamp.org/platform/universal/fcc_primary.svg"
        alt="freeCodeCamp Logo"
      />
      <h1>Telephone Number Validator</h1>
      <div class="phone-container">
        <div class="phone-background">
          <div class="phone-camera"></div>
        </div>
        <label for="user-input">Enter a Phone Number:</label>
        <input maxlength="20" type="text" id="user-input" value="" />
        <div id="results-div"></div>
        <div class="phone-footer">
          <button class="btn-styles" id="check-btn">Check</button>
          <button class="btn-styles" id="clear-btn">Clear</button>
        </div>
      </div>
    </main>
    <script src="script.js"></script>
  </body>
</html>
```

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --phone-colors: #dfdfe2;
  --center-text: center;
  --gray-00: #fff;
}

body {
  background-color: #3b3b4f;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #0a0a23;
}

main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 10px;
}

.freecodecamp-logo {
  width: 100%;
  height: 30px;
  margin-bottom: 20px;
}

h1 {
  color: white;
  width: 100%;
  max-width: 480px;
  margin: 15px 0;
  text-align: var(--center-text);
}

.phone-container {
  position: relative;
  background-color: var(--phone-colors);
  width: 250px;
  height: 460px;
  margin: 30px auto;
  border-radius: 15px;
  border: 15px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phone-background {
  background-color: black;
  width: 100%;
  height: 25px;
}

.phone-camera {
  background-color: var(--phone-colors);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: auto;
}

label {
  margin: 10px auto 5px;
}

#user-input {
  display: block;
  margin: 10px auto;
  padding: 5px;
  border: 1px solid black;
  border-radius: 10px;
  text-align: var(--center-text);
  width: 90%;
  height: 42px;
  font-size: 16px;
}

.phone-footer {
  background-color: black;
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-styles {
  cursor: pointer;
  width: 100px;
  margin: 10px;
  color: #0a0a23;
  font-size: 18px;
  background-color: #ffffff;
  background-image: linear-gradient(#ffffff, #928d86);
  border-color: #ffffff;
  border-width: 3px;
}

#results-div {
  overflow-y: auto;
  height: 265px;
  width: 100%;
}

.results-text {
  font-size: 1.2rem;
  padding: 5px;
  text-align: var(--center-text);
  margin: 10px 0;
}
```

```js
const userInput = document.getElementById("user-input");
const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const resultsDiv = document.getElementById("results-div");

const checkValidNumber = (input) => {
  if (input === "") {
    alert("Please provide a phone number");
    return;
  }
  const countryCode = "^(1\\s?)?";
  const areaCode = "(\\([0-9]{3}\\)|[0-9]{3})";
  const spacesDashes = "[\\s\\-]?";
  const phoneNumber = "[0-9]{3}[\\s\\-]?[0-9]{4}$";
  const phoneRegex = new RegExp(
    `${countryCode}${areaCode}${spacesDashes}${phoneNumber}`,
  );

  const pTag = document.createElement("p");
  pTag.className = "results-text";
  phoneRegex.test(input)
    ? (pTag.style.color = "#00471b")
    : (pTag.style.color = "#4d3800");
  pTag.appendChild(
    document.createTextNode(
      `${phoneRegex.test(input) ? "Valid" : "Invalid"} US number: ${input}`,
    ),
  );
  resultsDiv.appendChild(pTag);
};

checkBtn.addEventListener("click", () => {
  checkValidNumber(userInput.value);
  userInput.value = "";
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkValidNumber(userInput.value);
    userInput.value = "";
  }
});

clearBtn.addEventListener("click", () => {
  resultsDiv.textContent = "";
});
```
