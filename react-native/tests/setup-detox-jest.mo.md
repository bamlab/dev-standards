# [MO] Set up Detox with Jest and automate it on Bitrise *(~ 1h30)*

## Owner: [Alban Depretz](https://github.com/chdeps)

## Prerequisites

Running Detox (on iOS) requires the following:

* Mac with macOS (>= macOS El Capitan 10.11)
* Xcode 8.3+ with Xcode command line tools
* A working [React Native](https://facebook.github.io/react-native/docs/getting-started.html) app
* A Javascript test Runner installed (Jest in our example. Detox also works with Mocha)
* Node 7.6.0 or above for native async-await support

## Steps

### Step 1: Install dependencies *(~5mins)*

Go to detox getting started [documentation](https://github.com/wix/detox/blob/master/docs/Introduction.GettingStarted.md) for more details.

#### 1. Install [appleSimUtils](https://github.com/wix/AppleSimulatorUtils)

Collection of utils to communicate with the simulator

```sh
brew tap wix/brew
brew install applesimutils
```

#### 2. Install Detox command line tools (detox-cli)

  ```sh
  npm install -g detox-cli
  ```

> TIP: `detox -h` gives the list of available commands

### Step 2: Add Detox to your project *(~10mins)*

#### 1. Add Detox to your project

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


### Step 3: Write your 1st test *(~20mins)*

#### 1. Configure Detox to run on Jest

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

//Adapt the value. If it is too short your tests won't have time to run. If it's too long on the other hand, it will hang for too long before it fails.
//120000 is a good default value to start with
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

#### 2. Write your test

* Add a Regexp to your test files in the config file `e2e/config.json` :

```json
{
  ...
  "testMatch": ["**/__tests__/**/*.js?(x)", "**/?(*.)(e2e).js?(x)"]
}
```

> NOTE: Here I'm matching all files that end in `.e2e.js`

* Add a testID to your component.

> Custom component: Detox will only find components thanks to their testID if they directly come from react-native. Make sure your custom components transfer the testID prop to a **built-in** react-native component such as Text, TouchableOpacity, ...

```js
<Text testID="title">Your Title</Text>
```
* Create your 1st test file `e2e/test.e2e.js` to check that your title exists

```js
describe('Test 1st screen', () => {
  it('should find the title on the 1st screen', async () => {
    await expect(element(by.id('title'))).toExist();
  });
});
```

### Step 4: Run tests *(~10mins)*

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

### Step 5: Add compatibility with eslint (Optional) *(~10mins)*

#### 1. Add eslint plugin eslint-plugin-detox

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

### Step 6: Automate the execution of E2E integration tests on Bitrise (Optional) *(~30 mins)*

* Check the bitrise.yml of the [Waves](https://github.com/chdeps/waves) repository to automate on Bitrise.

## Troubleshooting

#### If an element of the UI cannot be found even if you gave it a testID.

* Detox will only find components thanks to their testID if they directly come from react-native. Make sure your custom components transfer the testID prop to a **built-in** react-native component such as Text, TouchableOpacity, ...

#### If an element of the UI cannot be found after a transition.

* waitFor & withTimeout (In our example, you wait for two seconds before checking for the title)

 ```js
await waitFor(element(by.id('title'))).toExist().withTimeout(2000);
```

#### If your tests hang you might have synchronisation issues.

* Use a waitFor with a temporary (de)synchronisation of your app

 ```js
  await device.disableSynchronization();
  await waitFor(element(by.id('title'))).toExist().withTimeout(2000);
  await device.enableSynchronization();
```

> NOTE: Sometimes the synchronization engine is stuck on a never ending asynchronous activity. Use --debug-synchronization to debug synchronization issues

## Example application

* Don't hesitate to refer to [Waves](https://github.com/chdeps/waves) : An open source repo I created to test Detox :)

> NOTE: You will find the bitrise.yml to automate your E2E tests on a CI
