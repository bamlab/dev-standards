# [MO] Deploy Project to Production on the Google Play Store

## Owner: [Yassine Chbani](github.com/yassinecc)

## Prerequisites

* [ ] Your client admin account on Google Play Console
* [ ] You have tested your app's critical features in its production environment

## Steps

### 1. Bump version

Bump version code and version name in `fastlane/.env.prod`.

### 2. Launch the build process

This will build your app and upload it to the Google Play Console.

```bash
bundle exec fastlane android deploy --env=production
```

### 3. Make your app available for beta testing

* Log in to [the developer console](https://play.google.com/apps/publish/) with your project's account and select your app
* Go to `Release Management/App releases` in the left panel
* Click on `Manage Beta` then `Create release` and upload the APK generated from the build process. This file is located at `android/app/build/outputs/apk/app-release.apk`
* Rollout the beta testing and share the download link to your PO

⚠️ WARNING ⚠️ Once rolled out into production, it is not possible to directly roll back to APKs that have a lower version code. You'll have to bump the version code and rebuild your app, basically telling the Google Play console you have a new version of the app.

## 4. Update the Play Store assets

If the app's icon or one of its graphics changed, you have to update them separately from the APK:

* On the left panel, go to `Store presence/Store listing`
* Upload your new graphics then submit your update


