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

Here's an example, where we enabled it on staging in order to speed up development (at the bottom of the screen).
![Code Push](/assets/codepush.png)

## Steps

### 1. Install the AppCenter cli _(~1 min)_

```bash
yarn global add appcenter-cli
# or npm install -g appcenter-cli
```

{% hint style='success' %} **CHECK**

`appcenter -v` should give you a version.

{% endhint %}

### 2. Login into AppCenter _(~4 min)_

Login with your GitHub or Google account:

```bash
appcenter login
```

{% hint style='success' %} **CHECK**

You should see your profile info with `appcenter profile list`.

{% endhint %}

### 3. Configure CodePush on AppCenter's servers _(~5 min)_

```bash
# Create the apps
# You can also do it via https://appcenter.ms
appcenter apps create -d <MyApp>-Android -o Android -p React-Native
appcenter apps create -d <MyApp>-iOS -o iOS -p React-Native

# Invite your team members to the apps
open https://appcenter.ms/users/<owner>/apps/<MyApp>-Android/settings/collaborators
open https://appcenter.ms/users/<owner>/apps/<MyApp>-iOS/settings/collaborators

# Configure the CodePush Staging deployment
appcenter codepush deployment add -a <owner>/<MyApp>-Android Staging
appcenter codepush deployment add -a <owner>/<MyApp>-iOS Staging

# Save the Staging tokens for later use
appcenter codepush deployment list -a <owner>/<MyApp>-Android
appcenter codepush deployment list -a <owner>/<MyApp>-iOS
```

{% hint style='success' %} **CHECK**

_Check:_ you have written down the deployment keys in a temporary file.

{% endhint %}

### 4. Install the react-native module _(~5 min)_

Find out the adequate version of react-native-code-push using the [supported-react-native-platforms section](https://github.com/Microsoft/react-native-code-push#supported-react-native-platforms) in the react-native-code-push documentation.

```bash
# Add the npm dependency
yarn add react-native-code-push@<your.version>

# Link the native modules. Paste your Staging tokens when prompted.
react-native link react-native-code-push
```

`react-native link` command adds a pod in your `Podfile`.
* If you don't already have `React` in your `Podfile`, it is recommended to remove the added line, commit, and follow the Microsoft tutorial [here](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/react-native#plugin-installation-ios---manual), paragraph **Plugin Installation (iOS - Manual)**.
* If you already have `React` in your `Podfile`, make sure to `bundle exec pod install` in order to update `Podfile.lock`

{% hint style='success' %} **CHECK**

_Check:_ your app builds on both Android and iOS, in debug and release mode.

{% endhint %}

### 5. Update your code _(~35 min)_

#### Update App.js _(~10 min)_

```js
// @flow
import React, { Component } from 'react';
...
import CodePush from 'react-native-code-push';
import { ENV } from 'MyApp/environment'

class App extends Component {

  render() {
    ...
    return <Scenes />;
  }
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
};

const AppComponent = ENV === 'staging' ? CodePush(codePushOptions)(App) : App;
export default AppComponent;
```

{% hint style='success' %} **CHECK**

_Check:_ Manually set "ENV" to `staging` and check the logs on iOS and Android. You shouldn't see any warning for CodePush.

{% endhint %}

#### Add CodePushUpdateButton.js _(~5 min)_

You can put the update process on any page you like, or even check if an update is available with a long press somewhere... It is up to you and your PO.

```js
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import CodePush from 'react-native-code-push';

class CodePushUpdateButton extends Component {
  state = {
    info: null,
    status: null,
    mismatch: false,
  };

  componentDidMount() {
    if (!CodePush) return;
    CodePush.getUpdateMetadata().then(update => {
      if (!update) return;
      let info = update.label;
      if (update.description) {
        info += ' (' + update.description + ')';
      }
      this.setState({
        info,
      });
    });
  }

  lookForUpdate = () => {
    CodePush.sync(
      {
        updateDialog: {
          appendReleaseDescription: true,
          descriptionPrefix: '\n\nChangelog:\n',
        },
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      SyncStatus => {
        switch (SyncStatus) {
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            this.setState({ status: 'Checking for update' });
            break;
          case CodePush.SyncStatus.AWAITING_USER_ACTION:
            this.setState({ status: 'Awaiting action' });
            break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.setState({ status: 'Downloading' });
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            this.setState({ status: 'Installing' });
            break;
          default:
            this.setState({ status: 'No update found' });
        }
      },
      null,
      mismatch => mismatch && this.setState({ mismatch: true })
    );
  };

  render() {
    if (this.state.mismatch) {
      return <Text style={{ fontSize: 11 }}>New version on HockeyApp</Text>;
    }

    return (
      <TouchableOpacity style={{ marginLeft: 5 }} onPress={this.lookForUpdate}>
        <Text style={{ fontSize: 12 }}>{this.state.status || 'Check update'}</Text>
        {!!this.state.info && (
          <Text style={{ fontSize: 8, maxWidth: 150 }} numberOfLines={3}>
            {this.state.info}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

export default CodePushUpdateButton;
```

Add this `CodePushUpdateButton` somewhere in your app.

{% hint style='success' %} **CHECK**

On the simulator, you should see an update button if you force the env to staging.

{% endhint %}

#### Create bin/deploy.sh _(~10 min)_

* [[MO] Add a deploy script to your app](/react-native/setup/deploy-script.mo.md)

{% hint style='success' %} **CHECK**

`yarn deploy -- -t hard` should deploy your application with Fastlane. `yarn deploy` should deploy with CodePush.

{% endhint %}

### 6. Test! _(~15 min)_

Open your PR, merge into the main branch. Have a hard build.
You can now deploy with code-push.

Bump your versions into `.env.staging` file before every hard deploy. If not, your JS code might try to call native libraries not present in your app.

### 7. Externalize the keys (optional) _(~10min)_

Externalize the keys in `Info.plist` and `AndroidManifest.xml`: see [https://github.com/kraynel/code-push-demo/commit/3cdd2496fab763a9814c1898c73505cd14fca9d1](https://github.com/kraynel/code-push-demo/commit/3cdd2496fab763a9814c1898c73505cd14fca9d1)

## Troubleshooting

You can try the CodePush [documentation](http://microsoft.github.io/code-push/docs/getting-started.html), and particularly the [react-native section](http://microsoft.github.io/code-push/docs/react-native.html).

You should also Andon the teams with a working CodePush process:

- [@BAM](https://github.com/search?q=org%3Abamlab+codepush&type=Commits)
- [DailyScrum](https://github.com/Minishlink/DailyScrum)

