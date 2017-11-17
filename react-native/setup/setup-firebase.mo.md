
# [MO] Setup Firebase analytics on your React Native project *(~<Time> min)*

## Owner: [Guillaume LEROY](http://github.com/GuillaumeLe/)

## Prerequisites
* Have yarn installed
* Have cocoapods in your project.

## Steps *(~30 min)*
### Install react-native-firebase *(~2 min)*
First you should install react-native-firebase on your project:

Check the right version to use according to your react-native version.

`yarn add react-native-firebase`

and link the native part of the react-native-firebase module:

`react-native link react-native-firebase`

### Setup iOS *(~5 min)*
Download the `GoogleService-Info.plist` from the firebase console and paste it on `ios/[YOUR APP NAME]/GoogleService-Info.plist`.

To initialize the firebase SDK, add the following lines on the `ios/[YOUR APP NAME]/AppDelegate.m`:

* At the top of the file:
```c
#import <Firebase.h>
```

* In the `didFinishLaunchingWithOptions:(NSDictionary *)launchOptions` method before the return:
```c
[FIRApp configure];
```

On the Podfile `ios/Podfile`, check the platform version at least '9.0':

`platform :ios, '9.0'`

and add the requirement:
```
pod 'Firebase/Core'
pod 'Firebase/Analytics'
```

run `pod install` from your `ios/` folder.

### Setup Android *(~8 min)*
#### Setup google-services.json
Download the `google-services.json` from the firebase console and paste it on `android/app/google-services.json`.

Add the following lines on the `android/build.gradle` file:
```gradle
buildscript {
  // ...
  dependencies {
    // ...
    classpath 'com.google.gms:google-services:3.1.1'
  }
}
```

and at the VERY BOTTOM of the `android/app/build.gradle` add:
`apply plugin: 'com.google.gms.google-services'`

#### Add Firebase modules
On the `android/app/build.gradle` add:
```gradle
dependencies {
  // This should be here already
  compile(project(':react-native-firebase')) {
    transitive = false
  }

  // Firebase dependencies
  compile "com.google.android.gms:play-services-base:11.4.2"
  compile "com.google.firebase:firebase-core:11.4.2"
  compile "com.google.firebase:firebase-analytics:11.4.2"

  ...
```

and add the following lines to `android/build.gradle`:
```gradle
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
        // -------------------------------------------------
        // Add this below the existing maven property above
        // -------------------------------------------------
        maven {
            url 'https://maven.google.com'
        }
    }
}
```

Update your `android/app/src/main/java/com/[app name]/MainApplication.java` to integrate the Firebase analytics package:

```java
// ...
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // <-- Add this line

public class MainApplication extends Application implements ReactApplication {
    // ...

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNFirebasePackage(),
          new RNFirebaseAnalyticsPackage() // <-- Add this line
      );
    }
  };
  // ...
}
```


### Check your google services version *(~10 min)*

The google services version used in Firebase could be in conflict with the version of other native modules (like react-native-maps).

The following [Medium blog post](https://medium.com/@suchydan/how-to-solve-google-play-services-version-collision-in-gradle-dependencies-ef086ae5c75f) propose a way to maintain the same version.

### Setup for multiple environments (dev, staging, prod ...) *(~10 min)*

If you use multiple environments you should manage multiple Firebase configurations. [Louis' blog post](https://medium.com/bam-tech/setup-firebase-on-ios-android-with-multiple-environments-ad4e7ef35607) describe how to deals with multiple Firebase environments.
