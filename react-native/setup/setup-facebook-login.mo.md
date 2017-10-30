# [MO] Install Fb React Native Login (v0.47) (~35 min)

## Owner: [Guillaume Renouvin](http://github.com/GuillaumeRenouvin/)

## Prerequisites (~15 min)
* Have Yarn installed (~2 min)
* Have an application created on Facebook and her id (https://developers.facebook.com/apps) (~10 min)
* Have an account added as developper on your application facebook
* Have cocoapods in your project (~5 min)

## Context
When I had to install a facebook login on my React Native project, I thought it would be easy and that I would only have to follow the tutorial of the github repo. But, by simply following the tutorial, I found myself with many problems of versions on both iOS and Android.

I hope that thanks to this article which summarizes the tips that I could find online, you will be able to install a facebook login in less than an hour.

## Steps (~20 min)
Install react-native-fbsdk package (https://github.com/facebook/react-native-fbsdk): `yarn add react-native-fbsdk@0.6.0` (last release 0.6.1 bug on react native link)

#### iOS (~10 min)
* Link it `react-native link react-native-fbsdk`
* Add in your podfile the library's dependencies:
     ```
     target 'accorlocal' do
       inherit! :search_paths
       pod 'FBSDKCoreKit', '~> 4.25.0'
       pod 'FBSDKShareKit', '~> 4.25.0'
       pod 'FBSDKLoginKit', '~> 4.25.0'
     end
     ```
     `cd ios && bundle exec pod install --repo-update`
* Then follow the [documentation](https://developers.facebook.com/quickstarts/?platform=ios) -> Fill your app id -> Configure your info.plist -> connect the App Delegate  

**check:** `console.log(NativeModules)` should show the FacebookLoginManager module on iOS build

#### Android (~10 min)
* Then follow the [documentation](https://github.com/facebook/react-native-fbsdk#31-android-project) -> "If your react-native version is 0.29 or above"
* Go to [Facebook developer](https://developers.facebook.com/quickstarts/?platform=android) -> Fill your app id -> And follow "Add Facebook App ID"
* There are versions issues on the nodes_modules. To fix them, add a script in /bin/patch-fb-sdk.sh and add it in your package.json as a post install command:
```
#!/bin/sh
if [[ $CI ]]; then
  sed -i.bak '' 's/@Override//' ./node_modules/react-native-fbsdk/android/src/main/java/com/facebook/reactnative/androidsdk/FBSDKPackage.java
  sed -i.bak '' 's/4\.+/4.22.1/' ./node_modules/react-native-fbsdk/android/build.gradle
else
  sed -i.bak 's/@Override//' ./node_modules/react-native-fbsdk/android/src/main/java/com/facebook/reactnative/androidsdk/FBSDKPackage.java
  sed -i.bak 's/4\.+/4.22.1/' ./node_modules/react-native-fbsdk/android/build.gradle
fi
```
To debug with android, on you terminal generate a key: `keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64` and add it to  [your facebook app](https://developers.facebook.com/apps/1806939376263478/settings/) -> `Key hashings`
-
**check 1:** `console.log(NativeModules)` should show the FacebookLoginManager module on Android build  
**check 2:** You should be able to log on Facebook on your application on Android on development

#### Add the Facebook login button
Now, you should be able to add the login button on your app working on both Android and iOS. You just have to import `react-native-fbsdk` and add your Facebook button
```
import { TouchableOpacity, Text } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';

class Login extends Component {
  tryFacebookLogin() {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          alert('Login success with permissions: ' + result.grantedPermissions.toString());
        }
      },
      function(error) {
        alert('Login fail with error: ' + error);
      }
    );
  }

  render() {
    return (
      <TouchableOpacity onPress={this.tryFacebookLogin}>
        <Text>Facebook button</Text>
      </TouchableOpacity>
    );
  }
}
```

You can find more configuration [here](https://github.com/facebook/react-native-fbsdk#login)
