# [MO] Preloading MobX data with AsyncStorage

## Owner: [Yassine Chbani](https://github.com/yassinecc)

## Motivation

Your mobile app is great, but how does it behave offline? End users take their phones everywhere, including places without WiFi or with very poor network reception. You can make your app stand out from the crowd if it's usable offline (to check your hotel booking for example) by storing data locally in the phone. To do so, React Native provides a simple solution: `AsyncStorage`. It is especially suitable for small amounts of data which value you can fetch by key.

## Prerequisites

We need to import `AsyncStorage` from `react-native`. The following example will use two simple methods:

- AsyncStorage.setItem(key, value)
- AsyncStorage.getItem(key)

`key` and `value` are two strings, so don't pass a Javascript object in these functions! All AsyncStorage methods return a Promise object.

## Steps (~15 minutes)

It is recommended to use an extra layer of abstraction on top of the bare AsyncStorage that takes into account the particularities of the data you want to store. Let's start with a simple example where the hotel bookings I want to store have this structure:

``
booking
|- id
|- bookingDate
|- clientId
|- roomId
|_ isPaymentConfirmed
``

`roomId` and `clientId` refer to the following objects:

``
client
|- id
|_ name
``

``
room
|- id
|- number
|_ isAvailable
``

You have two options from this point:

1. Storing simple values

In this example, we want to display basic info about a current booking, such as `bookingDate`, `clientName`, and `roomNumber`. Let's first define a extra layer to list our AsyncStorage keys, in a `myAsyncStorage.js` file for example:

```jsx
import { AsyncStorage } from 'react-native'

const BOOKING_DATE = 'BOOKING_DATE'
const CLIENT_NAME = 'CLIENT_NAME'
const ROOM_NUMBER = 'ROOM_NUMBER'

export const asyncStorageKeys = {
  BOOKING_DATE,
  CLIENT_NAME,
  ROOM_NUMBER
}
```

These keys can be used to save/fetch data on the device in a `bookings.js` MobX store:

```jsx
import { observable, action } from 'mobx'
import { AsyncStorage } from 'react-native'
import { asyncStorageKeys } from 'myApp/src/services/myAsyncStorage'

class BookingsStore {
  constructor () {
    AsyncStorage.getItem(asyncStorageKeys.BOOKING_DATE)
      .then(bookingDate => {
        if (bookinDate) {
          this.bookingDate = bookingDate
        }
      })

      AsyncStorage.getItem(asyncStorageKeys.CLIENT_NAME)
      .then(clientName => {
        if (clientName) {
          this.clientName = clientName
        }
      })

      AsyncStorage.getItem(asyncStorageKeys.ROOM_NUMBER)
      .then(roomNumber => {
        if (roomNumber) {
          this.roomNumber = roomNumber
        }
      })
  }
  @observable bookingDate = null
  @observable clientName = ''
  @observable roomNumber = null
  
  @action leaveRoom(roomNumber) {
    AsyncStorage.setItem(asyncStorageKeys.ROOM_NUMBER, true)
  }
  }
}
```

This approach works fine until you want to preload data in the form of objects and not strings. e.g. multiple bookings. Fortunately there is a workaround to solve this issue.

2. Storing complex objects in JSON strings

We mentioned earlier that you shouldn't pass anything else than a string to `AsyncStorage.setItem`. You can however use `JSON.stringify` to convert your JavaScript objects to serialized JSON strings for storage. The original objects can be recovered using the `JSON.parse` method. Our `myAsyncStorage.js` file becomes:

```jsx
import { AsyncStorage } from 'react-native'

const BOOKINGS = 'BOOKINGS'
const CLIENT = 'CLIENT'
const ROOMS = 'ROOMS'

export const asyncStorageKeys = {
  BOOKINGS,
  CLIENT,
  ROOMS
}

export const getObjectFromAsyncStorage = (itemName) => {
  return AsyncStorage.getItem(itemName)
  .then(item => {
    if(item) JSON.parse(item)
    else {
      reject(Error('Empty result'))
    }
  ).catch(error => console.log(error))
}

export const setObjectInAsyncStorage = (key, value) => {
  const valueString = JSON.stringify(value)
  AsyncStorage.setItem(key, value)
}
```

Notice how the file has become more manageable and easy to read. To manage the conversion between Javascript objects and the strings that AsyncStorage receives, it is recommended to define a couple of getter/setter helper functions. You will avoid systematically calling `JSON.parse` and `JSON.stringify` outside `myAsyncStorage.js`, keeping your code even more readable:

```jsx
import { observable, action } from 'mobx'
import { AsyncStorage } from 'react-native'
import { asyncStorageKeys, getItemFromAsyncStorage, setItemInAsyncStorage } from 'myApp/src/services/myAsyncStorage'

class BookingsStore {
  constructor () {
    getItemFromAsyncStorage(asyncStorageKeys.BOOKINGS)
    .then(bookings.map(booking => 
      this.bookings.push(booking)
    }))

    getItemFromAsyncStorage(asyncStorageKeys.CLIENT)
    .then(client => {
      this.client = client
    })

    getItemFromAsyncStorage(asyncStorageKeys.ROOMS)
    .then(rooms.map(room => {
      this.rooms.push(room)
    }))
  }
  @observable bookings = null
  @observable client = null
  @observable rooms = null
  
  @action leaveRoom(roomId) {
    this.rooms[roomId].isAvailable = true
    setItemInAsyncStorage(asyncStorageKeys.ROOMS, this.rooms)
  }
  }
}
```

Notice that by using Promise rejection in the `getObjectFromAsyncStorage` method, we can avoid checking whether loaded items are empty, thus refactoring our code.

## Troubleshooting and extras

There are of course many more ways to use asyncStorage, if you want to explore them visit [this page](https://facebook.github.io/react-native/docs/asyncstorage.html)
