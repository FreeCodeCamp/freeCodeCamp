---
id: 67051431a73f1ca25d9a6f25
title: Build a Project Idea Board
challengeType: 26
dashedName: build-a-project-idea-board
---

# --description--

**Objective:** Fulfill the user stories below and get all the tests to pass to complete the lab. 

**User Stories:**

1. You should define an object constant named `projectStatus` with the three keys: `PENDING`, `SUCCESS`, and `FAILURE`. Each status should be assigned an object with a `description` key with the value `Pending Execution`, `Executed Successfully`, and `Execution Failed`, respectively.
2. You should define a class named `ProjectIdea` with a `constructor` that takes `title` and `description` as parameters. Initialize the `title` and `description` properties with the provided parameters. The class should also have a property named `status` that is set to the value `projectStatus.PENDING` by default.
3. You should define a method named `updateProjectStatus` inside the `ProjectIdea` class. This method should accept a `newStatus` parameter and update the `status` property to the given value.
4. You should define a `ProjectIdeaBoard` class with a `constructor` that accepts a `title` and initializes an empty array named `ideas` to hold instances of the `ProjectIdea` class.
5. You should define a method named `pin` inside the `ProjectIdeaBoard` class that accepts an instance of the `ProjectIdea` class and pushes the given instance to the `ideas` array.
6. You should define a method named `unpin` inside the `ProjectIdeaBoard` class. This method should accept an instance of the `ProjectIdea` class and removes it from the `ideas` array.
7. You should define a method named `count` that returns the number of project ideas in the given `ProjectIdeaBoard` array.
8. You should define a method named `formatToString` that returns the name of the projects ideas, their description and status in the format:

```js
<ProjectIdeaBoard title> has <ProjectIdeaBoard count> idea(s)
<ProjectIdea title> (<ProjectIdea status description>) - <ProjectIdea description>
<ProjectIdea title> (<ProjectIdea status description>) - <ProjectIdea description>
.
.
.
```

# --hints--

You should define an object constant named `projectStatus` with the correct project statuses and descriptions.

```js
assert.isObject(projectStatus);
assert.sameMembers(Object.keys(projectStatus), ["PENDING", "SUCCESS", "FAILURE"]);
assert.deepEqual(projectStatus.PENDING, { description: "Pending Execution" });
assert.deepEqual(projectStatus.SUCCESS, { description: "Executed Successfully" });
assert.deepEqual(projectStatus.FAILURE, { description: "Execution Failed" });
```

You should have a `ProjectIdea` class.

```js
assert.isFunction(ProjectIdea);
assert.isObject(new ProjectIdea());
```

Your `ProjectIdea` class should initialize the `title` property and `description` property based on the parameters passed. It should also set the status to `projectStatus.PENDING`.

```js
const test = new ProjectIdea("sample title", "sample description");
assert.isAbove(test.title.length, 0);
assert.isAbove(test.description.length, 0);
assert.strictEqual(test.status.description, "Pending Execution");
```

Your `ProjectIdea` class should have a `updateProjectStatus` method.

```js
const projectIdea = new ProjectIdea();
assert.isFunction(projectIdea.updateProjectStatus);
```

You should have a `ProjectIdeaBoard` class.

```js
assert.isFunction(ProjectIdeaBoard);
assert.isObject(new ProjectIdeaBoard());
```

Your `ProjectIdeaBoard` should initialize the `title` property based on the parameter passed and initialize an empty array named `ideas` to hold instances of the `ProjectIdea` class.

```js
const test = new ProjectIdeaBoard("Sample Title");
assert.isArray(test.ideas);
assert.lengthOf(test.ideas, 0);
assert.exists(test.title);
```

Your `ProjectIdeaBoard` class should have a `pin` method.

```js
const projectIdeaBoard = new ProjectIdeaBoard();
assert.isFunction(projectIdeaBoard.pin);
```

Your `ProjectIdeaBoard` class should have an `unpin` method.

```js
const projectIdeaBoard = new ProjectIdeaBoard();
assert.isFunction(projectIdeaBoard.unpin);
```

Your `ProjectIdeaBoard` class should have a `count` method.

