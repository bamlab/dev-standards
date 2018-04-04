# [Standard] Components Folder - Component index file

## Checks:

- A component folder should contain an `index.js` file exporting the component file

  > **Why?:** This allows importing the folder with `import MyComponent from './MyComponent` instead of `import MyComponent from ./MyComponent/Mycomponent.component.js`. This also simplifies refactoring.
