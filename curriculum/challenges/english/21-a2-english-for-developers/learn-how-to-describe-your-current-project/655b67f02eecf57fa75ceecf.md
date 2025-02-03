---
id: 655b67f02eecf57fa75ceecf
title: Task 8
challengeType: 22
dashedName: task-8
---

<!-- (Audio) Sophie: That's important work. I'm helping our team learn how to stay safe online. -->

# --description--

`Stay` is used to indicate remaining in a particular state or condition. 
It's often used in instructions or advice to keep oneself in a certain situation. For example:

- `Stay safe online.` - Continue being safe while using the internet. 

- `Stay calm during the test.` - Continue being calm.

- `Stay focused on your work.` - Continue paying attention to your work.


# --fillInTheBlank--

## --sentence--

`That's important work. I'm BLANK our team learn how to BLANK safe online.`

## --blanks--

`helping`

### --feedback--

This word indicates that Sophie is actively providing assistance or support to her team. It is in the gerund form `-ing`

---

`stay`

### --feedback--

This word is used to suggest maintaining a certain state, in this case, being safe while online.

# --scene--

```json
{
  "setup": {
    "background": "interview-room3.png",
    "characters": [
      {
        "character": "Sophie",
        "position": {"x":50,"y":0,"z":1.4},
        "opacity": 0
      }
    ],
    "audio": {
      "filename": "2.3-1.mp3",
      "startTime": 1,
      "startTimestamp": 13.92,
      "finishTimestamp": 17.34
    }
  },
  "commands": [
    {
      "character": "Sophie",
      "opacity": 1,
      "startTime": 0
    },
    {
      "character": "Sophie",
      "startTime": 1,
      "finishTime": 4.42,
      "dialogue": {
        "text": "That's important work. I'm helping our team learn how to stay safe online.",
        "align": "center"
      }
    },
    {
      "character": "Sophie",
      "opacity": 0,
      "startTime": 4.92
    }
  ]
}
```
