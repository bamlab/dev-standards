# Code-push?

> A React Native app is composed of JavaScript files and any accompanying images, which are bundled together by the packager and distributed as part of a platform-specific binary (i.e. an .ipa or .apk file). Once the app is released, updating either the JavaScript code (e.g. making bug fixes, adding new features) or image assets, requires you to recompile and redistribute the entire binary, which of course, includes any review time associated with the store(s) you are publishing to.


Codepush allows to rebuild and push only the modified JS code.

Pros :

- Faster builds
- Easier to update: no need to refetch the whole app on HockeyApp
- Deploy history

![Code Push ***REMOVED***](./codepush.PNG)

# 1. Install code-push cli

  `npm install -g code-push-cli`

# 2. Login into code-push

Login into Github with `***REMOVED***`. In your terminal:

  `code-push register`

and finish the login process using Github.

# 3. Install the react-native module

**Check version compatibility beforehand**: [https://github.com/Microsoft/react-native-code-push#supported-react-native-platforms](https://github.com/Microsoft/react-native-code-push#supported-react-native-platforms).

```bash
# Add the npm dependency.
yarn add react-native-code-push@<your.version>
# Register your android app:
code-push app add <MyApp>-android android react-native
# Save the output staging token for later use
# Register your ios app:
code-push app add <MyApp>-ios ios react-native
# Save the output staging token for later use
# Link the native modules. Paste your staging tokens.
react-native link react-native-code-push
```

# 4. Update your code

## update App.js

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

## update Home.js

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

## create bin/deploy.sh

```bash
#!/bin/sh
read -r -p "Hard deploy [y/N] " response
case "$response" in

    [yY][eE][sS]|[yY])
      echo "Hard deploy"
      read -r -p "Did you bump the versions in fastlane/.env.staging [y/N] " response
        case "$response" in
          [yY][eE][sS]|[yY])
          # Your standard hard deploy steps
          bundle exec fastlane android deploy --env=staging && bundle exec fastlane ios deploy --env=staging

          ;;
        esac
        ;;

    *)
      echo "Soft deploy"
      git stash
      git checkout staging
      git pull
      source fastlane/.env.staging
      MESSAGE=$(git log HEAD --pretty=format:"%h : %s" -1)
      echo "Deploying Commit : $MESSAGE"
      yarn
      code-push release-react -d Staging <MyApp>-android android -m --targetBinaryVersion $ANDROID_VERSION_NAME --des "$MESSAGE"
      code-push release-react -d Staging <MyApp>-ios ios -m --targetBinaryVersion $IOS_VERSION --des "$MESSAGE"
        ;;
esac
```

## update package.json

```json
{
  ...
  "scripts": {
    ...
    "deploy:staging": "./bin/deploy.sh",
    ...
  },
  "dependencies": {
    ...
  }
}
```

# Test!

Open your PR, merge into the main branch. Have a hard build.
You can now deploy with code-push.

Bump your versions into `.env.staging` file before every hard deploy. If not, your JS code might try to call native libraries not present in your app.

# Optional

Externalize the keys in `Info.plist` and `manifest.xml`: see [https://github.com/kraynel/code-push-demo/commit/3cdd2496fab763a9814c1898c73505cd14fca9d1](https://github.com/kraynel/code-push-demo/commit/3cdd2496fab763a9814c1898c73505cd14fca9d1)
