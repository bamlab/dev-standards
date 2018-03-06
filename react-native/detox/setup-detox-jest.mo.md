# [MO] Set up Detox with Jest *(~30 mins)*

## Owner: [Alban Depretz](https://github.com/chdeps)

## Prerequisites

Running Detox (on iOS) requires the following:

* Mac with macOS (>= macOS El Capitan 10.11)
* Xcode 8.3+ with Xcode command line tools
* A working [React Native](https://facebook.github.io/react-native/docs/getting-started.html) app
* A Javascript test Runner installed (Jest in our example. React Native works also with Mocha)
* Node 7.6.0 or above for native async-await support

## Step 1: Install dependencies *(~5mins)*

Go to detox getting started [documentation] (https://github.com/wix/detox/blob/master/docs/Introduction.GettingStarted.md) for more details.

### 1. Install [appleSimUtils](https://github.com/wix/AppleSimulatorUtils)

Collection of utils to communicate with the simulator

```sh
brew tap wix/brew
brew install applesimutils
```

### 2. Install Detox command line tools (detox-cli)

  ```sh
  npm install -g detox-cli
  ```
  
> TIP: `detox -h` to output the list of available commands

## Step 2: Add Detox to your project *(~5mins)*

### 1. Add Detox to your project

```sh
npm install detox --save-dev
```

#### 2. Add Detox config to package.json

The basic configuration for Detox should be in your `package.json` file under the `detox` property where you can replace YOURAPP with your app name:

```json
"detox": {
  "configurations": {
    "ios.sim.debug": {
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/YOURAPP.app",
      "build": "xcodebuild -project ios/YOURAPP.xcodeproj -scheme YOURAPP -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
      "type": "ios.simulator",
      "name": "iPhone 7"
    }
  }
}
```

For iOS apps in a workspace (eg: CocoaPods) use `-workspace ios/example.xcworkspace` instead of `-project`.

Also make sure the simulator model specified under the key `"name"` (`iPhone 7` above) is actually available on your machine (it was installed by Xcode). Check this by typing `xcrun simctl list` in terminal to display all available simulators.

> TIP: To test a release version, replace 'Debug' with 'Release' in the binaryPath and build properties. 


## Step 3: Write your 1st test (Jest only) *(~10mins)*

### 1. Configure Detox to run on Jest

* Create a folder e2e at the root of your project
* Add a jest config file `e2e/config.json` :

```json
{
  "setupTestFrameworkScriptFile" : "./init.js"
}
```

* In your `package.json` detox config add a reference to your config file:

```json
  "detox": {
    "test-runner": "jest",
    "runner-config": "e2e/config.json",
    ...
   }
```

* Create an init file `e2e/init.js`:

```js
import detox from 'detox';
import packageFile from '../package.json';
const detoxConfig = packageFile.detox;

jest.setTimeout(120000);

beforeAll(async () => {
  await detox.init(detoxConfig, { launchApp: false });
  await device.launchApp();
});

afterAll(async () => {
  await detox.cleanup();
});

beforeEach(async () => {
  await device.reloadReactNative();
});
```

### 2. Write your test

* Add Regexp to your test files in the config file `e2e/config.json` :

```json
{
  ...
  "testMatch": ["**/__tests__/**/*.js?(x)", "**/?(*.)(e2e).js?(x)"]
}
```

> NOTE: Here I'm matching all files that end in `.e2e.js` 

* Create your 1st test file `e2e/test.e2e.js` :)

```js
describe('Test 1st screen', () => {
  it('should find the title on the 1st screen', async () => {
    await expect(element(by.id('title'))).toExist();
  });
});
```

## Step 4: Run tests *(~5mins)*

* Add to your `package.json`:

```json
"scripts": {
  "test:e2e:debug": "detox test -c ios.sim.debug",
  "test:e2e:debug:build": "detox build -c ios.sim.debug"
  ...
}
```

* Build & Test your app:

```sh
npm run test:e2e:debug:build
npm run test:e2e:debug
```

## Step 5: Add compatibilty with eslint (Optional) *(~5mins)*

### 1. Add eslint plugin eslint-plugin-detox

* Install plugin:

```sh
npm install eslint-plugin-detox --save-dev
```

* Add plugin to your `.eslintrc`:

```json
{
    "plugins": [
        "detox"
    ]
}
```

* Add line at the top of every detox file:

```js
/* eslint-env detox/detox */
```



