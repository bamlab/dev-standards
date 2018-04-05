# [MO] How to investigate back-end performance

- **Owner:** [Xavier Lefèvre](https://www.github.com/xavierlefevre)
- **Last update date:** 5th of April 2018

## Why
- You don't know from which end investigate the performance issue. Follow those steps to make sure you know how to investigate in an efficient way. Also in a way that you'll be able to share and explain your learnings easily with others.

## Steps
- [ ] Define the context of the problem, and how to reproduce it
    - Ex: We want a performing player ranking query from a 3G network
- [ ] Check the [performance tools and technics](./backend-performance-tools.md) before anything
- [ ] Make sure you note every steps of your investigation, take screenshots and draw schemas
    - Ex: I requested the ranking route from Postman with the ID of a user => I changed the network in order to see the impact of bad internet on the request time => etc.
- [ ] Start from the main broad problem, take screenshots and note your exact findings
    - Ex: The request takes 12,235s on an iPhone 4S on 3G network
- [ ] Cut your problem in pieces as soon as you start going into details, and continue noting
    - Ex: The ranking request fetches data from the portfolio API in 10,123s and the user API in 1,856s
- [ ] Make hypotheses: from 10,123s, you expect with your fix to reach below 1s because of a potential SQL query mis-performance
- [ ] Fix it, and then compare the result with your initial state
    - If the issue is not fixed, write down that your hypotheses is invalid, it still is a learning and worth sharing 
- [ ] Update your product owner and team mates: by saving and sharing your final report, like in a Gist or Trello Ticket
- [ ] Iterate...
- [ ] Finally share what you learned with your team to be challenged and move forward!
