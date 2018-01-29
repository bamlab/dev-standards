# [MO] Setup & Deploy New Project to Staging

{% hint style='warning' } **NOTE**

This standard replaces [[MO] Deploy to staging with HockeyApp](setup-and-deploy-new-project-to-staging-with-hockeyapp.mo.md), deprecated by [@felixmeziere](https://github.com/felixmeziere) on January 28.

**Reason**: HockeyApp is meant to be deprecated by AppCenter. AppCenter is the new HockeyApp and there is [no loss of functionality](http://blog.m33.network/2017/09/react-native-devops-2-0-overview-of-mobile-center-next-generation-of-hockeyapp/).

{% endhint %}

## Owner: [Felix Meziere](https://github.com/felixmeziere)

## Prerequisites
- [ ] Have you entire environment setup
- [ ] Generating a new SSH key and adding it to the ssh-agent: (https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

## Steps

{% hint style='warning %} Remember to commit after each step

### 1. Setup your React Native App

```bash
react-native init <projectName>
cd <projectName>
# First Commit
```

### 2. Setup Fastlane

```bash
yo rn-toolbox:fastlane-setup
# Second Commit
```

***Answers***
- Please confirm the project name: `<Press Enter>`
- Commit keystore files?: `Y`
- Overwrite <fileName>: `<Press Enter>`

### 3. Setup Staging Env

```bash
yo rn-toolbox:fastlane-env
# Third Commit
```

***Answers***
- Please confirm the project name: `<Press Enter>`
- The name for this new environment (lo
wercase, no space): `staging`
- The name of your repository Git branc
h for the environment just set: `<Press Enter>`
- The name of the company which will be
 publishing this application: `Bam`
- Which platform will you use for deplo
yment?: `AppCenter`
- The iOS app name for this environment. Name should be different from the Android app and not contain spaces: `<AppName>-ios-S`
- The Android app name for this environment. Name should be different from the Android app and not contain spaces: `<AppName>-android-S`
- The App Id for this environment: `tech.bam.<projectname>.staging`
- The type of certificate you will be u
sing: `In House (Enterprise only)`
- Your git repo for match: `git@github.com:<TeamRepo>/certificates.git`
- The branch you want to use for match: `<Press Enter>`
- The developer.apple.com team id for t
he certificates: `**redacted**`
- Your apple id: `**redacted**`
- Your keystore password: `<Press Enter>`
- A valid App Center API token: `**redacted**`
- A valid App Center Username: `**redacted**`
- (After some npm installation...) Should fastlane modify the Gemfile at path 'xxx' for you? (y/n): `y`

*Note:* The AppCenter username is at the bottom-left of the AppCenter interface for a person or is the name of the organization for an organization.


### 4. Deployment setup

```bash
bundle exec fastlane ios setup --env=staging
# Fourth Commit
```

### 5. Deploy Staging

```bash
bundle exec fastlane ios deploy --env=staging
bundle exec fastlane android deploy --env=staging
```

***Answers***
- OS: `iOS/Android` depending on which you are deploying
- Platform: `React Native`
- Do you want to create a New App?: `yes`

### 6. Get the download link

- For each app (Android + iOS)
  - Go to the emails you just got for the two deployments
  - Copy the url that the *Install* button points to and remove the end bit so that it finishes
    with `/releases/`
- Go to [smarturl.it](https://manage.smarturl.it)
- Create a new link
  - Default URl: `Trello url`
  - Device Destination:
    - iPhone: The AppCenter iOS Download & Feedback `Public Page url`
    - iPad: The AppCenter iOS Download & Feedback `Public Page url`
    - Android: The The AppCenter Android Download & Feedback `Public Page url`
  - Organize
    - Custom Alias: `smarturl.it/<projectName>`


### 7. Troubleshooting

If 'Cloning GitHub repo' takes more than 2 minutes: the github servers may be untrusted Trigering a `git clone git@github.com:bamlab/certificates.git` will fix it.


