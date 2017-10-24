# [Standard] Doing a timebox

## Owner: Alice Breton

## Checks

### Purpose of a timebox
It is hard for people to estimate the amount of time they will have to spend on a specific task, but it is much easier to compare the complexity between two tasks. This is why in the scrum method, tickets are estimated according to their complexity: the more difficult they are, the more points they are worth. 

However, to measure the complexity of a ticket the team must know how to develop it. And sometimes they cannot know in advance how to do it because there is uncertainty that needs to be removed. To overcome the impossibilty to estimate the complexity of tickets, we can use a timebox.

### What is a timebox ?
In a timebox the team decides to spend a certain amount of time on the ticket.
At the end of the timebox, there can be several outcomes, here are a few examples:
- Several solutions were found, it is up to the PR (product owner) to decide which one he would like to see in his project.
- The developper decided which is the best solution and had the time to partially or completely code the functionality.
- During the timebox, no solution was found.

### At the end of a timebox
**Write a report before moving the ticket to validation**: Without a report, the PO does not know what to validate. There is a risk of validation return.

### Bad examples of a report:

- The functionality is fully developped, you can validate that it works or create a ticket if it does not.

What is wrong:
  - We don't know precisely what is developped
  - It is interesting to give more detail on the different possibilities that were considered, and why the dev chose this one in particular.

### Good example of a report:

The ticket : (3) [TIMEBOX - 3H] As an admin, when a customer is on the last page of the report and clicks on SEND, I see his appointment updated on the CRM.


---
Timebox Report:
I have removed the uncertainty on sending the request to the CRM

What I have done:

  - Creation of a saga `submitReport` in which:
    - A PATCH request is sent to the CRM that changes the field `new_report` on the dynamics 365 website
    - The customer is redirected to the dashboard
  - When the customer clicks on the `SEND` button on the last page of the report, the saga is launched.

What is left to do:

  - The id of the appointment is stored in the state of the `report` page when the user clicks on the button `write a report`
  - Use this id in the request
  - Put in the payload of the request the fields that are in the state of the page `report` to update the report in the CRM

I have added a ticket in the Sprint+1 with a checklist: (2) As a customer, when I click on the `SEND` button my report is added to the CRM

---



