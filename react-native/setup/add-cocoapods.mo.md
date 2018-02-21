# [MO] Add Cocoapods to your project (~10min)

## Owner: [Yann Leflour](https://github.com/yleflour)

## Prerequisites:

- Have [bundler](http://bundler.io) installed
- Have a *Gemfile* at the root of your project

## Steps:

### 1. Add cocoapods (~5min)

- In your *Gemfile* add the line `cocoapods`
- Run `bundle install`
- Go into the iOS project folder (`cd ios`)
  - Initialize pods with `bundle exec pod init`
  - Add `pods` to *.gitignore*
  - Open the `Podfile`
    - Remove every *[name]Tests* target
    - (Optional) Remove the *[name]-tvOS* target
  - Run `bundle exec pod install`

> **Checks:**
> - You now have a *projectName.xcworkspace* file in the `ios` folder
> - You can run your project by opening *projectName.xcworkspace* with XCode or `react-native run-ios`
> The *pods* folder shouldn't show up in the git diffs

### 2. Add your first Pod (~2min)

- Open the `Podfile`
  - Add `pod '<POD_NAME>', '~> <Version>'` inside the target
- Run `bundle exec pod install`

> **Checks:**
> - The exposed *.h* file from the pod can be imported in *AppDelegate.m*
> - You can run your project by opening *projectName.xcworkspace* with XCode or `react-native run-ios`