```js
const projectIdeaBoard = new ProjectIdeaBoard();
assert.isFunction(projectIdeaBoard.count);
```

Your `ProjectIdeaBoard` class should have a `formatToString` method.

```js
const projectIdeaBoard = new ProjectIdeaBoard();
assert.isFunction(projectIdeaBoard.formatToString);
```

`new ProjectIdea("Smart Window Locks", "An automation project allowing users to lock, unlock windows automatically based on weather conditions.")` should return `{ title: 'Smart Window Locks', description: 'An automation project allowing users to lock, unlock windows automatically based on weather conditions.', status: { description: 'Pending Execution' } }`.

```js
const windowLocks = new ProjectIdea(
  "Smart Window Locks",
  "An automation project allowing users to lock, unlock windows automatically based on weather conditions."
);
assert.deepEqual(windowLocks, {
  title: "Smart Window Locks",
  description:
    "An automation project allowing users to lock, unlock windows automatically based on weather conditions.",
  status: { description: "Pending Execution" },
});
```

Calling `updateProjectStatus(projectStatus.SUCCESS)` on `new ProjectIdea("Fitness Tracker App", "An app that tracks user workouts, diet, and sleep patterns.")` should update the status to `{ description: 'Executed Successfully' }`.

```js
let mobileApp = new ProjectIdea(
  "Fitness Tracker App",
  "An app that tracks user workouts, diet, and sleep patterns."
);

// Update the project status to SUCCESS
mobileApp.updateProjectStatus(projectStatus.SUCCESS);
assert.deepEqual(mobileApp, {
  title: "Fitness Tracker App",
  description: "An app that tracks user workouts, diet, and sleep patterns.",
  status: { description: "Executed Successfully" },
});
```

Calling `updateProjectStatus(projectStatus.FAILURE)` on `new ProjectIdea("Breakfast Chef Robot", "A robot that can follow a given list of instructions and prepare breakfast for the user and let them know through their phone.")` should update the status to `{ description: 'Execution Failed' }`.

```js
let breakfastChef = new ProjectIdea(
  "Breakfast Chef Robot",
  "A robot that can follow a given list of instructions and prepare breakfast for the user and let them know through their phone."
);

// Update the project status to FAILURE
breakfastChef.updateProjectStatus(projectStatus.FAILURE);

assert.deepEqual(breakfastChef, {
  title: "Breakfast Chef Robot",
  description:
    "A robot that can follow a given list of instructions and prepare breakfast for the user and let them know through their phone.",
  status: { description: "Execution Failed" },
});
```

Calling `updateProjectStatus(projectStatus.SUCCESS)` on `new ProjectIdea("Online Used Video Games Store", "An online platform where users can buy second hand physical copies of video games from other users.")` should update the status to `{ description: 'Executed Successfully' }`.

```js
let usedVideoGamesStore = new ProjectIdea(
  "Online Used Video Games Store",
  "An online platform where users can buy second hand physical copies of video games from other users."
);

// Update the project status set to SUCCESS
usedVideoGamesStore.updateProjectStatus(projectStatus.SUCCESS);

assert.deepEqual(usedVideoGamesStore, {
  title: "Online Used Video Games Store",
  description:
    "An online platform where users can buy second hand physical copies of video games from other users.",
  status: { description: "Executed Successfully" },
});
```

You should be able to pin a `ProjectIdea` object to your `ProjectIdeaBoard` using the `pin` method.

```js
let smartHome = new ProjectIdea(
  "Smart Home System",
  "An integrated system to control lighting, temperature, and security devices remotely."
);

// Create a project board and pin the idea
let techProjects = new ProjectIdeaBoard("Tech Projects Board");
techProjects.pin(smartHome);

// Correct the assertion to compare the first idea in the array
assert.deepEqual(techProjects.ideas[0], {
    title: 'Smart Home System',
    description: 'An integrated system to control lighting, temperature, and security devices remotely.',
    status: { description: 'Pending Execution' }
});
```

You should be able to unpin a `ProjectIdea` object to your `ProjectIdeaBoard` using the `unpin` method.

