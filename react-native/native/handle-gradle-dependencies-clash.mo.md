# Handle gradle dependencies versions clashes

If 2 of your dependencies depend on different versions of the same package, your application won't build and error with an error like:

```
com.android.dex.DexException: Multiple dex files define Landroid/support/v7/appcompat/R$anim;
```

If you're having an issue with Google Maps and Firebase you can have a look at [this article](https://medium.com/@suchydan/how-to-solve-google-play-services-version-collision-in-gradle-dependencies-ef086ae5c75f).

Here's the guide to solve this kind of issue for a general case.

## 1. Know which dependencies is causing the issue

First, you need to figure out which package is causing the dependency issue.

To do so, run `cd android && ./gradlew app:dependencies && cd ..`.
This will print out your tree of dependencies.

In there, you must look for two instances of the same dependency but with different versions.
For example if it returns:

```
_debugCompile - ## Internal use, do not manually configure ##
+--- project :react-native-maps
|    +--- com.google.android.gms:play-services-base:11.1.6
|    \--- com.google.android.gms:play-services-basement:11.1.6
+--- com.salesforce.marketingcloud:marketingcloudsdk:5.3.+ -> 5.3.1
|    +--- com.google.android.gms:play-services-gcm:11.0.1 -> 11.1.6
|    |    +--- com.google.android.gms:play-services-base:11.0.1 -> 11.1.6
|    |    |    +--- com.google.android.gms:play-services-basement:11.0.1 -> 11.1.6
|    |    |    |    \--- com.android.support:support-v4:25.2.0 -> 26.0.0 (*)
|    |    |    \--- com.google.android.gms:play-services-tasks:11.0.1 -> 11.1.6
|    |    |         \--- com.google.android.gms:play-services-basement:11.0.1 -> 11.1.6 (*)
|    |    +--- com.google.android.gms:play-services-basement:11.0.1 -> 11.1.6 (*)
|    |    \--- com.google.android.gms:play-services-iid:11.0.1 -> 11.1.6
|    |         +--- com.google.android.gms:play-services-base:11.0.1 -> 11.1.6 (*)
|    |         \--- com.google.android.gms:play-services-basement:11.0.1 -> 11.1.6 (*)
|    +--- com.android.support:support-v4:26.0.0 (*)
|    \--- com.android.support:support-annotations:26.0.0
```

A quick note on how to read this tree:

- `(*)` indicates that this lib is already installed higher in the tree
- `->` indicates that a different version of the library was installed

You can see here that `com.google.android.gms:play-services-base` version is 11.1.6 for `react-native-maps` and version 11.0.1 for `com.salesforce.marketingcloud:marketingcloudsdk`.

## 2. Force dependency to use a specific version

So now in your `android/app/build.gradle` you need to:

- Tell `react-native-maps` not to compile `com.google.android.gms:play-services-base`:
```
compile(project(':react-native-maps')){
    exclude group: 'com.google.android.gms', module: 'play-services-base'
}
```

- Tell `com.salesforce.marketingcloud:marketingcloudsdk` not to compile `com.google.android.gms:play-services-base`:
```
compile('com.salesforce.marketingcloud:marketingcloudsdk:5.3.+') {
    exclude group: 'com.google.android.gms', module: 'play-services-base'
}
```

- Force the version of `com.google.android.gms:play-services-base` to be the lowest one, i.e. 11.0.1:
```
compile ("com.google.android.gms:play-services-base:11.0.1") {
  force = true;
}
```

- **Run `cd android && ./gradlew clean && cd ..`** to update the dependencies

Then your tree will look like this:

```
_debugCompile - ## Internal use, do not manually configure ##
+--- project :react-native-maps
+--- com.salesforce.marketingcloud:marketingcloudsdk:5.3.+ -> 5.3.1
|    +--- com.google.android.gms:play-services-gcm:11.0.1
|    |    +--- com.google.android.gms:play-services-base:11.0.1
|    |    |    +--- com.google.android.gms:play-services-basement:11.0.1
|    |    |    |    \--- com.android.support:support-v4:25.2.0 -> 26.0.0 (*)
|    |    |    \--- com.google.android.gms:play-services-tasks:11.0.1
|    |    |         \--- com.google.android.gms:play-services-basement:11.0.1 (*)
|    |    +--- com.google.android.gms:play-services-basement:11.0.1 (*)
|    |    \--- com.google.android.gms:play-services-iid:11.0.1
|    |         +--- com.google.android.gms:play-services-base:11.0.1 (*)
|    |         \--- com.google.android.gms:play-services-basement:11.0.1 (*)
|    +--- com.android.support:support-v4:26.0.0 (*)
|    \--- com.android.support:support-annotations:26.0.0
+--- com.google.android.gms:play-services-maps:11.0.1
|    +--- com.google.android.gms:play-services-base:11.0.1 (*)
|    \--- com.google.android.gms:play-services-basement:11.0.1 (*)
+--- com.google.android.gms:play-services-base:11.0.1 (*)
```


Once you've done that you might realise that `com.google.android.gms:play-services-base:11.0.1` relies on another version of another lib that clashes with another lib so you have to repeat this until your build passes :)
