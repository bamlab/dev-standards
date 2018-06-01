# [Standard] Implementing a clean logout

## Owner: [Louis Lagrange](https://github.com/Minishlink)

## Checks

You should remove all persisted and in-memory user content after a logout.
You should logout from every external services silently.

* If my project uses `react-apollo`
    * the cache is cleared with [client.resetStore](https://www.apollographql.com/docs/react/advanced/caching.html#reset-store)
* If my project uses `redux`
    * there is a `LOGOUT` or `RESET_CUSTOMER_DATA` action that replaces the user reducers' states with the initial states
* If my project uses React-Native `AsyncStorage`
    * the cache is cleared with [AsyncStorage.clear](https://facebook.github.io/react-native/docs/asyncstorage.html#clear), or [AsyncStorage.multiRemove](https://facebook.github.io/react-native/docs/asyncstorage.html#multiremove) if you need to target only some keys.
* Errors should be caught and handled

## Good examples

```js
// pseudo code
const logout = async () => {
  try {
    await fetch('ZENDESK_LOGOUT_URL', { method: 'GET' });
    await firebase.auth().signOut();
    await AsyncStorage.clear();
    ReduxStore.dispatch(resetCustomerData());
    apolloClient.resetStore();
    Navigation.navigate('login');
  } catch (e) {
    HandleErrorService.handleError(e);
    // eventually show an error or retry
  }
}
```

## Bad examples

### Example 1

Without cleaning the user data, you will have state and data inconsistencies with the new user.

```js
// pseudo code
const logout = async () => {
  Navigation.navigate('login');
}
```

### Example 2

Without the `try catch`, the app will crash if the user has no connection, or if another error happens.

```js
// pseudo code
const logout = async () => {
    await fetch('ZENDESK_LOGOUT_URL', { method: 'GET' });
    await firebase.auth().signOut();
    await AsyncStorage.clear();
    ReduxStore.dispatch(resetCustomerData());
    apolloClient.resetStore();
    Navigation.navigate('login');
}
```