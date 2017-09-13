# [Standard] Components folder - Index.js

## Checks:
- The file should export through `module.exports`
- The file should export an object with a getter for each component

  > **How?:**
  > ```
  > get MyComponent() {
  >   return require('./MyComponent').default;
  > },
  > ```

  > **Why?:** This forces component modules to be imported only upon usage and prevents circular imports

## Example:

```
module.exports = {
  get Button() {
    return require('./Button').default;
  },
};
```
