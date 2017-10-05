# [MO] Debug Javascript on an iOS Device

## Owner: Yann Leflour

## Prerequisites

- [ ] Have [React Native Debugger](https://github.com/jhen0409/react-native-debugger) installed
- [ ] Have a certificate + provisioning profile for debug

## Steps

- Obtain signing certificate:

  - Get the bundle Identifier from your `fastlane/.env.staging` it's the `IOS_APP_ID` key
  - Copy it in your ios/yourAppName/info.plist after the key `<key>CFBundleIdentifier</key>`
  - Create a new lane in your FastFile :
  
```
lane :get_dev_provisioning_profile do
  match(type: 'development', shallow_clone: true)
end
```

  - Execute your lane : `bundle exec fastlane get_dev_provisioning_profile --env=staging`
  - Enter repo password
  - Then select the new Development provisioning profile in XCode in the General Tab.

> :warning: The Ip mentionned is the one from your local network and not your router's ip on the internet

> :warning: Make sure you have reverted the changes after debugging to avoid build issues

- Make sure both the device and computer are on the same network
- In `Libraries/React.xcodeproj/React/Base/RCTBundleURLPRovider.m`
  - Replace `NSString *host = ipGuess ?: @"localhost";`
  - With your computer IP address (remove ipGuess if it poses problems): `NSString *host = @"<your_computer_ip>";`
- In `Libraries/RCTWebSocket.xcodeproj/RCTWebSocketExecutor.m`
  - Replace: `host = @"localhost";`
  - With your computer IP address: `host = @"<your_computer_ip>";`
- Verify signing by making sure you have obtained the signing certificate for debug first
- Run the app
- Shake to open the menu
- Hit *Debug Remotely*