```js
let smartHome = new ProjectIdea(
  "Smart Home System",
  "An integrated system to control lighting, temperature, and security devices remotely."
);

// Create a project board and pin ideas
let techProjects = new ProjectIdeaBoard("Tech Projects Board");

techProjects.pin(smartHome);
techProjects.unpin(smartHome);

assert.isEmpty(techProjects.ideas);
```

When `new ProjectIdeaBoard("Empty Board")` is empty, `emptyBoard.formatToString()` should return `Empty Board has 0 idea(s)\n`.

```js

let smartHome = new ProjectIdea(
  "Smart Home System",
  "An integrated system to control lighting, temperature, and security devices remotely."
);

// Create a project board and pin ideas
let techProjects = new ProjectIdeaBoard("Tech Projects Board");

// Create an empty board
let emptyBoard = new ProjectIdeaBoard("Empty Board");

// Attempt to unpin a project from an empty board
emptyBoard.unpin(smartHome);

assert.equal(emptyBoard.formatToString(), "Empty Board has 0 idea(s)\n");
```

When you pin `new ProjectIdea("Smart Home System", "An integrated system to control lighting, temperature, and security devices remotely.")` to `new ProjectIdeaBoard("Tech Projects Board")`, `techProjects.formatToString()` should return `Tech Projects Board has 1 idea(s)\nSmart Home System (Pending Execution) - An integrated system to control lighting, temperature, and security devices remotely.\n`.

```js
let techProjectsBoard = new ProjectIdeaBoard("Tech Projects Board");
let smartHome = new ProjectIdea("Smart Home System", "An integrated system to control lighting, temperature, and security devices remotely.");
techProjectsBoard.pin(smartHome);

assert.equal(techProjectsBoard.formatToString(), "Tech Projects Board has 1 idea(s)\nSmart Home System (Pending Execution) - An integrated system to control lighting, temperature, and security devices remotely.\n"); 
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
const projectStatus = {
  PENDING: { description: "Pending Execution" },
  SUCCESS: { description: "Executed Successfully" },
  FAILURE: { description: "Execution Failed" },
};

class ProjectIdea {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.status = projectStatus.PENDING;
  }

  updateProjectStatus(newStatus) {
    this.status = newStatus;
  }
}

class ProjectIdeaBoard {
  constructor(title) {
    this.title = title;
    this.ideas = [];
  }

  pin(newIdea) {
    this.ideas.push(newIdea);
  }

  unpin(idea) {
    this.ideas.splice(this.ideas.indexOf(idea), 1);
  }

  count() {
    return this.ideas.length;
  }

  formatToString() {
    let representation = `${this.title} has ${this.count()} idea(s)\n`;

    this.ideas.forEach(
      (idea) =>
        (representation += `${idea.title} (${idea.status.description}) - ${idea.description}\n`),
    );
    return representation;
  }
}

let windowLocks = new ProjectIdea(
  "Smart Window Locks",
  "An automation project allowing users to lock, unlock windows automatically based on weather conditions."
);

let breakfastChef = new ProjectIdea(
  "Breakfast Chef Robot",
  "A robot that can follow a given list of instructions and prepare breakfast for the user and let them know through their phone."
);
breakfastChef.updateProjectStatus(projectStatus.FAILURE);

let usedVideoGamesStore = new ProjectIdea(
  "Online Used Video Games Store",
  "An online platform where users can buy second hand physical copies of video games from other users."
);
usedVideoGamesStore.updateProjectStatus(projectStatus.SUCCESS);

let hardwareProjectIdeas = new ProjectIdeaBoard("Hardware Project Board");
hardwareProjectIdeas.pin(windowLocks);
hardwareProjectIdeas.pin(breakfastChef);

let softwareProjectIdeas = new ProjectIdeaBoard("Software Project Board");
softwareProjectIdeas.pin(usedVideoGamesStore);

console.log(softwareProjectIdeas.formatToString());

console.log(hardwareProjectIdeas.formatToString());
hardwareProjectIdeas.unpin(breakfastChef);
console.log(hardwareProjectIdeas.formatToString());
```
