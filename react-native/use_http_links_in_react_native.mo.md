# [MO] Use HTTP links with RN Components/API Calls on iOS
## Owner: [Julien Nassar](https://github.com/juliennassar)
## Sponsor: [Alexandre Moureaux](https://github.com/almouro)

## Prerequisites (~ 2 minutes)
- [ ] Have a React Native application [using yo generator](https://github.com/bamlab/generator-rn-toolbox)

## Context

Using HTTP links (in image sources for example) will not work on iOS devices/emulators. By default, the HTTP protocol is disabled. API calls and Image sources using HTTP protocol will not work on iOS, and no errors will be displayed.

## Steps (~ 2 minutes)

Using the default configuration, the images in this page will not be displayed:

```javascript
import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'


export default class Workspace extends Component {
  render () {
    return (
      <TouchableOpacity>
          <View>
          <Image
            source={{ uri: http://www.neo-nomade.com/fichier/images/espace/5519/Blissexterieur.jpeg }}
            style={{width: 50, height: 50}}
            resizeMode='contain'
          />
        </View>
      </TouchableOpacity>
    )
  }
}
```
The source uri uses the HTTP protocol

the result is this:
<br />
<img src="https://user-images.githubusercontent.com/13121639/30554696-b92edad0-9ca5-11e7-93f0-7b41f51f8dfc.png" width="300">
<br />
No image displayed :(
<br />

### how to display these images:

By default iOS forbids calls using http protocol. Normally you should use secured http protocol (https), if you don't have that opportunity, you have to allow the domain using http protocol by modifying the `<Project>/ios/<Project>/info.plist`:

in the NSExceptionDomains section, add your domain name and permission

```xml
<key>NSExceptionDomains</key>
<dict>
	<key>localhost</key> <!-- By default, localhost is allowed to use HTTP protocol to use the debugger -->
	<dict>
		<key>NSExceptionAllowsInsecureHTTPLoads</key>
		<true/>
	</dict>
	<key>YOUR_DOMAIN.com</key> <!-- replace YOUR_DOMAIN with your domain name -->
	<dict>
		<key>NSExceptionAllowsInsecureHTTPLoads</key> <!-- Set the permission for HTTP loads (without encryption) -->
		<true/>
	</dict>
</dict>
```
<br />
**- [ ] Rebuild your app**
If you reloading your app it will not work, you modified Native code, so you need to rebuild the native part as well
And it works :)
<br />
<img src="https://user-images.githubusercontent.com/13121639/30554718-c70e063a-9ca5-11e7-914e-53b5a1f2eccf.png" width="300">
<br />
and it works!
