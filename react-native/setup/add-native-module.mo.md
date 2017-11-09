# [MO] Adding a native module
The time needed for this depends largely on the native module and the features you want.
If you don't count the feature implementation (so only installing the native module) and if everything goes well, it should not take more than 1 hour.
However, some uncommon packages are more nasty than others on Android, or iOS, or both, so I recommend to foresee 3 hours.

## Owner: Louis Lagrange

## Prerequisites

- [ ] A React Native app
- [ ] A native module you want to install

## Steps
1. Decide if you want to start with the Android part or the iOS part.
  * You'll want to start with the easiest path, so that you can also implement the Javascript side (if there is one) and have a feature working completely for at least one platform.
  * Most of the time, Android will be the easiest path, because it's faster to build and easier to debug.
2. Create your branch
3. Open your project in XCode. It makes XCode happy as it reorganizes your .pbxproj alphabetically among other things.
4. Commit these changes (`.pbxproj` and/or `Info.plist`). This will make the work of your PR reviewer way more easier.
5. `yarn add the-native-module`
6. Commit (eg. "Add the-native-module to node_modules")
7. Follow the below paths depending on whether you chose to start with Android or iOS

### Android
#### As starting point
1. `react-native link the-native-module`
2. Follow potential additional Android steps listed in the-native-module's doc.
3. Make sure it builds well in debug (eg. `react-native run-android`) and release (eg. `cd android && ./gradlew assembleRelease`). If not, see the troubleshooting part.
4. Commit every changes except those related to iOS (eg. "[Android] Setup the-native-module")
5. Implement the Javascript side if there are any, targeting only Android (use `Platform.OS === 'android'`)
6. Commit every changes except those related to iOS (eg. "[JS] Setup the-native-module")
7. Do you still have time to implement iOS? 
    A. Yes. Bravo! You can go on with iOS.
    B. No. Split your tickets in two, save your iOS changes on a new branch, merge, deploy, test and put into validation. (if the ticket is 5 pts, put into validation 3 pts) Then, go on with iOS.

#### After iOS
1. Follow potential additional Android steps listed in the-native-module's doc.
2. Make sure it builds well in debug (eg. `react-native run-android`) and release (eg. `cd android && ./gradlew assembleRelease`). If not, see the troubleshooting part.
3. Commit every changes (eg. "[Android] Setup the-native-module")
4. Remove the potential corresponding `Platform.OS === 'ios'`
5. Commit every changes (eg. "[JS] Setup the-native-module for Android")
6. Bravo! Merge, deploy, test and put into validation.

### iOS
#### As starting point
1. `react-native link the-native-module`
2. Verify that the linking went well. Be critical and identify potential things that were added to your `.pbxproj` but should not have been. If you're not confident enough, ask for help!
3. Commit these changes.
4. Open your project in XCode yo make it happy again.
5. Commit these changes.
6. Follow potential additional iOS steps listed in the-native-module's doc.
7. Make sure it builds well in debug (eg. `react-native run-ios`) and release (eg. `react-native run-ios --configuration Release`). If not, see the troubleshooting part.
8. Commit every changes except those related to Android (eg. "[iOS] Setup the-native-module")
9. Implement the Javascript side if there are any, targeting only iOS (use `Platform.OS === 'ios'`)
10. Commit every changes except those related to Android (eg. "[JS] Setup the-native-module")
11. Do you still have time to implement Android? 
    A. Yes. Bravo! You can go on with Android.
    B. No. Split your tickets in two, save your Android changes on a new branch, merge, deploy, test and put into validation. (if the ticket is 5 pts, put into validation 3 pts) Then, go on with Android.

#### After Android
1. Verify that the linking went well. Be critical and identify potential things that were added to your `.pbxproj` but should not have been. If you're not confident enough, ask for help!
2. Commit these changes if there were any.

1. Follow potential additional iOS steps listed in the-native-module's doc.
2. Make sure it builds well in debug (eg. `react-native run-ios`) and release (eg. `react-native run-ios --configuration Release`). If not, see the troubleshooting part.
3. Commit every changes (eg. "[iOS] Setup the-native-module")
4. Remove the potential corresponding `Platform.OS === 'android'`
5. Commit every changes (eg. "[JS] Setup the-native-module for iOS")
6. Bravo! Merge, deploy, test and put into validation.

## Troubleshooting
Please make a PR or an issue (and ping the current owner) if you see any other common problems!

### Android
#### Google Play Services
If you install a package that uses Google Play Services (`com.google.android.gms`), you may encounter issues if you already use a package that needs them.

In order to fix the issues, you'll need to force using a specific version. To do so:
1. Search for `com.google.android.gms` in your `node_modules` and filter in `.gradle` files
2. For each dependency, in your `app/build.gradle`, exclude the `com.google.android.gms` group
3. For each dependency, in your `app/build.gradle`, add compilation of the specific version of `com.google.android.gms` modules that are needed

Here's an example with:
* `react-native-maps` that needs `com.google.android.gms:play-services-base` and `com.google.android.gms:play-services-maps`
* `react-native-batch-push` that needs `com.google.android.gms:play-services-base` and `com.google.android.gms:play-services-gcm`
* `react-native-firebase` that needs `com.google.android.gms:play-services-base` but doesn't include it in its dependencies so you don't have to exclude the `com.google.android.gms` group

```
# `implementation` is the new `compile` starting from Gradle 4
dependencies {
    implementation(project(':react-native-maps')){
      exclude group: 'com.google.android.gms'
    }
    implementation(project(':react-native-batch-push')){
      exclude group: 'com.google.android.gms'
    }
    implementation(project(':react-native-firebase')) {
        transitive = false
    }
    implementation "com.google.android.gms:play-services-base:11.4.2"
    implementation "com.google.android.gms:play-services-maps:11.4.2"
    implementation "com.google.android.gms:play-services-gcm:11.4.2"
    implementation "com.google.firebase:firebase-core:11.4.2"
    implementation "com.google.firebase:firebase-crash:11.4.2"
```

### iOS
#### Lottie
Linking adds `Lottie-Screenshot` to the `HEADER_SEARCH_PATHS` of each config in your `.pbxproj`.
Remove it as it conflicts with other Lottie's headers and it is not needed for `lottie-react-native`.
