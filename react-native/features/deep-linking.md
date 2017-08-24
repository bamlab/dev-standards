# [MO] How to implement deep linking with react-navigation

## Owner : [Nicolas Ngomai](https://github.com/lechinoix)

* What is deep linking ?

Deeplinking permits you to register a custom URL Scheme in your phone so that when calling a url as `myapp://mypath?param=value` the phone will open the app with the `mypath?param=value`.
In React Native, you can use the Linking Module that handle the external links in your app.
When calling a deeplink in your app, a 'url' event will be dispatch with the url associated.

## How to implement ?

- Follow this guide from react navigation : https://reactnavigation.org/docs/guides/linking
- For complementary information, you can consult Linking documentation : https://facebook.github.io/react-native/docs/linking.html

## Troubleshooting

### iOS

If you have Facebook SDK installed, a "application" function will already be implemented in your AppDelegate.m
You will nedd to refactor the two methods as is :

```
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  if([[FBSDKApplicationDelegate sharedInstance] application:application
                                                                openURL:url
                                                      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
      ]){
    return YES;
  }
  else if([RCTLinkingManager application:application openURL:url options:options]){
    return YES;
  }

  return NO;
}

```

### Android

If you already have an intent-filter in your MainApplication, had a different one just beside

```
<intent-filter>
  <action android:name="android.intent.action.MAIN" />
  <category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myapp" android:host="myapp" />
</intent-filter>

```

