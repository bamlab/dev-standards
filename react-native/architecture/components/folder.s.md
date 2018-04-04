# [Standard] Components folder

## Checks:

- Should contain a [`index.js`](./index.s.md) file

  > **Why?:** This allows importing the components library through a single import like this `import { MyComponent1, MyComponent2 } from 'myProject-components'`

- Should only export components (no service or container)

  > **Why?:** Think of this for reusability. A container is linked to the project's context and cannot be used without the store. Components in the *component* folder should be extractable without outside dependencies.

- Should contain components either through files or [folders](./component/component.folder.s.md)
