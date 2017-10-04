# [MO] Lock the device screen

## Owner: [Kévin Jean](https://github.com/Miniplop)

## Prerequisites
- A running React Native app, preferably started with the generator

## Steps

- Follow [this](https://github.com/yamill/react-native-orientation/blob/master/README.md) to install react-native-orientation

> :warning: Do not forget to rebuild your app

### Lock all the app pages

> :warning: Do not lock the screen rotation on react-native-camera or other native modules which needs screen rotation

We need to lock all the app pages, to do so import react-native-orientation in our top component:

`import Orientation from 'react-native-orientation`

Add those lines to lock the orientation:

```
componentWillMount () {
  Orientation.lockToPortrait()
}
```

- Refresh your app, and try to rotate your screen

- [Star the repo](https://github.com/yamill/react-native-orientation) if it works ;)
