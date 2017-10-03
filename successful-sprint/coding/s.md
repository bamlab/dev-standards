# [Standard] Good practices to resolve a ticket

## Owner: Selim BEN AMMAR

## Prerequisites

* I understand well the userStory
* check: I know how my PO can validate it
* After reading the checklist in my ticket, I go through my code to find the files that will be modified.
* For each file, I find the part of the code that will be targeted.
* I create a git branch: git checkout -b feature—ticketNumber-ComponentName-FonctionalityShortDescription

## Steps

To make my code session as efficient as possible, I do a plan by decomposing my functionality in independent parts:
For each of those parts I write down:
1. The name of the Page/Component where I plan to do a code modification
2. The detail of the modification I will make
3. The functional test: Actions I will do in the app to make sure that it works and that it didn’t generate any bug or unexpected behavior.
4. A reminder to run project automatic tests (prettier, flow, jest…)
5. A reminder to commit the relevant modifications
6. An estimation of the time I need to finish this part.

## Tips:
* Andon as much as possible while constructing your plan.
* When the plan is finished, you HAVE to present it to a more experienced dev in order to challenge it before coding.
