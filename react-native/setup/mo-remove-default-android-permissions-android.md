# \[MO\] Remove Default Android Permissions Android

When you create a React Native applications some Android permissions will be asked to the user, even if your app doesn't do anything.

Those permissions are:

* Read phone state
* Read external storage
* Write external storage
* Draw over other apps

As you actually don't need them from the start of your project, you can remove them from the beginning not to scare your user.

N.B.: There's a related [open issue](https://github.com/facebook/react-native/issues/5886) on React Native's Github repository.

## Owner: [Louis Zawadzki](https://github.com/louiszawadzki)

## Prerequisites

* [ ] A React Native app

## Steps

1. Understand what the permissions are for

By knowing why you need the permissions you'll know when you might have to add them back and why they're unnecessary to most projects.

### Read phone state

According to the official [Android docs](https://developer.android.com/reference/android/Manifest.permission.html):

> Allows read only access to phone state, including the phone number of the device, current cellular network information, the status of any ongoing calls, and a list of any PhoneAccounts registered on the device.

So you won't need it from scratch.

### Read external storage & Write external storage

According to [a comment on the issue](https://github.com/facebook/react-native/issues/5886#issuecomment-200837654):

> It's not for `AsyncStorage` as it uses a SQLite DB under the hood, which doesn't require any permission.  
> Even if it used another method of storage like `SharedPreferences` or the internal storage to store files, it shouldn't require any permission \([See Storage Options](https://developer.android.com/guide/topics/data/data-storage.html)\).

So unless you want to explicitely access the external storage - which isn't used by default - you won't need it.

### Draw over other apps

> Allows an app to create windows using the type TYPE\_APPLICATION\_OVERLAY, shown on top of all other apps.

Basically this permission is needed in debug mode to show the error redbox error.

1. Remove the permissions

You need to be able to toggle the `SYSTEM_ALERT_WINDOW` permission \(draw over other apps\) so that it is used in debug but not in release.

To do so, first in your `android/app/build.gradle`

```groovy
buildTypes {
     debug {
         manifestPlaceholders = [excludeSystemAlertWindowPermission: "false"]
     }
     release {
         manifestPlaceholders = [excludeSystemAlertWindowPermission: "true"]
     }
}
```

Then in your `android/app/src/main/AndroidManifest.xml`:

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
+    xmlns:tools="http://schemas.android.com/tools"
     package="com.applilabchatbot"
     android:versionCode="1"
     android:versionName="1.0">

     <uses-permission android:name="android.permission.INTERNET" />
     <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
+    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" tools:remove="${excludeSystemAlertWindowPermission}"/>
```

And then you can remove all the other permissions:

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
     xmlns:tools="http://schemas.android.com/tools"
     package="com.applilabchatbot"
     android:versionCode="1"
     android:versionName="1.0">

     <uses-permission android:name="android.permission.INTERNET" />
     <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
     <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" tools:remove="${excludeSystemAlertWindowPermission}"/>
+    <uses-permission tools:node="remove" android:name="android.permission.READ_PHONE_STATE" />
+    <uses-permission tools:node="remove" android:name="android.permission.READ_EXTERNAL_STORAGE" />
+    <uses-permission tools:node="remove" android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Troubleshooting

If you've never built your Android app before \(e.g. newcomer or after destroying your project\) you'll get errors like

```text
[15:56:40]: ▸ Element uses-permission#android.permission.SYSTEM_ALERT_WINDOW at AndroidManifest.xml:12:5-130 duplicated with element declared at AndroidManifest.xml:8:5-77
[15:56:40]: ▸ /Users/louiszawadzki/soge/deploy/android/app/src/main/AndroidManifest.xml:9:5-95 Warning:
[15:56:40]: ▸ uses-permission#android.permission.READ_PHONE_STATE was tagged at AndroidManifest.xml:9 to remove other declarations but no other declaration present
[15:56:40]: ▸ /Users/louiszawadzki/soge/deploy/android/app/src/main/AndroidManifest.xml:10:5-100 Warning:
[15:56:40]: ▸ uses-permission#android.permission.READ_EXTERNAL_STORAGE was tagged at AndroidManifest.xml:10 to remove other declarations but no other declaration present
[15:56:40]: ▸ /Users/louiszawadzki/soge/deploy/android/app/src/main/AndroidManifest.xml:11:5-101 Warning:
[15:56:40]: ▸ uses-permission#android.permission.WRITE_EXTERNAL_STORAGE was tagged at AndroidManifest.xml:11 to remove other declarations but no other declaration present
[15:56:40]: ▸ /Users/louiszawadzki/soge/deploy/android/app/src/main/AndroidManifest.xml:12:5-130 Warning:
[15:56:40]: ▸ uses-permission#android.permission.SYSTEM_ALERT_WINDOW@tools:true was tagged at AndroidManifest.xml:12 to remove other declarations but no other declaration present
```

To fix it you have to remove the lines you've added in the Manifest i.e.:

```markup
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" tools:remove="${excludeSystemAlertWindowPermission}"/>
<uses-permission tools:node="remove" android:name="android.permission.READ_PHONE_STATE" />
<uses-permission tools:node="remove" android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission tools:node="remove" android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

Then build your project once and add the lines back.

