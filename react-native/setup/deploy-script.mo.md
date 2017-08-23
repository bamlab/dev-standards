# [MO] Add a deploy script to your app *(~20min)*

## Owner: [Xavier Lefèvre](https://github.com/xavierlefevre)

## Description
- With one command, deploy with codepush or fastlane, android and/or ios, on the specified environment!

## Steps
- Copy paste [deploy.sh](/react-native/setup/deploy.sh) to your project
- Add a deploy command to your `package.json`:
```json
{
  "scripts": {
    "deploy": "./<where_you_put_the_file>/deploy.sh",
    ...
  }
}
```
- Adapt the script to your fastlane and codepush implementation
- Deploy (depending on your implementation):
```bash
yarn deploy -- -t <default: soft / hard> -o <default: all / ios / android> -e <default: staging / production>
```
