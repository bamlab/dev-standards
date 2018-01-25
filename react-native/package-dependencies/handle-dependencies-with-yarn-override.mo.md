# [MO] Handle dependencies with Yarn override

## Owner: [Justine Mignot](https://github.com/justinemignot)

> **Note**: Please create an [issue](https://github.com/bamlab/dev-standards/issues/new) or even a Pull Request with your feedback, typo correction.

## Context

During this standard, we will go through how to handle versions dependencies of different packages to a same package.

If some package doesn't use same versions of a package, depending of the order it will be called, it won't be the same version of package used.
We want to ensure that the same version is used everywhere in the app.

Normally this would require to manually edit `yarn.lock` file, but it is really bad because this file is deleted each time you install a new package or run a yarn command.

By chance, yarn has a feature override, which allows us to fix those versions dependencies.

## Prerequisites

* Have a react native app installed
* Install `moment-timezone` (version "0.5.13")
* Install `react-native-datepicker` (version "1.6.0")

## Steps

### Figure out a problem

* Identify the case:
  * you just installed a new package (I just installed `react-native-datepicker`) and there is a regression in the app (in my case `moment.locale()` was not working anymore)
  * you're trying to set a parameter of a package (e.g. the default locale of `moment`) but it's not taken into account by another package
* Then open `yarn.lock`:
  * look for your newly installed package
     \* look for this package dependencies:

```
react-native-datepicker@^1.6.0:
react-native-datepicker@^1.6.0:
  version "1.6.0"
  resolved "https://registry.yarnpkg.com/react-native-datepicker/-/react-native-datepicker-1.6.0.tgz#3a40dc9b112023c49d60ba2a0789d440b7e3d97c"
  dependencies:
    moment "2.x.x"
```

* try to find other packages which depends on another version of `moment`
  * search for `moment` in `yarn.lock`
  * if another package depends on it but in another version, several lines for `moment` will appear:

```
"moment@2.x.x":
  version "2.20.1"
  resolved "https://registry.yarnpkg.com/moment/-/moment-2.20.1.tgz#d6eb1a46cbcc14a2b2f9434112c1ff8907f313fd"

"moment@>= 2.9.0":
  version "2.18.1"
  resolved "https://registry.yarnpkg.com/moment/-/moment-2.18.1.tgz#c36193dd3ce1c2eed2adb7c802dbbc77a81b1c0f"

moment@^2.19.0:
  version "2.19.1"
  resolved "https://registry.yarnpkg.com/moment/-/moment-2.19.1.tgz#56da1a2d1cbf01d38b7e1afc31c10bcfa1929167"
```

* find which other package it is by searching for `moment` in dependencies section of packages :

```
moment-timezone@^0.5.13:
  version "0.5.14"
  resolved "https://registry.yarnpkg.com/moment-timezone/-/moment-timezone-0.5.14.tgz#4eb38ff9538b80108ba467a458f3ed4268ccfcb1"
  dependencies:
    moment ">= 2.9.0"
```

### Solve the problem

* In `package.json` file, add a section 'resolutions' at the same level as the 'dependencies' section.
* Specify to which version of `moment` depend the two packages, choose same version number for both:

```json
"dependencies": {
  ...
},
"resolutions": {
  "react-native-datepicker/moment": "2.19.1",
  "moment-timezone/moment": "2.19.1"
},
```

* If the package is a dependency of your app, you'll need to set its version in the `package.json`:

```json
"dependencies": {
  "moment": "2.19.1"
},
"resolutions": {
  "react-native-datepicker/moment": "2.19.1",
  "moment-timezone/moment": "2.19.1"
}
```

* Run `yarn install`.

{% hint style='success' %} **CHECK 1**

Check your yarn.lock file, `moment` should appears in only one line:

```txt
moment@2.19.1, moment@2.x.x, "moment@>= 2.9.0", moment@^2.19.0:
  version "2.19.1"
  resolved "https://registry.yarnpkg.com/moment/-/moment-2.19.1.tgz#56da1a2d1cbf01d38b7e1afc31c10bcfa1929167"
```

which means that every package depending on `moment` is resolved to a same version (here 2.19.1).

{% endhint %}

{% hint style='success' %} **CHECK 2**

Your app should works correctly now, regression should be solved. `moment` dependencies are solved.

{% endhint %}

## Troubleshooting

* Yarn documentation : https://yarnpkg.com/en/docs/selective-version-resolutions
