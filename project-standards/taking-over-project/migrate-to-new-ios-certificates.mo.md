# [MO] Migrate project to BAM's certificates

## Owner: [Yassine Chbani](https://www.github.com/yassinecc)

## Description
- A project started by a third party should use your organisation's iOS certificates once a team starts working on it

## Impact
- If the original Apple developer account is not an entreprise one, the certificates for the staging app will expire and renewing them will include a dependency to the original owner of the project

## Prerequisites
- [ ] You have access to the previous Apple Developer account
- [ ] Your project uses fastlane

## Steps
### Removing the old app ID
- Log in to the original Apple Developer account on developer.apple.com
- Go to the certificates, Identifiers and Profiles page
- In the Identifiers section, locate the staging app's ID and select it
- In the menu you opened, browse to the bottom and delete the app ID

### Generating a new provisiong profile
- In your fastlane folder, open the .env file for the staging app
- Change the `MATCH_GIT_URL` and `IOS_TEAM_ID` fields to the ones used by you organisation
- If not already the case, set `MATCH_TYPE` to 'enterprise' and `MATCH_FORCE_ENTERPRISE` to '1' in the `IOS_MATCH` section of the env file
- Change the `FL_HOCKEY_API_TOKEN` to you organisation's token
- Run `bundle exec fastlane ios setup --env=staging`
- Deploy to HockeyApp
- Download and test the app
- Share with your product owner and relevant people the new link to download the staging app
