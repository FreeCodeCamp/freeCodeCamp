---
id: 679cebb26c5d61aaed58b4db
title: Task 79
challengeType: 19
dashedName: task-79
---

<!-- (Audio) Maria: Did you hear anything about this? James: No, I didn't. What did he say? -->

# --instructions--

Listen to the audio and answer the question below.

# --questions--

## --text--

What does James know about the issue with the latest update?

## --answers--

He knows exactly what the issue is.

### --feedback--

James clearly says he didn't hear anything.

---

He doesn't know anything about it.

---

He already talked to the client.

### --feedback--

James does not mention speaking to the client.

---

He received an email about the issue.

### --feedback--

James states that he didn't hear anything.

## --video-solution--

2

# --explanation--

Short answers with auxiliary verbs repeat the auxiliary from the question to confirm or deny something. In this case, Maria asks, `Did you hear anything?`, and James responds, `No, I didn't.` instead of just saying `No.` Here are some other examples: 

- `Are you coming to the meeting?` → `Yes, I am.`  

- `Have they finished the report?` → `No, they haven't.`  

- `Will she be here on time?` → `Yes, she will.`  

Short answers make responses sound natural and complete while avoiding repetition of the full sentence.

# --scene--

```json
{
  "setup": {
    "background": "company1-boardroom.png",
    "characters": [
      {
        "character": "Maria",
        "position": {
          "x": 50,
          "y": 0,
          "z": 1.5
        },
        "opacity": 0
      },
      {
        "character": "James",
        "position": {
          "x": 50,
          "y": 15,
          "z": 1.2
        },
        "opacity": 0
      }
    ],
    "audio": {
      "filename": "B1_8-3.mp3",
      "startTime": 1,
      "startTimestamp": 5.62,
      "finishTimestamp": 9.24
    }
  },
  "commands": [
    {
      "character": "Maria",
      "opacity": 1,
      "startTime": 0
    },
    {
      "character": "Maria",
      "startTime": 1,
      "finishTime": 2.32,
      "dialogue": {
        "text": "Did you hear anything about this?",
        "align": "center"
      }
    },
    {
      "character": "Maria",
      "opacity": 0,
      "startTime": 2.49
    },
    {
      "character": "James",
      "opacity": 1,
      "startTime": 2.49
    },
    {
      "character": "James",
      "startTime": 2.66,
      "finishTime": 4.62,
      "dialogue": {
        "text": "No, I didn't. What did he say?",
        "align": "center"
      }
    },
    {
      "character": "James",
      "opacity": 0,
      "startTime": 5.12
    }
  ]
}
```
