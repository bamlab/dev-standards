# [MO] Debug a React Native WebView *(~5 min)*

## Owner: [Louis Zawadzki](https://github.com/louiszawadzki)

## Prerequisites
- [ ] A React Native application with a WebView
- [ ] Safari if you want to debug on an iOS device

## Steps iOS *(~2min)*

- Run your app on your iOS simulator
- Open Safari
- Enable the "Develop" menu:
  - Pull down the "Safari" menu and choose "Preferences"
  - Click on the "Advanced" tab
  - Check the box next to "Show Develop menu in menu bar"
- Pull down the "Develop" menu
- Click on "Simulator" that should be right below your computer
- Select your WebView in the menu  

## Steps Android *(~3min)*

- In your `android/app/src/main/java/com/applilabchatbot/MainApplication.java` add `import android.webkit.WebView;` in the imports and the following line in your `onCreate` method:

```java
@Override
public void onCreate() {
  super.onCreate();
  SoLoader.init(this, /* native exopackage */ false);
+ WebView.setWebContentsDebuggingEnabled(true);
}
```

- Launch your app
- Open Chrome
- Go to [chrome://inspect](chrome://inspect)
- Select your WebView under your device name

### Common WebViews pitfalls

- To inject Javascript you have to set your WebView's `javaScriptEnabled` prop to `true`
- On Android, you can't use arrow functions in the injected javascript
- `window.postMessage` might not be available straight away in your injected Javascript, to make sure it's the case you can wrap your injected code by a setTimeout like this:

```js
setTimeout(function() {
  /* your injected js goes here */
}, 0)
```
