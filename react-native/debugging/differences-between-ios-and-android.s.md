## What differences between iOS and android should I be aware of as a react-native developer?
## ... and when should I double check my feature on both platforms?

*react-native is awesome because it lets you build both iOS and android apps with the same javascript codebase...*

While coding I usually use the iOS simulator only. Most of the time, if the feature works on iOS then it works on android automatically. Of course there are a few exceptions: in this article you will find a non comprehensive list of caveats.


### I modified the native code

- I added/updated a **font**

  - Why: You might have forgotten to update the font for one of the two OSs.
  - References: See [How to add/update  icons with an icomoon font](https://github.com/bamlab/dev-standards/blob/master/react-native/features/icomoon.mo.md) and [How to add a new font to a react-native app](https://medium.com/react-native-training/react-native-custom-fonts-ccc9aacf9e5e)


- I installed a **native library**

  - Why:

    - The installation process depends on the platform
    - For many reasons, the building phase might go wrong with one of the OSs. For instance there might be code signing issues with iOS
    - Once installed, the library might behave differently on iOS and android

  - References: See [How to add a native module](https://github.com/bamlab/dev-standards/blob/master/react-native/setup/add-native-module.mo.md)

### I added a fixed height property to a component

- Why: Unlike iOS, android sets the default behaviour to the react-native `<View />` component to `overflow: hidden`. Using a fixed height often ends up with cut texts or cut images on android.

### I added shadows to a component

- Works on iOS / does not on android:

```javascript
<View style={styles.container}><Text>Hello</Text></View>

const styles = {
  container: {
    shadowColor: 'grey',
    shadowRadius: 10,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1, width: 1 },
    elevation: 3,
  },
}
```

- Works on both platforms:

```javascript
<View style={styles.container}><Text>Hello</Text></View>

const styles = {
  container: {
    shadowColor: 'grey',
    shadowRadius: 10,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1, width: 1 },
    elevation: 3,
    backgroundColor: 'white', // <-- backgroundColor is mandatory for android
  },
}
```

### I used react-native's `<TextInput />` component

- Why: <TextInput /> does not render identically on android and iOS:

  - With android you might need to specify the `underlineColorAndroid` prop (can be set to `"transparent"` for example)
  - The vertical alignment of the input text is not the same. This can be solved by using a marginTop that depends on the platform: `marginTop: Platform.OS === 'ios ? ...'`

### I mistakenly added text direcly as a `<View />`'s child

- Why: `<View>Hello</View>` does not crash iOS but crashes on android with the following error `Cannot add a child that doesn't have a YogaNode to a parent without a measure function! (Trying to add a 'ReactVirtualTextShadowNode' to a 'NativeViewWrapper')`

- Typical example - This is extremely dangerous on android:

  ```javascript
  <View>{this.props.myText && <Text>this.props.myText</Text>}</View>
  ```

  If this.props.myText is equal to `''` then you end up with `<View>''</View>` and the app **crashes** on android. One way to do this correctly is:


  ```javascript
  <View>{!!this.props.myText && <Text>this.props.myText</Text>}</View>
  ```

### I used a javascript function that is not implemented the same way in react-native's javascript interpreters for android and iOS

- Why: As of July 2018, react-native's javascript interpreter for android is a little bit late compared to iOS's. There are a few methods that just won't work with android:

  - `Number.prototype.toLocaleString()`
  - `String.prototype.normalize()`
