# [MO] Implementing offline read and write feature

## Owner: [Maxime Sraïki](https://github.com/sraikimaxime)

## Motivation

Your application has to be used in a low connectivity context (abroad, far from towns, in the subway, in Darius's house, ...)

## General considerations

Whenever you're implementing offline features, you should think of the way you are going to tell your user he's offline. In order to be able to detect this, you can use the react-native's [`NetInfo.isConnected`](https://facebook.github.io/react-native/docs/netinfo.html#docsNav) function to get the connectivity status your phone thinks it has.
You should know that there's a way to check your connectivity by pinging one of your own server routes instead of basing it on the phone self awareness of its connectivity.

## Reading data offline

### Redux

You will need to use [`redux-persist`](https://github.com/rt2zz/redux-persist) in order to implement reading feature.

**Don't forget, when you're playing with async storage, you have to first determine three things:**

* When will I store the data from my application state to the async storage
* When will I get the data from the async storage to my application state
* When will I clear the data from the async storage

### MobX

Here we will do it by ourselves by using `AsyncStorage`, you can refer to this [MO](https://github.com/bamlab/dev-standards/blob/master/react-native/features/asyncstorage.mo.md) to know how to use `AsyncStorage`

You can also use [`mobx-persist`](https://github.com/pinqy520/mobx-persist) but in my experience, it's not simpler.

## Writing data offline

Before we look at how we do this with redux or mobx, let's talk about the principle.

We'll have several ways to handle offline data writing:

* Defensive:
  You'll tell your user that he's offline and that he needs to get his connection back before the operation is tried again - Once the operation is succesfully done, you'll update your application state accordingly
* Optimistic:
  You'll tell your user that he's offline and that he needs to get his connection back before the operation is tried again - You'll update your application state right after the user has done the action, and prepare a rollback action in case the action returns an error so that you keep the right data in your application state.

### with Redux offline

If you are using redux you can use [`redux-offline`](https://github.com/redux-offline/redux-offline), basically it provides you with all the ACTION, COMMIT, ROLLBACK logic that let you implement optimistic or defensive offline design.

To build something optimistic, do the state change on the ACTION, leave the COMMIT empty and rewind the application state on the ROLLBACK.

To build something defensive, change to a pending state on the ACTION and do the definitive state modification on the COMMIT only, the ROLLBACK is still a rewind of the application state.

If you are also implementing sagas, take a look at [this issue](https://github.com/redux-offline/redux-offline/issues/173)

### by yourself

If you can't use redux offline, you can also do it by yourself, the concept is not this complicated.
Whenever your user tries to write data through an api call when he doesn't have a good enough connectivity, you will store the payload somewhere in your store and in your async storage. Once it is stored you can tell your user what's happening and while doing so, you can either retry each time your connectivity status changes (example on [HLI](https://github.com/bamlab/exanergy-routes/tree/staging/src/redux/offline)) or show to your user that something went wrong and let him try again to do the call whenever he wants (example on [Ada](https://github.com/theodo/ada-express/blob/develop/AdaExpress/src/stores/offline.js)).
