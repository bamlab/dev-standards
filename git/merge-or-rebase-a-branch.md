# [MO] <Merge or rebase a branch> (~ 2 min)

## Owner: Arthur Levoyer

## Prerequisites

- Have git-cli installed

## Context

Let's say, you are currently working on your own `my-feature` branch and someone from your team is merging new commits into the `master` branch which you would like to use. You have two different possibilities to incorporate them to your `my-feature` branch.

![image](https://wac-cdn.atlassian.com/dam/jcr:01b0b04e-64f3-4659-af21-c4d86bc7cb0b/01.svg?cdnVersion=fp)

## Steps
1. First approach: Merge a branch

Merge the `master` branch into the `feature` branch by entering following:
- `git checkout my-feature` 
- `git merge master` 
It gives you a new “merge commit” in the feature branch that ties together the histories of both branches. 

It's nice because it is a non-destructive operation but if your `master` branch is very active, you might quickly have a new commits including a lot of changes and this will pollute your history quite a lot.

![image](https://wac-cdn.atlassian.com/dam/jcr:e229fef6-2c2f-4a4f-b270-e1e1baa94055/02.svg?cdnVersion=fp) 


2. Second approach: Rebase a branch
- `git checkout my-feature` 
- `git rebase master` 

<p>The difference with the merge solution above, it that it will create new commits into your `my-feature` for each commits in `master` and give you a much cleaner project history. </p>

On the other hand, a very unwanted situation might occur if you do not follow the [Golden Rules of Rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing#the-golden-rule-of-rebasing)

![image](https://wac-cdn.atlassian.com/dam/jcr:5b153a22-38be-40d0-aec8-5f2fffc771e5/03.svg?cdnVersion=fp)

Source: [atlassian.com](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)

