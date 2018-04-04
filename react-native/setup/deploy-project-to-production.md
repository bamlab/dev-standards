# [MO] Setup & Deploy Project to Production - Only iOS Testflight

## Owner: [Xavier Lefèvre](github.com/xavierlefevre)

## Prerequisites
- [ ] [React Native Toolbox](https://github.com/bamlab/generator-rn-toolbox)
- [ ] Your client admin account on Apple Developer
- [ ] Your client admin account on iTunes Connect

## Steps

### 1. Setup Production Env
> Creates the necessary fastlane and JS environments files
```bash
yo rn-toolbox:fastlane-env
```

***Answers***
- Please confirm the project name: `<Press Enter>` => The same as for the staging/hockeyapp setup
- The name for this new environment (lowercase, no space): `production`
- The name of your repository Git branch for the environment just set: `production` => Or master...
- The name of the company which will be publishing this application: `Bam` => Or your client name
- The app name for this environment: `<AppName>` => The final App name
- The App Id for this environment: `com.<TeamName>.<ProjectName>.production`
- Which platform will you use for deployment?: `AppStore`
- Your git repo for match: `git@github.com:<TeamRepo>/certificates.git`
- The branch you want to use for match: `<Press Enter>` => The same as for the staging/hockeyapp setup, one Apple account means one branch usually
- The developer.apple.com team id for the certificates: `**redacted**` => Can be found in Membership (on the website https://developer.apple.com)
- The itunesconnect.apple.com team name: `**redacted**` => Can be found at the bottom top right
- Your apple id: `**redacted**` => The username of the apple account
- Your keystore password: `<Press Enter>` => You can directly accept the generated password from the generator

### 2. Test your JS Production environment in your emulator
> To make sure that your app is ready to be pushed in production, not showing or using dev tools and calling the right back-end

### 3. Generate a certificate and a provisioning profile with setup
```bash
bundle exec fastlane ios setup --env=production
```

### 4. Create the app on iTunes Connect
- My apps > Top Left '+' > New App
  - Platform: `iOS`
  - Name: `<AppName>`
  - Language: `<Main app language>`
  - Bundle ID: `<Above App Id>`
  - SKU: `<App Id as well>`
  - Create!

### 5. Launch the build process
> It will sign and build your app and upload it to iTunes Connect.

```bash
bundle exec fastlane ios deploy --env=production
```

If there is an error due to icons, [check this doc](https://github.com/bamlab/generator-rn-toolbox/blob/master/generators/assets/README.md#generate-icons)

### 6. See your app available on Testflight internal testing
- Wait: processing from Apple (can see the status in iTunes Connect > Your App > Activity)
- Your app should be "green" for iTunes Connect Users: iTunes Connect > Your App > Testflight
- Click: iTunes Connect Users to invite testers > '+'
  - Add someone that was already invited to manage this account

### 7. iTunes status
This is the flow you will go through once you've uploaded your app:

![applereviewstatus](https://user-images.githubusercontent.com/30256638/32058288-e47d61f2-ba69-11e7-87c2-8212ad0d4530.png)

Here is a website that gives the current waiting time for the review step: http://appreviewtimes.com/.
The longest step is 'Waiting for Review' that can last several days.

## ToDo
- Add compliance issues detail after the app arrived on iTunes Connect
- Detail how to add a new user to an iTunes Connect account
- Detail how to use match with an [already existing certificate](http://macoscope.com/blog/simplify-your-life-with-fastlane-match/#migration)
