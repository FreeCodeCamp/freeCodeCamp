---
id: 679d2dc229e6ceeadff4ed48
title: Task 92
challengeType: 22
dashedName: task-92
---

<!-- (Audio) James: Do you think we need to update the software again? If we do, it might delay other projects. -->

# --instructions--

Listen to the audio and complete the sentence below.

# --fillInTheBlank--

## --sentence--

`Do you think we need to update the software again? If we BLANK, it might BLANK other projects.`

## --blanks--

`do`

### --feedback--

This word is used to avoid repeating the verb "update" from the previous sentence.

---

`delay`

### --feedback--

This word means to postpone or make something happen later than planned.

# --explanation--

Instead of saying `If we update the software, it might delay other projects.`, James shortens it to `If we do`. The word `do` in this context is used to avoid repeating the verb or a complete phrase used in from the previous sentence. For example:

`She wants to join the meeting, and if she does, she'll need the link.` - Instead of saying `if she joins the meeting`, you can use `does` to replace it and this way you can avoid the repetition.

The word `delay` means to make something happen later than planned. For example:

`The flight was delayed due to bad weather.` - This means the flight was postponed and did not leave on time.

# --scene--

```json
{
  "setup": {
    "background": "company1-boardroom.png",
    "characters": [
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
      "startTimestamp": 26.86,
      "finishTimestamp": 31.46
    }
  },
  "commands": [
    {
      "character": "James",
      "opacity": 1,
      "startTime": 0
    },
    {
      "character": "James",
      "startTime": 1,
      "finishTime": 2.88,
      "dialogue": {
        "text": "Do you think we need to update the software again?",
        "align": "center"
      }
    },
    {
      "character": "James",
      "startTime": 3.16,
      "finishTime": 5.6,
      "dialogue": {
        "text": "If we do, it might delay other projects.",
        "align": "center"
      }
    },
    {
      "character": "James",
      "opacity": 0,
      "startTime": 6.1
    }
  ]
}
```
