# [MO] Add new icons to the application

## Owner: [Amaury Liet](http://github.com/AmauryLiet/)

## Prerequisites

- A running React Native app, preferably started with the generator


## Intro

To add new icons to the app, you need to update 3 files in the project.

These 3 files are in the `icomoon.zip` archive: but if you only have the `*.svg` file of the icon, you need to generate the icomoon archive first.

## Prerequisites

- Have the icons available (either in an `icomoon` file or a `svg` file)


## Steps
 
### 1. [If necessary] Generate to `icomoon.zip` file:

 1. Go to [Icomoon.io](https://icomoon.io/app/#/select)
 
 2. Click on `+ Import icons`
 
 3. Import the `selection.json` file of the icons currently in the app, located in `src/components/Icon/selection.json`
 
 4. Add icons on the set you just imported by clicking on the burger (on the right) then `Import to set`
 
 5. If wanted, rename the icon by passing in `edit` mode (click on the pencil on top of the screen) then click on the icons to rename
 
 6. Select the icons you want to export (by default select all of them)
 
 7. On the bottom of the screen, click `Generate font` then `Download`
 

## 2. Add the icons to the application

 1. Open the `icomoon.zip` file
 
 2. Overwrite the following files:
  - `android/app/src/main/assets/fonts/icomoon.ttf`
  - `src/components/Icon/selection.json`
  - `resources/icons/icomoon.ttf`


> :warning: **If you are using code-push, don't forget to hard deploy**
>
> Deploying with CodePush will **not** update the icons of the app

