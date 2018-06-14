#! /bin/sh

RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NO_COLOR='\033[0m'

APP_ENV="staging"
APP_OS="ios and android"
DEPLOY_TYPE="soft"

while getopts ":e:o:t:" opt; do
  case $opt in
    e) APP_ENV="$OPTARG"
    ;;
    o) APP_OS="$OPTARG"
    ;;
    t) DEPLOY_TYPE="$OPTARG"
    ;;
    \?) echo "${RED}Invalid option -$OPTARG${NO_COLOR}" >&2
    ;;
  esac
done

if [ $DEPLOY_TYPE == "hard" ]; then
  echo "${BLUE}* * * * *"
  echo "👷  Hard-Deploy"
  echo "* * * * *${NO_COLOR}"
  if [[ $APP_OS != "android" ]]; then
    echo "${GREEN}- - - - -"
    echo "Fastlane 🍎  iOS $APP_ENV"
    echo "- - - - -${NO_COLOR}"
    bundle exec fastlane ios deploy --env=$APP_ENV
  fi
  if [[ $APP_OS != "ios" ]]; then
    echo "${YELLOW}- - - - -"
    echo "Fastlane 🤖  Android $APP_ENV"
    echo "- - - - -${NO_COLOR}"
    bundle exec fastlane android deploy --env=$APP_ENV
  fi
fi

if [ $DEPLOY_TYPE == "soft" ]; then
  echo "${CYAN}* * * * *"
  echo "🍦  Soft-Deploy"
  echo "* * * * *${NO_COLOR}"

  git stash
  git checkout integration
  git pull

  source fastlane/.env.$APP_ENV
  mv src/environment/index.js src/environment/index.js.bak
  cp src/environment/index.$APP_ENV.js src/environment/index.js

  LAST_GIT_COMMIT=$(git log HEAD --pretty=format:"%h : %s" -1)
  read -e -p "What's the changelog? (leave empty for \"$LAST_GIT_COMMIT\") " INPUT_CHANGELOG
  MESSAGE="${INPUT_CHANGELOG:-$LAST_GIT_COMMIT}"
  echo "${CYAN}Deploying Commit : $MESSAGE${NO_COLOR}"

  yarn

  if [ $APP_ENV == "production" ]; then
    echo "- - - - -"
    echo "️️️⚠️  No Codepush for Production yet"
    echo "- - - - -"
  else
    if [[ $APP_OS != "android" ]]; then
      echo "${GREEN}- - - - -"
      echo "Codepush 🍎  iOS Staging"
      echo "- - - - -${NO_COLOR}"
      appcenter codepush release-react -d Staging -a <owner>/<MyApp>-iOS -m --target-binary-version $IOS_VERSION --description "$MESSAGE"
    fi
    if [[ $APP_OS != "ios" ]]; then
      echo "${YELLOW}- - - - -"
      echo "Codepush 🤖  Android Staging"
      echo "- - - - -${NO_COLOR}"
      appcenter codepush release-react -d Staging -a <owner>/<MyApp>-Android -m --target-binary-version $ANDROID_VERSION_NAME --description "$MESSAGE"
    fi
  fi

  mv src/environment/index.js.bak src/environment/index.js

fi
