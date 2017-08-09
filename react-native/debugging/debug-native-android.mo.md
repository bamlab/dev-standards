# [MO] Debug on Android

## Owner: [Yann Leflour](https://github.com/yleflour)
## Debug Android code
### Prerequisites

- [ ] Have [Android Studio](https://developer.android.com/studio/index.html) installed
## Steps

- Open **Android Studio**
- Click on *File > Open*
- Navigate to and open *<PATH_TO_YOUR_PROJECT>/android*
- Run in debug mode from **Android Studio**

## Log Android Errors

### Prerequisites

- [ ] Have [Pidcat](https://github.com/JakeWharton/pidcat) installed

## Steps

- Connect the Android phone to your computer
- Make sure that the phone is available from your computer: `adb devices`
- Run: `pidcat <GRADLE_APP_IDENTIFIER>`
- See all the logs related to your app, requests, native and javascript logs and errors, etc.
