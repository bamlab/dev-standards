# [MO] How to investigate front-end performance

## Owner: [Louis Lagrange](https://github.com/Minishlink)

## Why

Sometimes, standards are not enough, or you're not applying them, resulting in performance bottlenecks.

## Steps

Proceed by dichotomy: cut your app in multiple pieces in order to find out where the problem comes from. For example, literally remove some components or pages!

### Profile

Measure the performance with the following tools. They're ordered by `simplicity` \* `perspectives of learnings`.

- Put some `console.count('my component')` in your components' render methods in order to measure the number of renders
- In app Performance monitor (CMD+D on iOS, CTRL+M on Android; and select Performance monitor)
- Network profiler => if some calls are too long, investigate backend performance (TODO link to backend performance standard)
- [React.unstable_Profiler](https://medium.com/@dave_lunny/how-to-use-reacts-experimental-new-profiler-feature-c340674e5d0e)
- Close React Native Debugger and open the Chrome debugger. Click on the performance tab and hit record to start profiling the performance of your application. See [this article](https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad) to learn how to read the output.
- Native tools (Android Studio, XCode)
- https://facebook.github.io/react-native/docs/performance.html#profiling
- Inspect the JS<->native bridge with [RN-Snoopy](https://github.com/jondot/rn-snoopy)

## Useful links

- React Native doc: https://facebook.github.io/react-native/docs/performance.html
- Example commit: https://github.com/Minishlink/DailyScrum/commit/3c6d5f70a638a146f1a2158b94292010eb12186a
