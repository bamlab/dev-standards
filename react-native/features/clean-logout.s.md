# [Standard] Implementing a clean logout

## Owner: [Louis Lagrange](https://github.com/Minishlink)

## Checks

You should remove all persisted and in-memory user content after a logout.

* If my project uses `react-apollo`
    * the cache is cleared with [client.resetStore](https://www.apollographql.com/docs/react/advanced/caching.html#reset-store)
* If my project uses `redux`
    * there is a `LOGOUT` action that replaces the user reducers' states with the initial states
* If my project uses React-Native `AsyncStorage`
    * the cache is cleared with [AsyncStorage.clear](https://facebook.github.io/react-native/docs/asyncstorage.html#clear), or [AsyncStorage.multiRemove](https://facebook.github.io/react-native/docs/asyncstorage.html#multiremove) if you need to target only some keys.
