# The Hesitant Client

Module 2 of The Architecture of Influence, Practice 2. Four AI client scenarios that run one after the other on the projector, with a timer for every team answer.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | The screen you project. Scenario list, client card, timer, Decision Ladder, conversation, reveal. |
| `api/_scenarios.js` | The four scenarios (client card, hidden worry, the client's lines, the three endings). Edit wording here. |
| `api/client.js` | Sends the team's question to the AI, which rates it (strong, neutral or weak) and replies as the client. |
| `api/scenarios.js` | Sends the scenarios to the screen. |
| `api/_auth.js` | Optional passcode check. |
| `package.json`, `vercel.json` | Settings for Vercel. No packages to install. |

## Deploy

1. **GitHub.** Create a new private repository, for example `hesitant-client`. Click **Add file › Upload files** and drag in everything from this folder, keeping the `api` folder as a folder. Commit.
2. **Vercel.** Click **Add New › Project**, import the repository, and leave the framework preset as **Other**, with no build command.
3. **Environment variables.** In the Vercel project, open **Settings › Environment Variables** and add:
   - `ANTHROPIC_API_KEY`: your API key from the Claude Console. Without it, the app still runs in scripted mode.
   - `FACILITATOR_PASSCODE`: optional. The password is **AOI-2026** by default and is asked every time the page is opened. Set this variable only if you want a different password.
   - `ANTHROPIC_MODEL`: optional. The default is `claude-haiku-5-5`, which is fast enough to keep the room's rhythm. Change it here if you prefer another model.
4. **Redeploy** after adding the variables (Deployments › the three dots › Redeploy), so they take effect.

## Test before the session

- Open the Vercel link. The pill at the top right says **AI client** when the key is working, and **Scripted · no AI key** when it is not.
- Play scenario A with a few strong questions and a few weak ones (a discount, "we are very experienced"), and check that the client opens up and closes down as expected.
- Played scenarios are marked on the list. Press **Clear the played marks before the next group** before the morning session, and again before the afternoon session. Each group plays three of the four scenarios, one per team of three, and the fourth stays as a spare.

## How a run works

0. Open the link and enter the password (AOI-2026).
1. Start the scenario. The team reads the client card.
2. Press **Show the client's opening line**. The 1-minute timer starts.
3. When the spokesperson reads the team's question, type it and press **Enter**. The timer stops, the client replies, and the timer restarts for the next question.
4. After the fourth question the client concludes: commits, postpones or declines.
5. Press **Observers' conclusions** (2-minute timer), then **Reveal the hidden worry**. The ladder and the conversation now show how each question was rated.
6. Press **Next scenario**, or use the **A to D** buttons above the conversation to jump to any scenario at any time. If a run is in progress, the screen asks you to confirm first. Played scenarios show with a dashed outline.
7. Press **Next scenario**. After scenario D, the run is complete.

## Settings (top right)

- **Client replies**: *AI generated*, or *Scripted, I judge*. In scripted mode you press Strong, Neutral or Weak after each question and the scripted line appears. If the AI fails or the connection drops during a session, the same three buttons appear automatically, so the run never stops.
- **Seconds per team answer**: 60 by default.
- **Seconds for observers**: 120 by default.
- **Sound** at the end of each timer.
- **Show the rating of each question live**: off by default, so the observers do their own judging.

## The ending rule

- **Commits**: at least 3 strong questions, including questions 2 (finding the worry) and 3 (sizing it).
- **Postpones**: at least 2 strong questions.
- **Declines**: 0 or 1 strong question.

The AI writes its own wording, so its lines are close to the script but not identical. The direction is fixed: it opens up on a real question and closes down on a pitch, a discount or a long explanation.
