# [MO] Unmount a component on page change *(~14 min)*

## Owner: Nicolas Djambazian

## Motivation

React-navigation doesn't unmount your page when you go on the next one. That allow fast transition when you go back.

But if you are using a Camera component, a WebView or every component which use a lot of resources and can have side effect if it continue to run background, you need to unmount them when you leave the page.

For that, you can use the [`getPathAndParamsForState` of a Router](https://reactnavigation.org/docs/routers/api).

## Prerequisites *(~5min)*
 - The page have a container.
  -You must have a main stack navigation exported in `src/Routing.js`


## Steps *(~5min)*

 - Add a props `myFeatureIsActivated` on the component with default value at `true`
 - In the render method, display you component only if `myFeatureIsActivated` is at true:

 ```jsx
return ( 
  <View>
    {this.props.cameraIsActivated && <Camera />}
  </View>
);

 ```

- Test is your component still work (nothing should have change)
- Import your main stack navigation
- In the mapDispatchToProps, compare the path given by the getPathAndParamsForState to the path of your page, you should have something like:

```jsx
import { RootNavigator } from '../../../Routing';

const mapStateToProps = state => ({
  cameraActivated: RootNavigator.router.getPathAndParamsForState(state.navigation).path === 'path/of/the/page/in/navigation/stacks',
});
```

The path is given by your navigation stacks. In the following example, the path of `SIMCardScan` is `activate/simCardScan`

```jsx
const ActivateStack = StackNavigator(
  {
    welcome: {
      screen: Pages.SignUp.RequiredToActivateSim,
    },
    simCardScan: {
      screen: Pages.SignUp.SIMCardScan,
    },
  },
  {
    initialRouteName: 'welcome,
  }
);

export const RootNavigator = StackNavigator(
  {
    landing: {
      screen: LandingPage,
    },
    activate: {
      screen: ActivateStack,
    },
  },
  {
    initialRouteName: 'landing',
    navigationOptions: {
      headerStyle: styles.header,
      headerTintColor: theme.headerTextColor,
    },
    headerMode: 'screen',
  }
);
```

- Test a last time, your component should disappear at the beginning of the page transition.

