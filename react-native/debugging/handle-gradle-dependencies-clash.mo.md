# [MO] Handle version conflicts between Gradle dependencies

## Owner: [Louis Zawadzki](https://github.com/louiszawadzki)

## Prerequisites:

You have 2 dependencies that depend on different versions of the same package, so your Android build will fail with an error like:

```
com.android.dex.DexException: Multiple dex files define google/android/play-services/iid/R$anim;
```

If you're having an issue with Google Maps and Firebase you can have a look at [this article](https://medium.com/@suchydan/how-to-solve-google-play-services-version-collision-in-gradle-dependencies-ef086ae5c75f).

## Steps:

### 1. Find out which dependencies is causing the issue *(~2min)*

First, you need to figure out which package is causing the dependency issue.

Versions conflicts break your build when one method is present in one version and not in another.

**N.B.**: You can potentially have versions conflicts without any issue. Similarly your build can pass but you can still have issues if the logic inside a function has been changed.

Look at your error to know exactly which package is causing the issue (in the previous example it's probably `com.google.android.gms:play-services-iid`)

Then you must find out which version should be set.

To do so, run `cd android && ./gradlew app:dependencies && cd ..`.
This will print out your tree of dependencies.

In there, you must look for two instances of the dependency but with different versions.
For example if it returns:

```
_debugCompile - ## Internal use, do not manually configure ##
+--- project :react-native-maps
|    +--- com.google.android.gms:play-services-base:11.1.6
|    \--- com.google.android.gms:play-services-basement:11.1.6
+--- com.salesforce.marketingcloud:marketingcloudsdk:5.3.+ -> 5.3.1
|    +--- com.google.android.gms:play-services-gcm:11.0.1 -> 11.1.6
|    |    \--- com.google.android.gms:play-services-iid:11.0.1 -> 11.1.6
|    |         +--- com.google.android.gms:play-services-base:11.0.1 -> 11.1.6 (*)
|    |         \--- com.google.android.gms:play-services-basement:11.0.1 -> 11.1.6 (*)
```

A quick note on how to read this tree:

- `(*)` indicates that this lib is already installed higher in the tree
- `->` indicates that a different version of the library was installed

You can see here for example that `com.google.android.gms:play-services-base` version is 11.1.6 for `react-native-maps` and version 11.0.1 for `com.salesforce.marketingcloud:marketingcloudsdk`, therefore forcing `com.google.android.gms:play-services-iid` to be at version 11.1.6.


### 2. Force dependency to use a specific version

If the highest version of the dependency does not work, your next guess has to be the lowest one required by your dependencies.

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


> **Check:** your dependency tree should look like this:

```
_debugCompile - ## Internal use, do not manually configure ##
+--- project :react-native-maps
+--- com.salesforce.marketingcloud:marketingcloudsdk:5.3.+ -> 5.3.1
|    +--- com.google.android.gms:play-services-gcm:11.0.1
|    |    \--- com.google.android.gms:play-services-iid:11.0.1
|    |         +--- com.google.android.gms:play-services-base:11.0.1 (*)
|    |         \--- com.google.android.gms:play-services-basement:11.0.1 (*)
+--- com.google.android.gms:play-services-maps:11.0.1
|    +--- com.google.android.gms:play-services-base:11.0.1 (*)
|    \--- com.google.android.gms:play-services-basement:11.0.1 (*)
+--- com.google.android.gms:play-services-base:11.0.1 (*)
```

Note that now `com.google.android.gms:play-services-base`'s version is 11.0.1

> **Check:** when you launch your build it either passes or error with a different error


### 3. Repeat if you have a different error

It's possible that the lib you've downgraded relies on a version of another lib that conflicts with another dependency so you will have to repeat this with this new dependency until your build passes :)

It's also possible that the lowest version does not have a method required by the highest version.
In this case you can try a version between the two that works.
It's possible that there is no version that works.
