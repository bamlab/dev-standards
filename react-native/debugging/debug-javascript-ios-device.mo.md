# [MO] Debug Javascript on an iOS Device

## Prerequisites
- [ ] Have [React Native Debugger](https://github.com/jhen0409/react-native-debugger) installed
- [ ] Have a certificate + provisioning profile for debug

## Steps

> :warning: The Ip mentionned is the one from your local network and not your router's ip on the internet

> :warning: Make sure you have reverted the changes after debugging to avoid build issues

- Make sure both the device and computer are on the same network
- In `node_modules/react-native/Libraries/React.xcodeproj/React/Base/RCTBundleURLPRovider.m`
  - Replace `NSString *host = ipGuess ?: @"localhost";`
  - With your computer IP address (remove ipGuess if it poses problems): `NSString *host = @"<your_computer_ip>";`
- In `Libraries/RCTWebSocket.xcodeproj/RCTWebSocketExecutor.m`
  - Replace: `host = @"localhost";`
  - With your computer IP address: `host = @"<your_computer_ip>";`
- Verify signing by making sure you have obtained the signing certificate for debug first
- Run the app
- Shake to open the menu
- Hit *Debug Remotely*
