# [MO] Debug two iOS apps simultaneously

## Owner: [Xavier Lefèvre](https://www.github.com/xavierlefevre)

## Last update date: 29th of January 2018

### Prerequisites

* Having already installed and launched each app before
* Using [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

### Steps

* For the first application, you can launch it as you would normally:

  * Open it with xcode `xcode ./ios/your-first-app.xcworkspace`
  * Open React Native Debugger
  * Launch the simulator from xcode with the play button on the top left

* For the second application:

  * Open it with xcode `xcode ./ios/your-second-app.xcworkspace`
  * Modify the port used by the packager in the native code:
    * Do a full project search with "Maj + Cmd + F"
    * Look for "8081"
    * Replace "8081" by a new port, like "9980"
    * Save each change
  * In React Native Debugger:
    * Open a new window "Cmd + T"
    * Enter your new port "9980"
  * Launch the simulator from xcode with the play button
  * Launch a new packager from your project directory: `react-native start --port 9980`
  * Close and re-open the app from within the simulator

* You are good to go! Both apps are now running with separate packagers and separate debuggers.
