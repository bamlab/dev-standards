# [Standard] React Native Maps performance

## Owner: [Alban Depretz](https://github.com/chdeps)

## Why

A lot of apps seem to be struggling with performance when it comes to maps & displaying pins. So I put together a REX that goes hand in hand with Louis Lagrange's standard on performance. You'll see that some generic tips given by Louis are applied here. It could be considered as an application of the standard by taking into account the specifics of maps' rendering.

## What

Here are a few tips I suggest using to improve your maps' performance:

1. Use `onRegionChangeComplete` instead of onRegionChange. You will wait until you're done changing the region.
2. Use `debounce` when making HTTP calls to fetch new pins.

> ⚠️ If a call takes longer than your wait time. Another call might triggered in the mean time & go through the callback before the first call. It might cause a laggy feeling & incoherent data. Cancelling debounce will not cancel async callback. You can do something like below :

```javascript
     //Generate a unique id to identify a query
     const queryId = shortid.generate();
     this.queryId = queryId;
     this.setState({ isLoading: true }, () =>
       this.props
         .callForPins(..args)
         .then(({ data: { pins } }) => {
           //There is a newest callback no need to update the state
           if (this.queryId !== queryId) return;
           return this.setState({
             pins,
           });
         })
         .catch(console.warn)
         .finally(() => this.setState({ isLoading: false }))
     );
```

3. Use a `caching technique` to reduce the number of queries

   When calling for new pins, you need to consider what your inputs are. Given that you query pins on the map with the following arguments:
   * Region on which the user is (eg. You're located over Paris. You don't want to load a pin in New York)
   * Types of pins (eg. On a map, you just want the restaurants but you don't want to see the shops)
   * Search field (eg. If you're searching for bistrots you don't want to get Mc Donalds' pins)

   You can create a hash key with the type of pins & the search field :

```javascript
        //callForPins callback
        const key = extractKey({ pinTypes, search });
        this.setState({
            queriedRegion: {
              [key]: boundaries(region),
            },
            pins,
        });
```

   Before querying for new pins on the map check whether the last query's hash key is the same & whether the region of your query is within the previous query's region. If so we already have the pins & there is no need for querying new pins.

```javascript
      _getPins = (region, pinTypes, search) => {
        //Create a uniq key out of the pinTypes & search parameters
        const key = extractKey({ pinTypes, search });
        if (this.state.queriedRegion[key]
            && isRegionWithIn(boundaries(region), this.state.queriedRegion[key])) return;
        //Call for new pins with debounce if the pinTypes or search parameters have changed since last time
        //Or if the region queried is larger than the previous one
        return this._callForPinsDebounce(region, pinTypes, search);
      };
```

> As regards to caching, there still things that need to be done. At the time, I was doing that Apollo did not provide any caching per parameter. It would allow us to have a greater history of calls in cache & only the last one. Also, ideally you could think of caching when zooming out. This involves some dev on the back-end, as it means that you are capable of fetching pins in a ring & only inside a cercle.

4. `shouldComponentUpdate` is your friend. Don't re-render the map if your pins haven't updated for instance.
5. Clustering of pins on the front end ([Clustering with react-native-maps](https://github.com/bamlab/react-native-components-collection/tree/master/packages/react-native-component-map-clustering))

