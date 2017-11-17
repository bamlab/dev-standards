# [Standard] Stable and up-to-date dependencies

## Owner: [Xavier Lefèvre](https://github.com/xavierlefevre)

## Description
- The project code dependencies such as NPM packages need to be very regularly updated, the team should check once per sprint.

## Impact
- An old dependency, can become deprecated and not adapt well with new operating systems, browers, development tools, etc.

## Checks
*TBD*

## Bad Examples

### redacted project
- Problem: Cordova has not been updated for several months on the project and one day a developer could not launch the app on an iOS emulator because his new Xcode version had an emulator list descreprency not handled by this old Cordova version, but handled by the new one.
- Loss: 1h30 of debugging + 1h30 of problem solving

## Good Examples
*TBD*

## Upgrading React Native

React Native is very probably the dependency you'll have to upgrade the more often so we felt it was worth dedicating a whole section to it.

### How to

First of all, if you are late by several versions do them one at a time.
Upgrading several version at a time (like from 0.42 to 0.46) can create a lot of complication, because React Native changes many javascript and native dependencies that also impact your code and its structure.
If you do one version at a time, you are sure to be able to more quickly give a working version with a slightly newer version (like from 0.42 to 0.43, etc.) that you tested on both Android and iOS.

Before upgrading, check that you project dependencies are compatible with your aimed version of React Native, like for Codepush, that always pushes a new version, for new RN versions.

To upgrade a version follow [the official documentation](https://facebook.github.io/react-native/docs/upgrading.html) on how to use `react-native-git-upgrade`.

Once you've upgraded React Native don't forget to update your dependencies - for example some might fail with the newest versions of React or others like CodePush are only working with specific versions of React Native.

If this is taking too long you can create a new React Native project from scratch with `react-native init` and import and re-install all your javascript and native parts (CocoaPods, linking, etc.).

There can also be cache issues (with yarn or gradle for instance) so if your project doesn't take long to be cloned you can clone a new instance of your project if you're stuck.


### Examples

#### 0.47 to 0.48

- Cinema project - using `react-native-git-upgrade`
  - Version upgrade: dea17b1add06f3984319792a7f667af162eda9f2 - AlexandreM
  - Unit tests fix: 889c07ff747925da7917a35b97bebcc0a86d2467 - LouisZ
  - Flow fix: ab53a4698300159cea5962e4d1e36b85ce67ed91 - NicolasD
