# [MO] Install CodePush on your project _(~1h)_

## Owner: [Louis Lagrange](https://github.com/Minishlink)

## Prerequisites _(~2min)_

* [ ] A running React Native app, preferably started with the generator
* [ ] A compatible React Native version (see [compatibility table](https://github.com/Microsoft/react-native-code-push#supported-react-native-platforms))

## What is CodePush

> A React Native app is composed of JavaScript files and any accompanying images, which are bundled together by the packager and distributed as part of a platform-specific binary (i.e. an .ipa or .apk file). Once the app is released, updating either the JavaScript code (e.g. making bug fixes, adding new features) or image assets, requires you to recompile and redistribute the entire binary, which of course, includes any review time associated with the store(s) you are publishing to.

CodePush allows to rebuild and push only the modified JS code.

Pros:

* Faster builds
* Easier to update: no need to download the whole app again on HockeyApp
* See deployment history and statistics
* Easy rollbacks
* If you enable it in production, you can install updates silently and automatically

Cons:

* You rely on Microsoft Azure's servers

Here's an example on **redacted** app, where we enabled it on staging in order to speed up development (at the bottom of the screen).
![Code Push **redacted**](/assets/codepush.png)

## Steps

Lookup the compatible version (we'll name it `<your.version>`) in the [compatibility table](https://github.com/Microsoft/react-native-code-push#supported-react-native-platforms).

### 1. Install code-push cli _(~1 min)_

#### On AppCenter

```bash
# npm install -g appcenter-cli
```

{% hint style='success' %} **CHECK**

`appcenter -v` should give you a version.

{% endhint %}

#### Normal CodePush (with HockeyApp)

{% hint style='danger' %} **DEPRECATION**

HockeyApp has been deprecated by [@felixmeziere](https://github.com/felixmeziere) on January 28 in favour of [[MO] Deploy to staging](./setup-and-deploy-new-project-to-staging.mo.md).

{% endhint %}

```bash
npm install -g code-push-cli
```

{% hint style='success' %} **CHECK**

`code-push -v` should give you a version.

{% endhint %}

### 2. Login into code-push / AppCenter _(~4 min)_

Login into GitHub with bam developers account. In your terminal:

```bash
code-push register
# ⚠️ If you use AppCenter:
# appcenter login
```

and finish the login process using GitHub.

{% hint style='success' %} **CHECK**

`code-push whoami` should give you your GitHub email.

{% endhint %}

### 3. Install the react-native module _(~5 min)_

```bash
# Add the npm dependency
yarn add react-native-code-push@<your.version>

# Register your Android app
code-push app add <MyApp>-android android react-native
# Save the Staging token for later use
# ⚠️ If you use AppCenter:
# appcenter codepush deployment add -a <owner>/<MyApp>-android Staging

# Register your iOS app
code-push app add <MyApp>-ios ios react-native
# Save the Staging token for later use
# ⚠️ If you use AppCenter:
# appcenter codepush deployment add -a <owner>/<MyApp>-ios Staging

# ⚠️ If you use AppCenter, you can retreive your tokens with these commands
# appcenter codepush deployment list -a <owner>/<MyApp>-android Staging
# appcenter codepush deployment list -a <owner>/<MyApp>-ios Staging

# Link the native modules. Paste your Staging tokens when prompted.
react-native link react-native-code-push
```

{% hint style='success' %} **CHECK**

_Check:_ your app should build with the binary CodePush modules. The deploy keys are present in `Info.plist` and in `MainApplication.java`.

{% endhint %}

### ⚠️ For react-native-code-push@5.1+

React-native `link` command adds a pod in your pod file. You can either:

* install the pod using `pod install`.
* or if this pod conflicts with other pods, delete the added line in your `PodFile`. In this case, you can commit everything else. Then, follow Microsoft tutorial [here](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/react-native#plugin-installation-ios---manual), paragraph **Plugin Installation (iOS - Manual)**.

### 4. Update your code _(~35 min)_

#### Update App.js _(~10 min)_

```js
// @flow
import React, { Component } from 'react';
...
import codePush from 'react-native-code-push';
import { ENV } from 'MyApp/environment'

const codePushOptions = {
  updateDialog: true,
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

class App extends Component {

  render() {
    ...
    return <Scenes />;
  }
}

const AppComponent = ENV === 'STAGING' ? codePush(codePushOptions)(App) : App;
export default AppComponent;
```

{% hint style='success' %} **CHECK**

_Check:_ No check on simulator. Your app should not crash (duh!).

{% endhint %}

#### Update Home.js _(~15 min)_

You can put the update process on any page you like, or even check if an update is available with a long press somewhere... It is up to you and your PO.

```js
import React, { Component } from 'react'
import codePush from 'react-native-code-push';
import { ENV } from 'MyApp/environment'
...

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      updateDescription: null,
      updateLabel: null,
      codePushStatus: null
    }
  }

  componentDidMount() {
    if (codePush && ENV === 'STAGING') {
      // Will fetch the latest update metadata
      codePush.getUpdateMetadata().then(update => {
        if (!update) return;
        this.setState({
          updateDescription: update.description,
          updateLabel: update.label,
        });
      });
    }
  }

  render () {
    return (
      <View>
        ...
        {ENV === 'STAGING' &&
          <View>
            <Button
              buttonText={this.state.codePushStatus || 'Check update'}
              onPress={() => {
                codePush.sync(
                  {
                    updateDialog: {
                      appendReleaseDescription: true,
                      descriptionPrefix: '\n\nModifications:\n',
                    },
                  },
                  SyncStatus => {
                    switch (SyncStatus) {
                      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                        this.setState({ codePushStatus: 'Checking for update' });
                        break;
                      case codePush.SyncStatus.AWAITING_USER_ACTION:
                        this.setState({ codePushStatus: 'Await action' });
                        break;
                      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                        this.setState({ codePushStatus: 'Downloading' });
                        break;
                      case codePush.SyncStatus.INSTALLING_UPDATE:
                        this.setState({ codePushStatus: 'Installing' });
                        break;
                      default:
                        this.setState({ codePushStatus: 'No update found' });
                    }
                  }
                );
              }}
            />
          </View>
        }
        ...
        {this.state.updateLabel &&
            <View style={{ position: 'absolute', bottom: 5, backgroundColor: 'transparent' }}>
              <Text style={{ fontSize: 12, textAlign: 'center' }}>
                {this.state.updateLabel}
              </Text>
              <Text style={{ fontSize: 12, textAlign: 'center' }}>
                {this.state.updateDescription}
              </Text>
        </View>}
      </View>
    )
  }
}

export default Home
```

{% hint style='success' %} **CHECK**

On simulator, you should see an update button if you force the env to staging. You can force the labels in the state variables `updateDescription` and `updateLabel` to check their position.

{% endhint %}

#### Create bin/deploy.sh _(~10 min)_

* [[MO] Add a deploy script to your app](/react-native/setup/deploy-script.mo.md)

{% hint style='success' %} **CHECK**

`yarn deploy -- -t hard` should deploy your application with Fastlane. `yarn deploy` should deploy with codepush.

{% endhint %}

### 5. Test! _(~15 min)_

Open your PR, merge into the main branch. Have a hard build.
You can now deploy with code-push.

Bump your versions into `.env.staging` file before every hard deploy. If not, your JS code might try to call native libraries not present in your app.

### 6. Externalize the keys (optional) _(~10min)_

Externalize the keys in `Info.plist` and `AndroidManifest.xml`: see [https://github.com/kraynel/code-push-demo/commit/3cdd2496fab763a9814c1898c73505cd14fca9d1](https://github.com/kraynel/code-push-demo/commit/3cdd2496fab763a9814c1898c73505cd14fca9d1)

## Troubleshooting

You can try the CodePush [documentation](http://microsoft.github.io/code-push/docs/getting-started.html), and particularly the [react-native section](http://microsoft.github.io/code-push/docs/react-native.html).

You should also Andon the teams with a working CodePush process:

* [Nicolas Ngomai](https://github.com/lechinoix)
* [Xavier Lefevre](https://github.com/xavierlefevre)
* [Kevin Reynel](https://github.com/kraynel)
