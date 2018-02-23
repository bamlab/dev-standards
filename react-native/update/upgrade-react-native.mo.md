# [MO] Upgrade react native

## Owner: [Tycho Tatitscheff](https://github.com/tychota)

## Prerequisites

- Be sure that all the react native warnings have been fixed by looking at the native logs in the React Native Debugger console.
- Have [react-native-git-upgrade](https://github.com/facebook/react-native/tree/master/react-native-git-upgrade) installed

## Warning

If you are late by several versions do them one at a time. Upgrading several version at a time (like from 0.42 to 0.46) can create a lot of complication, because React Native changes many javascript and native dependencies that also impact your code and its structure. If you do one version at a time, you are sure to be able to more quickly give a working version with a slightly newer version (like from 0.42 to 0.43, etc.) that you tested on both Android and iOS.


## Steps (~12min)

### Create a new branch (~1 min)

- Stash the existing modifications by running `git stash`
- Create a new branch by running `git checkout -b upgrade/react-native-0-XX-0`

> **Checks**: when running `git status`, you have no untracked or no modified files

### Look at the breaking changes of your new release

- Look at your actual version of React Native

> Lets say it is `0.45.1`

- Find the changelog here: https://github.com/facebook/react-native/releases/tag/v0.X.0 where X is the minor of your react native version, note down the major breaking changes you'll have to consider later.

> **Check**: I have a clear list of deprecated items to check.

### Launch the automatic upgrade (~10 mins)

- Look at this table: https://github.com/ncuillery/rn-diff

> You want to upgrade one version at the time of react native, but include the patches that are bug fixes for the new version
  - In this case, you want to go to `0.46.4` and not `0.46.0` since for the version `0.46`, react-native releases 4 bug fixes that you would have to fix yourself later if you had stay to `0.46.0`

- Run `react-native-git-upgrade 0.46.4`

- Fix the potential conflict: see https://facebook.github.io/react-native/docs/upgrading.html#4-resolve-the-conflicts

- If other modules or libraries have to be updated for compatibility reasons, update them following the upgrade native module steps.

- Once the React Native upgrade is completed, follow the tests steps (simulator and device) to perform one upgrade at a time.

### Upgrade native modules (~10 mins per native module)

> Note: React Native may cause major breaking changes:
-  [v0.40.0](https://github.com/facebook/react-native/releases/v0.40.0)

- If react native cause a breaking changes in native side (you would see that in the changelog):

  - Open your `android/settings.gradle` and list all module imported
  - Compare this list to your `podfile` if you use cocoapods, and the linked framework (in Xcode, the library directory that contains both react-native and react-native plugins framework) @TODO @tycho insert photo  
  - For each package found, look at the github repo to see if it has been updated, or has pending issues that may jeopardize the upgrade process
  - Upgrade the module in `package.json` and run `yarn`.

> There are also some modules that always require an update for a RN upgrade (example: `react-native-svg`)

> **Check**: you can now build android and iOS.

### Upgrade your own code to fit react new syntax (~10 mins)

- Identify the breaking change by running the app and googling for the issues
- Run [`react-codemod`](https://github.com/reactjs/react-codemod) to fix all the issues on the codebase.
  - [Example props-types](https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types): `jscodeshift -t react-codemod/transforms/ReactNative-View-propTypes.js myproject/src`

### Upgrade javascript modules

> **Note**: For javascript, the overall process is similar than for native module: try to run the app and upgrade all the modules that fail.

#### React-based changes (~10 mins per module)

> **Example**: PropTypes gets moved to another package.

- Try to see if the failing module has an existing fix (then upgrade)
- Otherwise, fork it, and apply the same principle you did on your code to your newly created package.

#### Packager incompatibilities

> **Example**: `moment.js`

- Try to look for github issues on Google
- Use another better architected package (see [this amazing package](https://github.com/date-fns/date-fns)) or create your own.

### Fix flow

// @todo: Tycho

### Fix tests

// @todo: Tycho

### Deploy and test on device

- Once you have tested that everything is working fine on both iOS and Android, deploy on device (do not merge your branch)
- Run the command to hard deploy from your branch to hockeyapp
- Test that everything is working fine on devices
- If everything is correct, merge and soft deploy

## Troubleshooting


If this is taking too long you can create a new React Native project from scratch with `react-native init` and import and re-install all your javascript and native parts (CocoaPods, linking, etc.).

There can also be cache issues (with yarn or gradle for instance) so if your project doesn't take long to be cloned you can clone a new instance of your project if you're stuck.
