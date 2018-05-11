# \[MO\] Test your React and React Native components' state with Jest \(without Enzyme\)

## Owner: [Tycho Tatitscheff](https://github.com/tychota)

## Prerequisites _\(~5 min\)_

* [ ] Have [Jest](https://facebook.github.io/jest/) installed
* [ ] On React, follow the Jest [documentation](https://facebook.github.io/jest/docs/en/tutorial-react.html#content)
* [ ] On React Native, it's already done \(if needed, jest [doc](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#content)\)

## Steps _\(~30 min\)_

* Create a simple test:

  ```javascript
  describe('ComponentToTest', () => {
  it('should test a simple true === true', () => {
    expect(true).toBe(true);
  });
  });
  ```

* Import the necessary packages and your component:

  \`\`\`javascript

  import React from 'react';

  import renderer from 'react-test-renderer';

import ComponentToTest from './ComponentToTest.component';

```text
- Add the first test of your component, and remove the true === true
  - Render your component with react-test-renderer, it will transform your component in a JavaScript object instance, which you will be able to test, accessing its state, triggering its methods:
  ```javascript
  describe('ComponentToTest', () => {
    const props = {};

    const component = renderer.create(
      <ComponentToTest
        props={props}
      />
    );
    //...
  });
```

* Use this instance in your `it` test, the property `getInstance()` allows you to access all the properties of the component class. Now you can test your initial state:

  ```javascript
  describe('ComponentToTest', () => {
  // ...
  it('should init the state', () => {
    expect(component.getInstance().state).toEqual({
      fakeStatus: 'init',
    });
  });
  });
  ```

  * Add new tests, faking a user action and the impact it has on the component state:

    ```javascript
    describe('ComponentToTest', () => {
    // ...
    it('should set the component fakeStatus to "inProgress"', () => {
    component.getInstance().onButtonPress();
    expect(component.getInstance().state).toEqual({
    fakeStatus: 'inProgress',
    });
    });
    // ...
    });
    ```

