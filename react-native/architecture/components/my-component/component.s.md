# [Standard] Components folder - Component file

## Checks:

- The file name should be `MyComponent.style.js`
- Exports the component class by default

  > **Why?:** Linked to code splitting and single responsability. Facilitates code testing.

- Contains a unique `render()`

  > **Why?:** Multiple renders imply multiple components

- Is business logic free

  > **Why?:** Think of a component
