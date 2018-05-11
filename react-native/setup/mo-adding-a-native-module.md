# \[MO\] Adding a native module

The time needed for this depends largely on the native module and the features you want.  
If you don't count the feature implementation \(so only installing the native module\) and if everything goes well, it should not take more than 1 hour.

However, some uncommon packages are more nasty than others on Android, or iOS, or both. So if you install a native module that was not yet used by BAM, I recommend to foresee 3 hours and a TIMEBOX.

## Owner: [Louis Lagrange](https://github.com/Minishlink)

## Prerequisites

* [ ] A React Native app
* [ ] A native module you want to install

## Steps

On Android the step "Make sure it builds well" means:

* build in debug \(eg. `react-native run-android`\)
* build in release \(eg. `cd android && ./gradlew assembleRelease` if you didn't edit the default configuration setup\)
* if it doesn't build well, see the troubleshooting part or ask for help.

On iOS, the step "Make sure it builds well" means:

* build in debug \(eg. `react-native run-ios`\)
* build in release \(eg. `react-native run-ios --configuration Release` if you didn't edit the default configuration setup\)
* if it doesn't build well, see the troubleshooting part or ask for help.
* Create your branch
* Open your project in XCode. It makes XCode happy as it reorganizes your \`.pbxproj alphabetically among other things.
* Commit these changes \(`.pbxproj` and/or `Info.plist`\). This will make the work of your PR reviewer way more easier.
* `yarn add the-native-module`
* Commit \(eg. "Add the-native-module to node\_modules"\)
* Decide if you want to start with the Android part or the iOS part.
  * You'll want to start with the easiest path, so that you can also implement the Javascript side \(if there is one\) and have a feature working completely for at least one platform.
  * Most of the time, Android will be the easiest path, because it's faster to build and easier to debug.
* Follow the below paths depending on whether you chose to start with Android or iOS

|  |
| --- |


|  |
| --- |


| Android first |
| --- |


| iOS first |
| --- |


  
&lt;/tr&gt;

|  |
| --- |


|  |
| --- |


1. `react-native link the-native-module`
2. Make sure it builds well on Android and commit every changes except those related to iOS \(eg. "\[Android\] Link the-native-module"\)
3. Follow potential additional Android steps listed in the-native-module's doc.
4. Make sure it builds well and commit every changes except those related to iOS \(eg. "\[Android\] Setup the-native-module"\)
5. Implement the Javascript side if there are any, targeting only Android \(use `Platform.OS === 'android'`\)
6. Commit every changes except those related to iOS \(eg. "\[JS\] Setup the-native-module"\)
7. Do you still have time to implement iOS?
   * A. Yes. Bravo! You can go on with iOS.
   * B. No. Split your tickets in two, save your iOS changes on a new branch, merge, deploy, test and put into validation. \(if the ticket is 5 pts, put into validation 3 pts\) Then, go on with iOS.

&lt;/td&gt;

|  |
| --- |


1. `react-native link the-native-module`
2. Verify that the iOS linking went well. Be critical and identify potential things that were added to your `.pbxproj` but should not have been. If you're not confident enough, ask for help!
3. Make sure it builds well and commit the iOS changes if there were any \(eg. "\[iOS\] Link the-native-module"\).
4. Open your project in XCode to make it happy again.
5. Commit these changes \(eg. "\[iOS\] Reorganize pbxproj"\).
6. Follow potential additional iOS steps listed in the-native-module's doc.
7. Make sure it builds well and commit the iOS changes if there were any \(eg. "\[iOS\] Setup the-native-module"\).
8. Implement the Javascript side if there are any, targeting only iOS \(use `Platform.OS === 'ios'`\)
9. Commit every changes except those related to Android \(eg. "\[JS\] Setup the-native-module"\)
10. Do you still have time to implement Android?
    * A. Yes. Bravo! You can go on with Android.
    * B. No. Split your tickets in two, save your Android changes on a new branch, merge, deploy, test and put into validation. \(if the ticket is 5 pts, put into validation 3 pts\) Then, go on with Android.

&lt;/td&gt;  
&lt;/tr&gt;

|  |
| --- |


|  |
| --- |


For iOS:

1. Verify that the iOS linking went well. Be critical and identify potential things that were added to your `.pbxproj` but should not have been. If you're not confident enough, ask for help!
2. Make sure it builds well on iOS and commit the changes if there were any \(eg. "\[iOS\] Link the-native-module"\).
3. Open your project in XCode to make it happy again.
4. Commit these changes \(eg. "\[iOS\] Reorganize pbxproj"\).
5. Follow potential additional iOS steps listed in the-native-module's doc.
6. Make sure it builds well and commit the changes if there were any \(eg. "\[iOS\] Setup the-native-module"\).
7. On the JS side, remove the potential corresponding `Platform.OS === 'android'`
8. Commit every changes \(eg. "\[JS\] Setup the-native-module for iOS"\)
9. Bravo! Merge, deploy, test and put into validation.

&lt;/td&gt;

|  |
| --- |


For Android:

1. Make sure it builds well on Android and commit every Android changes \(eg. "\[Android\] Link the-native-module"\)
2. Follow potential additional Android steps listed in the-native-module's doc.
3. Make sure it builds well and commit every changes \(eg. "\[Android\] Setup the-native-module"\)
4. On the JS side, remove the potential corresponding `Platform.OS === 'ios'`
5. Commit every changes \(eg. "\[JS\] Setup the-native-module for Android"\)
6. Bravo! Merge, deploy, test and put into validation.

&lt;/td&gt;  
&lt;/tr&gt;

&lt;/table&gt;

## Troubleshooting

Please make a PR or an issue \(and ping the current owner\) if you see any other common problems!

### Android

#### Google Play Services

If you install a package that uses Google Play Services \(`com.google.android.gms`\), you may encounter issues if you already use a package that needs them.

In order to fix the issues, you'll need to force using a specific version. To do so:  
1. Search for `com.google.android.gms` in your `node_modules` and filter in `.gradle` files  
2. For each dependency, in your `app/build.gradle`, exclude the `com.google.android.gms` group  
3. For each dependency, in your `app/build.gradle`, add compilation of the specific version of `com.google.android.gms` modules that are needed

Here's an example with:

* `react-native-maps` that needs `com.google.android.gms:play-services-base` and `com.google.android.gms:play-services-maps`
* `react-native-batch-push` that needs `com.google.android.gms:play-services-base` and `com.google.android.gms:play-services-gcm`
* `react-native-firebase` that needs `com.google.android.gms:play-services-base` but doesn't include it in its dependencies so you don't have to exclude the `com.google.android.gms` group

```text
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

For a more general operating process on this, see [Handle version conflicts between Gradle dependencies](https://bamtech.gitbooks.io/dev-standards/react-native/debugging/handle-gradle-dependencies-clash.mo.html).

### iOS

#### Lottie

Linking adds `Lottie-Screenshot` to the `HEADER_SEARCH_PATHS` of each config in your `.pbxproj`.  
Remove it as it conflicts with other Lottie's headers and it is not needed for `lottie-react-native`.

