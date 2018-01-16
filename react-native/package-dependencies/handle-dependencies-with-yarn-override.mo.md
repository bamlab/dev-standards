# [MO] Handle dependencies with Yarn override

## Owner: [Justine Mignot](https://github.com/justinemignot)

> **Note**: Please create an [issue](https://github.com/bamlab/dev-standards/issues/new) or even a Pull Request with your feedback, typo correction.

## Context

During this standard, we will go through how to handle versions dependencies of different packages to a same package.

If some package doesn't use same versions of a package, depending of the order it will be called, it won't be the same version of package used. We want to ensure that the same version is used everywhere in the app. Normally this would require to manually edit `yarn.lock` file, but by chance, yarn has a feature override, which allows us to fix those versions dependencies.

We will go through the example of project which already contains a package (`moment-timezone`) which depends of package `moment` and in which we want to add `react-native-datepicker` which also depends on `moment`.

## Prerequisites

* You have 2 dependencies (Y1 et Y2) that depend on different versions of the same package (X). You can check that in step 1.

## Steps

### Figure out a problem

* If one of the packages (package X) you are using in your app is not working anymore (no particular error message but for example, in my case dates in the app appear in English whereas it was in French before, and phone was set up in French), it can be because of package dependencies. In my case, `moment.locale()` was not working anymore.
* Check if you recently add a new package (Y2) (it happended after I added `react-native-datepicker` in the project).
* Check `yarn.lock` file of your project to see which packages depend on the package which is not working (`moment` in my case). In order to do so, search for the name of the package, and check if the name of the package (X) appears several times. It looked like that in my case : 
`moment@2.x.x:		 
   version "2.20.1"		
   resolved "https://registry.yarnpkg.com/moment/-/moment-2.20.1.tgz#d6eb1a46cbcc14a2b2f9434112c1ff8907f313fd"		
 		
 "moment@>= 2.9.0":		
   version "2.18.1"		
   resolved "https://registry.yarnpkg.com/moment/-/moment-2.18.1.tgz#c36193dd3ce1c2eed2adb7c802dbbc77a81b1c0f"		
 		
 moment@^2.19.0:
 version "2.19.1"
    resolved "https://registry.yarnpkg.com/moment/-/moment-2.19.1.tgz#56da1a2d1cbf01d38b7e1afc31c10bcfa1929167"
    `

(You can also check in `yarn.lock`, check under the new package name (Y2) in section `dependencies` if the package name X appears.)


### Solve the problem

* In the `package.json` file of your app, add a section 'resolutions' under 'dependencies' section for example. 
In this section you will specify which version of package X depend packages Y1 and Y2. And so you need to specify the same version number for all packages which depend on a same package. It should look like this : 
` "resolutions": {
     "Y1/X": "version-number",
     "Y2/X": "version-number",
     ...
   },
`
For example in my case, it looks like this : 
` "resolutions": {
     "react-native-datepicker/moment": "2.19.1",
     "moment-timezone/moment": "2.19.1"
   },
`

* Run `yarn install`.

> **CHECK 1**: Check your yarn.lock file, package X should appears in only one line. For example :
`moment@2.19.1, moment@2.x.x, "moment@>= 2.9.0", moment@^2.19.0:
   version "2.19.1"		
   resolved "https://registry.yarnpkg.com/moment/-/moment-2.19.1.tgz#56da1a2d1cbf01d38b7e1afc31c10bcfa1929167"
   `
   which means that every dependencie to package X (here `moment`) is resolved to a same version (here 2.19.1). 

> **CHECK 2**: Your app should works correctly now. Package X dependencies are solved. 


## Troubleshooting

- Yarn documentation : https://yarnpkg.com/en/docs/selective-version-resolutions
 

