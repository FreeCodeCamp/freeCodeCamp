---
id: 679d3cfdaca2eb81f8d81cf7
title: Task 97
challengeType: 19
dashedName: task-97
---

<!-- (Audio) Maria: Can you look into it and see what's causing the problem? -->

# --instructions--

Listen to the audio and answer the question below.

# --questions--

## --text--

What is Maria asking James to do?

## --answers--

To fix the problem immediately.

### --feedback--

Maria is not asking that James fix the issue right away.

---

To report the issue to the client.

### --feedback--

Maria does not mention informing the client.

---

To investigate the problem.

---

To ignore the problem for now.

### --feedback--

Maria is not asking that James ignore the issue.

## --video-solution--

3

# --explanation--

The word `can` is commonly used to make polite requests, asking someone to do something in an informal way. In this case, Maria is requesting James to investigate the problem. For example:

`Can you send me the report by noon?` - This is a polite way to ask someone to send a report.

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
      }
    ],
    "audio": {
      "filename": "B1_8-3.mp3",
      "startTime": 1,
      "startTimestamp": 35.5,
      "finishTimestamp": 37.56
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
      "finishTime": 3.06,
      "dialogue": {
        "text": "Can you look into it and see what's causing the problem?",
        "align": "center"
      }
    },
    {
      "character": "Maria",
      "opacity": 0,
      "startTime": 3.56
    }
  ]
}
```
