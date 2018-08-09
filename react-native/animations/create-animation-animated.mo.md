# [Standard] React Native animations

## Owner: [Louis Lagrange](https://github.com/Minishlink)

## Why

See [why](https://github.com/bamlab/animations/blob/master/why.md).

## Checks

- In order to improve how we create animations, please send a quick message to the owner "Hey it's <ME>, I'm going to make an animation on <PROJECT>"
- Creating an animation should not take more than half a day of design and development time. If it takes more, andon the owner who will help you or find someone to help you
- I know of the resources that can help me:
  - similar animations that BAM made previously with the [catalog](link available on M33 standard): this can help me showcase examples for my PO, estimate the time needed for the design and the development, and find a technical strategy for my animation
  - the tools that are available in order to create a React Native animation with [this table](https://github.com/bamlab/animations/blob/master/matrix.md)
  - the [official guide](https://facebook.github.io/react-native/docs/animations) on animations
- If I use `Animated`:
  - I make sure to use the parameter `useNativeDriver` in `Animated.timing`, `Animated.spring`, `Animated.decay` and `Animated.event` (see [React Native performance](../../performance/front/react-native-performance.s.md))
  - I only use `Animated.interpolate` on styles of type `opacity` or `transform` (necessary for `useNativeDriver`)
- If I use any third party library, I look at the documentation and/or code, and if a `useNativeDriver` prop exists, I use it
- When my animation is finished, I make a GIF (with [Kap](https://getkap.co/): `brew cask install kap`) of it and add it to the catalog [here](https://github.com/bamlab/animations/blob/master/catalog.md) (10 min)

## Good examples

> Please andon and/or create an issue if you need one!

## Bad examples

> Please andon and/or create an issue if you need one!
