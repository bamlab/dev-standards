# [MO] Patch React Native for Android (~60min)

## Owner: [Louis Zawadzki](https://github.com/louiszawadzki)

## Prerequisites:

- A React Native application

## Steps:

### 1. Start downloading the Android NDK (2 minutes)

- Download the NDK [here](https://facebook.github.io/react-native/docs/building-from-source#download-links-for-android-ndk) (it can take 20 to 30 minutes)
- Once the download has started you can move on to the next steps

### 2. Apply your patch at deployment time (15 minutes)

- Copy the files that contain the fixes inside a `fix-rn` directory at the root of the project
- Create a `scripts/fix-rn.sh` file at the root of your project, looking like:

```bash
#!/bin/bash

cp fix-rn/rn-file.java node_modules/react-native/ReactAndroid/path/to/the/faulty/file.java
cp fix-rn/rn-file2.java node_modules/react-native/ReactAndroid/path/to/the/faulty/file2.java
```

for example:

```bash
#!/bin/bash

cp fix-rn/UIImplementation.java node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/uimanager/UIImplementation.java
```

- Make the file executable by running `$ chmod +x scripts/fix-rn.sh`

> **Checks:**
>
> - when you run `$ scripts/fix-rn.sh` your files have been changed in your node modules

- Add `scripts/fix-rn.sh` in the `postInstall` of your `package.json`
- Make sure your run `yarn` after you've pulled the latest changes in your deployment script

> **Checks:**
>
> - when you run your deploy script your files have been changed in your node modules

### 3. Configure your app to take the patched version of React Native (5 minutes)

(This part comes from the [official React Native documentation](https://facebook.github.io/react-native/docs/android-building-from-source.html))

#### Adding gradle dependencies

Add gradle-download-task as dependency in `android/build.gradle`:

```groovy
    dependencies {
        classpath 'com.android.tools.build:gradle:1.3.1'
        classpath 'de.undercouch:gradle-download-task:3.1.2'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
```

#### Adding the :ReactAndroid project

Add the :ReactAndroid project in `android/settings.gradle`:

```groovy
include ':ReactAndroid'

project(':ReactAndroid').projectDir = new File(
    rootProject.projectDir, '../node_modules/react-native/ReactAndroid')
```

Modify your `android/app/build.gradle` to use the :ReactAndroid project instead of the pre-compiled library, e.g. - replace `compile 'com.facebook.react:react-native:+'` with `compile project(':ReactAndroid')`:

```groovy
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:23.0.1'

    compile project(':ReactAndroid')

    ...
}
```

#### Making 3rd-party modules use your fork

If you use 3rd-party React Native modules, you need to override their dependencies so that they don't bundle the pre-compiled library.
Otherwise you'll get an error while compiling - `Error: more than one library with package name 'com.facebook.react'`.

You don't need to change the code of all your modules.
Modify your `android/app/build.gradle`, and add at the same level that `dependencies` and `android`:

```groovy
configurations.all {
    exclude group: 'com.facebook.react', module: 'react-native'
}
```

### 4. Finish NDK installation (5 minutes)

- Once the NDK has been downloaded unzip it under `/Users/your_unix_name/android-ndk/` (create `android-ndk` if necessary)
- Set `ANDROID_SDK` and `ANDROID_NDK` through you local shell (`.zshrc` or `.bashrc`), for example:

```bash
export ANDROID_SDK=/Users/your_unix_name/android-sdk-macosx
export ANDROID_NDK=/Users/your_unix_name/android-ndk/android-ndk-r10e
```

- Don't forget to run `source ~/.zshrc` (or .bashrc) to get the environment variables in your current shell session

> **Checks:**
>
> - when you run `react-native run-android` your app compiles and you can see that `:ReactAndroid` is built in the logs
