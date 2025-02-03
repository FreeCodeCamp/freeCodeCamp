---
id: 677d3b8fac17ba6cbf3d8afa
title: Task 3
challengeType: 22
dashedName: task-3
---

<!-- (Audio) Bob: I want to start by saying that you've done a great job with your QA work. -->

# --instructions--

Listen to the audio and complete the sentence below.

# --fillInTheBlank--

## --sentence--

`I want to start by BLANK that you've done a great job with your BLANK work.`

## --blanks--

`saying`

### --feedback--

This is the -ing form of the verb `say`, used after the preposition `by` to indicate the method of starting.

---

`QA`

### --feedback--

This stands for `Quality Assurance`, referring to the process of ensuring products meet required standards.

# --explanation--

When a verb follows a preposition, it must take the `-ing` form (gerund). In this sentence, `saying` follows the preposition `by`, indicating the method Bob uses to start his statement. For example:

`She improved her skills by practicing regularly.` - Here, `practicing` follows the preposition `by`, showing how she improved her skills.

Bob compliments Jessica for her work in `QA`. `QA` stands for `Quality Assurance`. It refers to the process of ensuring that products or services meet specific quality standards and function correctly. For example:

`The QA team identified several bugs during testing.` - This means that the people responsible for making sure the quality of the software is good managed to detect bugs in the software before its release.

# --scene--

```json
{
  "setup": {
    "background": "company2-boardroom.png",
    "characters": [
      {
        "character": "Bob",
        "position": {
          "x": 50,
          "y": 15,
          "z": 1.2
        },
        "opacity": 0
      }
    ],
    "audio": {
      "filename": "B1_8-1.mp3",
      "startTime": 1,
      "startTimestamp": 3.3,
      "finishTimestamp": 6.7
    }
  },
  "commands": [
    {
      "character": "Bob",
      "opacity": 1,
      "startTime": 0
    },
    {
      "character": "Bob",
      "startTime": 1,
      "finishTime": 4.4,
      "dialogue": {
        "text": "I want to start by saying that you've done a great job with your QA work.",
        "align": "center"
      }
    },
    {
      "character": "Bob",
      "opacity": 0,
      "startTime": 4.9
    }
  ]
}
```
