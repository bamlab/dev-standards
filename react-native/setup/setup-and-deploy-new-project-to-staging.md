# [MO] Setup & Deploy New Project to Staging

## Prerequisites
- [ ] Have you entire environment setup
- [ ] Generating a new SSH key and adding it to the ssh-agent: (https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

## Steps

> :warning: Remember to commit after each step

### 1. Setup your React Native App

```
react-native init <projectName>
cd <projectName>
# First Commit
```

### 2. Setup Fastlane

```
yo rn-toolbox:fastlane-setup
# Second Commit
```

***Answers***
- Please confirm the project name: `<Press Enter>`
- Commit keystore files?: `Y`
- Overwrite <fileName>: `<Press Enter>`

### 3. Setup Staging Env

```
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
- The app name for this environment: `<AppName> S`
- The App Id for this environment: `tech.bam.<projectname>.staging`
- Which platform will you use for deplo
yment?: `HockeyApp`
- The type of certificate you will be u
sing: `In House (Enterprise only)`
- Your git repo for match: `git@github.com:<TeamRepo>/certificates.git`
- The branch you want to use for match: `<Press Enter>`
- The developer.apple.com team id for t
he certificates: `**redacted**`
- Your apple id: `**redacted**`
- Your keystore password: `<Press Enter>`
- A valid HockeyApp token: `**redacted**`

### 4. Deploy Staging
```
bundle exec fastlane ios deploy --env=staging
bundle exec fastlane android deploy --env=staging
```

### 5. Create the download link
- Go to [smarturl.it](https://manage.smarturl.it)
- Go to Hockey App with `**redacted**`
  - For each app (Android + iOS)
    - Go to `Manage app`
    - Go to `Distribution`
    - Select `Download Page` > `Public`
    - Hit `Save`
- Create a new link
  - Default URl: `Trello url`
  - Device Destination:
    - iPhone: The Hockey App iOS Download & Feedback `Public Page url`
    - iPad: The Hockey App iOS Download & Feedback `Public Page url`
    - Android: The Hockey App iOS Download & Feedback `Public Page url`
  - Organize
    - Custom Alias: `smarturl.it/<projectName>`
   
   
 ### 6. Troubleshooting
 
 If 'Cloning GitHub repo' takes more than 2 minutes: the github servers may be untrusted Trigering a `git clone git@github.com:bamlab/certificates.git` will fix it.
 

