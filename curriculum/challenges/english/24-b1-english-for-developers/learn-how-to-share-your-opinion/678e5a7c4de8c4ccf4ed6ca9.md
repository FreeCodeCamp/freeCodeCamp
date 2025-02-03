---
id: 678e5a7c4de8c4ccf4ed6ca9
title: Task 66
challengeType: 22
dashedName: task-66
---

<!-- (audio) Jake: Okay, let's agree to disagree. -->

# --instructions--

Listen to the audio and complete the sentence below.

# --fillInTheBlank--

## --sentence--

`Okay, let's BLANK to BLANK.`

## --blanks--

`agree`

### --feedback--

This word means to have the same opinion or to reach a mutual understanding. 

---

`disagree`

### --feedback--

This word means to have a different opinion or to not be in agreement.

# --explanation--

`Agree` means to be in agreement or have the same opinion as someone. For example:  

`We both agree that improving security is important.` - This means you share the same opinion about security with other person.

`Disagree` means to have a different opinion or not be in agreement. For example:  

`Jake and Maria disagree on which software to use.` - This shows that Jake and Maria have different opinions on the choice of software.

# --scene--

```json
{
  "setup": {
    "background": "company1-boardroom.png",
    "characters": [
      {
        "character": "Jake",
        "position": {
          "x": 50,
          "y": 0,
          "z": 1.4
        },
        "opacity": 0
      }
    ],
    "audio": {
      "filename": "B1_9-2.mp3",
      "startTime": 1,
      "startTimestamp": 55.9,
      "finishTimestamp": 58.08
    }
  },
  "commands": [
    {
      "character": "Jake",
      "opacity": 1,
      "startTime": 0
    },
    {
      "character": "Jake",
      "startTime": 1,
      "finishTime": 3.18,
      "dialogue": {
        "text": "Okay, let's agree to disagree.",
        "align": "center"
      }
    },
    {
      "character": "Jake",
      "opacity": 0,
      "startTime": 3.68
    }
  ]
}
```
