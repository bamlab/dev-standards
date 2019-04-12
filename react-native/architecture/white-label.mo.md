# [MO] How to implement white-label on a React Native app _(~<Time> min)_

## Owner: [Maxime Sraïki](https://github.com/sraikimaxime)

## Prerequisites

- Generate a new React Native Project using rn-generator-toolbox
- Have all of your styles (at least the colors) in a centralized appstyle.js file
- Have your colors named in an agnostic way (primary > myClientBlue)
- Use a centralized translations file with all the labels of your application
- Have a centralized folder for your assets named in an agnostic way

## Steps _(~<Time> min)_

### Step 1: Create the white-label folder _(40 sec)_

- Create a `white-label` folder at the root of your project _(10 sec)_
- Create `bin` subfolder in `white-label`, it will host all of your white-label scripts _(10 sec)_
- Create `lib` subfolder in `bin`, it will host the logic called by your scripts _(10 sec)_
- Create `config` subfolder in `white-label`, it will host all of your brand specific files, create a folder for all your brands in this folder _(10 sec)_

### Step 2: Create your first script to make appStyle brand specific _(15 min)_

- Go in `white-label/bin/lib` and create a `configs.js` file like this:

```js
const path = require('path');
const fs = require('fs');

const configDir = path.join(__dirname, '../../config');

function getConfigList() {
  const files = fs.readdirSync(configDir);
  return files.map(file => file.replace('.js', ''));
}

module.exports = {
  configDir,
  getConfigList
};
```

it will allow you to list the different available configs

- Create two new files `bin/appStyle.js` and `bin/lib/appStyle.js` and build them as they are built here:

  - ![bin/appStyle.js](/assets/white-label-bin/appStyle.js)
  - ![bin/lib/appStyle.js](/assets/white-label-bin/lib/appStyle.js)

- Check what happens in these files, they offer you two method, save and restore:

  - save will take the files in your `/src` folder and copy them to `white-label/config/{{yourAwesomeBrand}}`
  - restore will take the files in your `white-label/config/{{yourAwesomeBrand}}` folder and copy them to `/src`

- Add a script to your package.json that will allow you to call your brand new white-label script:

```json
"save:appStyle:{{YourAwesomeBrand}}": "./white-label/bin/appStyle.js save {{YourAwesomeBrand}}"
```

### Step 3: Test your script _(5 min)_

- Test the save by running

```sh
yarn save:appStyle:{{YourAwesomeBrand}}
```

You should see a new file appStyle.js in your `white-label/config/{{YourAwesomeBrand}}` folder that is identic to the one you had in `/src`

- Test the restore by modifying the `white-label/config/{{}YourAwesomeBrand}}/appStyle.js` and by running

```sh
yarn restore:appStyle:{{YourAwesomeBrand}}
```

Your should see the `/src/appStyle.js` modified the same way you modified the one in your brand specific folder.

### Step 4: Dev

Now to develop on a specific brand you should always follow this workflow:

- Run

```sh
yarn restore:appStyle:{{YourAwesomeBrand}}
```

- Do a commit to have a clean git status

```sh
git add .
git commit -m "Restoring {{YourAwesomeBrand}}"
```

- Code your feature

- Save your newly modified brand specific configuration by running:

```sh
yarn save:appStyle:{{YourAwesomeBrand}}
```

- Do a commit to save your changes

- Restore the default configuration

```sh
yarn restore:appStyle:{{YourAwesomeDefaultBrand}}
```

- Do a commit

```sh
git add .
git commit -m "Restoring {{YourAwesomeDefaultBrand}}"
```
