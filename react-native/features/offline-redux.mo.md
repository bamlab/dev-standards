# [MO] Implementing offline read and write feature

## Owner: [Maxime Sraïki](https://github.com/sraikimaxime)

## Control Points

{% hint style='success' %}

If you want to make your application work offline, you'll need to check that

{% endhint %}

* [ ] Data are persisted accross application restart
* [ ] Your user is aware of its connectivity state
* [ ] When you're offline, you gracefully handle the network interraction for the user

## Motivation

Your application has to be used in a low connectivity context (abroad, far from towns, in the subway, in Darius's house, ...)

## Prerequisites

* [ ] Working with React-Native app
* [ ] Using Redux as an application state manager

{% hint style='info' %} MobX User ?

If you're using Mobx, [check this out](./offline-mobx.mo.md)

{% endhint %}

## Steps

## Knowing wether or not you're offline (~20min)

## Reading data offline (~15m)

{% hint style='success' %} **Control points**

* [ ] Persist some data
* [ ] Kill your app
* [ ] Turn it to plane mode
* [ ] Open your app
* [ ] See your data

{% endhint %}

Use [`redux-persist`](https://github.com/rt2zz/redux-persist).

## Writing data offline (~30m)

### With Redux-Offline

You can use [`redux-offline`](https://github.com/redux-offline/redux-offline), basically it provides you with all the ACTION, COMMIT, ROLLBACK logic that let you implement optimistic or defensive offline design.

To build something optimistic, do the state change on the ACTION, leave the COMMIT empty and rewind the application state on the ROLLBACK.

To build something defensive, change to a pending state on the ACTION and do the definitive state modification on the COMMIT only, the ROLLBACK is still a rewind of the application state.

If you are also implementing sagas, take a look at [this issue](https://github.com/redux-offline/redux-offline/issues/173)

### Without Redux Offline

We also implemented writing feature without redux offline on a project @BAM, let me know if you want to know more !

## Tips & TroubleShoot

* In order to be able to detect this, you can use the react-native's [`NetInfo.isConnected`](https://facebook.github.io/react-native/docs/netinfo.html#docsNav) function to get the connectivity status your phone thinks it has.

* There are ways to check user's connectivity by pinging one of your own server routes instead of basing it on the phone self awareness of its connectivity.

* We did not implement offline calls that would need conflict management (several users able to access the same data at the same time) yet.
