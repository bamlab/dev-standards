# [Standard] Stable and up-to-date dependencies

## Owner: [Xavier Lefèvre](https://github.com/xavierlefevre)

## Description
- The project code dependencies such as NPM packages need to be very regularly updated, the team should check once per sprint.

## Impact
- An old dependency, can become deprecated and not adapt well with new operating systems, browsers, development tools, etc.

## Checks
*TBD*

## Bad Examples

### redacted project
- Problem: Cordova has not been updated for several months on the project and one day a developer could not launch the app on an iOS emulator because his new Xcode version had an emulator list discrepancy not handled by this old Cordova version, but handled by the new one.
- Loss: 1h30 of debugging + 1h30 of problem solving

## Good Examples
*TBD*

## Upgrading React Native

React Native is very probably the dependency you'll have to upgrade the more often so we felt it was worth dedicating a [whole article](../../react-native/update/upgrade-react-native.mo.md) to it.
