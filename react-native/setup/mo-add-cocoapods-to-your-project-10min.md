# \[MO\] Add Cocoapods to your project \(~10min\)

## Owner: [Yann Leflour](https://github.com/yleflour)

## Prerequisites:

* Have [bundler](http://bundler.io) installed
* Have a _Gemfile_ at the root of your project

## Steps:

### 1. Add cocoapods \(~5min\)

* In your _Gemfile_ add the line `cocoapods`
* Run `bundle install`
* Go into the iOS project folder \(`cd ios`\)
  * Initialize pods with `bundle exec pod init`
  * Add `pods` to _.gitignore_
  * Open the `Podfile`
    * Remove every _\[name\]Tests_ target
    * \(Optional\) Remove the _\[name\]-tvOS_ target
  * Run `bundle exec pod install`

> **Checks:**
>
> * You now have a _projectName.xcworkspace_ file in the `ios` folder
> * You can run your project by opening _projectName.xcworkspace_ with XCode or `react-native run-ios`
>
>   The _pods_ folder shouldn't show up in the git diffs

### 2. Add your first Pod \(~2min\)

* Open the `Podfile`
  * Add `pod '<POD_NAME>', '~> <Version>'` inside the target
* Run `bundle exec pod install`

> **Checks:**
>
> * The exposed _.h_ file from the pod can be imported in _AppDelegate.m_
> * You can run your project by opening _projectName.xcworkspace_ with XCode or `react-native run-ios`

