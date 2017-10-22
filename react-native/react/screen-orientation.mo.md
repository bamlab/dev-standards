# [MO] Handle screen orientation (iOS & Android)
## Owner: [Julien Nassar](https://github.com/juliennassar)
## Sponsor: [Alexandre Moureaux](https://github.com/almouro)

> **Note**: Please create an [issue](https://github.com/bamlab/dev-standards/issues/new) or even a Pull Request with your feedback, typo correction.

## Context

You may sometimes need to control the screen orientation of your app. You might want to fix your screen orientation to portrait mode only, or, depending on the page you are in, you might want to specify a screen orientation for some of your screens.

## Prerequisites (~ 2 minutes)
- [ ] Have a React Native application [using yo generator](https://github.com/bamlab/generator-rn-toolbox)

# Force a unique orientation for your app

## Steps (~2 minutes)

- for iOS, open XCode, in your project settings -> general -> deployment info check the devices orientations you want to allow on your app :

ex : In this example I only allowed Portrait mode

<img width="864" alt="screen shot 2017-10-22 at 13 06 22" src="https://user-images.githubusercontent.com/13121639/31861233-ef267ec4-b729-11e7-80d4-3eb8126dccc4.png">


Then kill your packager and rebuild your app with `react-navite run-ios`

- for android, go in your editor and open the file `android/app/src/main/AndroidManifest.xml`, in the manifest/application/activity tag, add `android:screenOrientation="portrait"` to lock your app un portrait mode.

ex :
```xml
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android"
    [...]
    >
    <application
      android:name=".MainApplication"
      [...]
      >
      <activity
        android:screenOrientation="portrait"
        [...]
      >
      </activity>
    </application>

</manifest>
```

# Force a multiple orientation constraints (~5 minutes)

Use the [`react-native-orientation`](https://github.com/yamill/react-native-orientation) package :
`yarn add react-native-orientation``
You have to link the package with `react-native link` to use it, then rerun your app `react-native run-ios` (rebuild native code)
and follow documentation ;)
