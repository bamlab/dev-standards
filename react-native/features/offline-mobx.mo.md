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

* Your application has to be used in a low connectivity context (abroad, far from towns, in the subway, in Darius's house, ...)

## Prerequisites

* [ ] Working with a React-Native app
* [ ] Using MobX as an application state manager

{% hint style='info' %} Redux User ?

If you're using Redux, [check this out](./offline-redux.mo.md)

{% endhint %}

## Steps

## Knowing wether or not you're offline (~20min)

{% hint style='success' %} **Control points**

* [ ] Create an observable reflecting the state of your connectivity
* [ ] Turn your app to plane mode
* [ ] Check the observable is saying you're offline
* [ ] Turn plane mode off
* [ ] Check the observable is saying you're online

{% endhint %}

Create a connectivity store

```js
import { NetInfo } from "react-native";
import { observable, action } from "mobx";

class ConnectivityStore {
  constructor() {
    NetInfo.isConnected.addEventListener("connectionChange", this.checkConnection);
  }

  @observable isConnected = null;

  checkConnection = isConnected => {
    if (this.isConnected !== isConnected) {
      NetInfo.isConnected.removeEventListener("connectionChange", this.checkConnection);
      NetInfo.isConnected.addEventListener("connectionChange", this.checkConnection);
    }
    this.setIsConnected(isConnected);
  };

  @action
  setIsConnected = isConnected => {
    this.isConnected = isConnected;
  };
}

const connectivityStore = new ConnectivityStore();

export default connectivityStore;
```

## Reading data offline (~ 20min)

{% hint style='success' %} **Control points**

* [ ] Persist some data
* [ ] Kill your app
* [ ] Turn it to plane mode
* [ ] Open your app
* [ ] See your data

{% endhint %}

Here we will do it by ourselves by using `AsyncStorage`, you can refer to this [MO](https://github.com/bamlab/dev-standards/blob/master/react-native/features/asyncstorage.mo.md) to know how to use `AsyncStorage`

{% hint style='info' %} Another Solution

You can also use [`mobx-persist`](https://github.com/pinqy520/mobx-persist) but in my experience, it's not simpler.

{% endhint %}

## Writing data offline

### Defensive (~1h)

{% hint style='success' %} **Control points**

* [ ] Your user knows that he's offline and that he needs to get his connection back before the operation is tried again.
* [ ] You show your user a temporary state of the data he was supposed to modify.
* [ ] You only update your application state once the remote operation is succesfully done.

{% endhint %}

* Define what call you want to make work offline
* Store the payload to your application state as pending
* Persist it
* Whenever there is something stored as pending in your store, display a warning message to the user to let him know
* When he wants to, let him do the call again with the stored payload
* Clear the pending observable when your call is succesful

In your offline store:

```js
import { observable, action } from "mobx";
import { AsyncStorage } from "react-native";
import momentTz from "moment-timezone";
import moment from "moment/min/moment-with-locales";
import { asyncStorageKeys } from "../services/asyncStorage";

momentTz.locale("fr");

class OfflineStore {
  constructor() {
    AsyncStorage.getItem(asyncStorageKeys.DEPARTURE_INVENTORY_PENDING).then(isDepartureInventoryPending => {
      if (isDepartureInventoryPending) {
        this.isDepartureInventoryPending = JSON.parse(isDepartureInventoryPending);
      }
    });
    AsyncStorage.getItem(asyncStorageKeys.PENDING_DEPARTURE_INVENTORY).then(pendingDepartureInventory => {
      if (pendingDepartureInventory) {
        const pendingDepartureInventoryFromAsyncStorage = JSON.parse(pendingDepartureInventory);
        if (pendingDepartureInventoryFromAsyncStorage.inventoryDate) {
          pendingDepartureInventoryFromAsyncStorage.inventoryDate = moment.utc(
            pendingDepartureInventoryFromAsyncStorage.inventoryDate
          );
        }
        this.pendingDepartureInventory = pendingDepartureInventoryFromAsyncStorage;
      }
    });
  }

  @observable isDepartureInventoryPending = false;
  @observable pendingDepartureInventory = {};

  @action
  setIsDepartureInventoryPending = boolean => {
    this.isDepartureInventoryPending = boolean;
    AsyncStorage.setItem(
      asyncStorageKeys.DEPARTURE_INVENTORY_PENDING,
      JSON.stringify(this.isDepartureInventoryPending)
    );
  };

  @action
  setPendingDepartureInventory = inventory => {
    this.pendingDepartureInventory = inventory;
    AsyncStorage.setItem(asyncStorageKeys.PENDING_DEPARTURE_INVENTORY, JSON.stringify(this.pendingDepartureInventory));
  };

  storePendingDepartureInventory = inventory => {
    this.setPendingDepartureInventory(inventory);
    this.setIsDepartureInventoryPending(true);
  };

  clearPendingDepartureInventory = () => {
    this.setPendingDepartureInventory({});
    this.setIsDepartureInventoryPending(false);
  };
}

const offlineStore = new OfflineStore();

export default offlineStore;
```

In your component

```js
sendPendingDepartureInventory = () =>
  confirmDepartureInventory(
    this.props.pendingDepartureInventory.bookingId,
    this.props.pendingDepartureInventory.damages,
    this.props.pendingDepartureInventory.mileageStart,
    this.props.pendingDepartureInventory.energyStartInLiters,
    this.props.accessToken,
    this.props.pendingDepartureInventory.energyType,
    this.props.pendingDepartureInventory.inventoryDate,
    this.props.pendingDepartureInventory.isKeyCardPresent
  )
    .then(() => {
      this.props.booking.isDepartureInventoryConfirmed = true;
      this.props.clearPendingDepartureInventory();
      this.setState({ shouldDisplaySuccessModal: true });
    })

  return Promise.resolve();
});

[...]

{this.props.isDepartureInventoryPending && (
    <EDLAlert
      sendInventory={this.sendPendingDepartureInventory}
      title={I18n.t('departureInventoryOffline_alertSend.title')}
      text={I18n.t('departureInventoryOffline_alertSend.text')}
      onMenuPress={() => this.drawer.openDrawer()}
    />
  )
}
```

We implemented a working example of it @BAM, let me know if you want to know more about it.

{% hint style='info' %} Go further

This is a working example for a one shot call but you can also write a queue of calls letting you store multiple payloads with multiple calls.

{% endhint %}

### Optimistic (~2h00)

{% hint style='success' %} **Control points**

* [ ] Your user knows that he's offline and that he needs to get his connection back before the operation is tried again.
* [ ] You update your application state directly after the user action.
* [ ] You rollback the modification if something goes wrong in the remote operation.

{% endhint %}

* Define what call you want to make work offline
* Store the payload to your application state as pending
* Persist it
* Whenever there is something stored as pending in your store display a discret message/icon to the user to let him know
* When you get online again (you can use your connectivity observable) try to do the call again
* Define a fail detection strategy (for instance after n tries, decide that the called is failed and rollback the state modification you made)

## Tips & TroubleShoot

* In order to be able to detect this, you can use the react-native's [`NetInfo.isConnected`](https://facebook.github.io/react-native/docs/netinfo.html#docsNav) function to get the connectivity status your phone thinks it has.

* There are ways to check user's connectivity by pinging one of your own server routes instead of basing it on the phone self awareness of its connectivity.

* We did not implement offline calls that would need conflict management (several users able to access the same data at the same time) yet.
