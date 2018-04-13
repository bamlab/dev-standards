 # [Standard] Handle dates properly with moment.js

## Owner: [Arnaud Augustin](https://github.com/arnaud-git)

## Description
- A bad gestion of the dates may lead to bugs if you have your application or server running in various countries with different timezones. This standard will make sure that you manipulate the right dates, no matter your local time.

## Impact
- Manipulating dates properly will allow you to be sure that you always display the right dates to the end-users.

## Checks
- [ ] Dates are stored as string in UTC format
- [ ] Dates are manipulated as moment objects
- [ ] The local time of the machine is used only for display

## Bad Examples
```jsx
// Server side (Reunion UTC+04:00)
const storedDate = '2018-04-08 22:00' // obtained with moment.format('YYYY-MM-DD HH:mm')

// Application side (Paris UTC+01:00)
const receivedDate = '2018-04-08 22:00'
const momentDate = moment(receivedDate)

const formattedDateToDisplay = momentDate.format('DD MMMM HH:mm') // '08 April 22:00'
```

The problem here is that the stored date is implicitly considered to be expressed with the island of Réunion local time. However, the user in Paris, receiving this date, will consider that it is expressed in his own local time since no additional information about the timezone is given to the `moment` function.

## Good Examples
```jsx
// Server side (Réunion UTC+04:00)
const storedDate = '2018-04-08 18:00+00:00' // '08 April 22:00' on the island of Réunion stored in UTC

// Application side (Paris UTC+01:00)
const receivedDate = '2018-04-08 18:00+00:00'
const momentDate = moment(receivedDate)

const formattedDateToDisplay = momentDate.format('DD MMMM HH:mm') // '08 April 19:00'
```

This is the right approach to store and transfer dates between different timezones because the `+00:00` indicates that the time is stored in UTC. This format can be obtained using `moment('2018-04-08 22:00').utc().format('YYYY-MM-DD HH:mmZ')`.