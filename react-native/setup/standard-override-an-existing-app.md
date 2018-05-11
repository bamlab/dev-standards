# \[Standard\] Override an existing app

## Owner: [Alexandre Moureaux](https://github.com/almouro)

## Context

You're starting a version 2 of an existing app from scratch.  
Replacing the existing app in the stores might be done later in the project, but there are still things to check beforehand:

## Checks

### - \[ \] Check the `targetSdkVersion` of the existing version

You cannot downgrade the `targetSdkVersion`, so your new project needs to have at least the same `targetSdkVersion` as the old one.

:warning: **N.B.:** By default, a React Native project has `22` as its `targetSdkVersion`.

`targetSdkVersion` 23 is for Android 6+ where [permissions are now asked at runtime](http://developer.android.com/training/permissions/requesting.html) and not at installation.

#### Good examples

So if the app you're replacing has set 23 or above as the `targetSdkVersion`, your new app needs to have at least that, and should implement permissions at runtime.

You can use [react-native-permissions](https://github.com/yonahforst/react-native-permissions) to that effect.

#### Bad Examples \(Real story\)

On a project, I had not checked that. Last day on the project, we finally were overriding the existing app,but upon publishing in the Play Store, we couldn't because we were downgrading the `targetSdkVersion`.

We had to spend more time on the project to use `react-native-permissions` and ask for permissions at runtime. This time would have been saved, had we checked this beforehand.

### - \[ \] Use the existing app keystore

Use the previous app's keystore for production builds, even if you're not replacing the app just yet.

#### Bad examples \(Real story\)

On a project, I had not used the production keystore, before the last day. The previous app's keystore had been created with an old java version and we weren't able to sign the app with it.

We had to spend more time on the project to solve this issue \(by updating Java\).

