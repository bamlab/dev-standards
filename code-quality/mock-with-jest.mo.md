# [MO] How to use mocks with jest (~2minutes)

## Owner: [Pierre-Louis Le Portz](https://github.com/pleportz)

## Why

Most teams at BAM use jest for testing their react components or services. **One of the most frequent andon is about mocks.**

Typical use cases:
- *"My component's snapshot test was passing but then I imported a module and now the test is broken :'("*
- *"I do not want my test to actually do API calls with the new module I just installed"*

## Prerequisites

Have jest installed

## Steps

In this MO you will learn to:
- mock some method on an imported module
- define a centralized mock to be used in all tests
- mock an imported component
- mock a class that is used for both rendering a component AND using static methods

## Example 1: mock some method on an imported module (generic example)

**File to be tested:**

```javascript
import someModule from 'some-module';

export const doStuff = someInteger => {
  const intermediaryResult = someModule.someMethod(someInteger);
  const finalResult = intermediaryResult / 21;
  return finalResult;
};
```

**Test file:**

```javascript
import { doStuff } from './doStuff.js';

jest.mock('some-module', () => ({
  someMethod: someInteger => 42,
}));

describe('doStuff', () => {
  it('returns 2 if input is 1', () => {
    expect(doStuff(1)).toEqual(2);
  });
});
```

## Example 2: define a centralized mock to be used in all tests

**File to be tested:**

```javascript
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Permissions from 'react-native-permissions';

const checkPushNotifsPermission = () => {
  return Permissions.check('notification').then(status => {
    // do something depending on status
  });
};

export default class Home extends PureComponent {
  // do something with checkPushNotifsPermission ...
  render() {
    return (
      <View>
        // render something...
      </View>
    );
  }
}
```

**Centralized mock**

In this example we are mocking a native module (`react-native-permissions`). Since you always need to mock a native module, **you should centralize the mock definition in order to avoid redefining it in numerous test files**:

 ```javascript
 //project_root/__mocks__/react-native-permissions.js

 export default {
   check: _ => Promise.resolve('authorized'),
 };
 ```

**Test file with snapshot test:**

```javascript

import React from 'react';
import renderer from 'react-test-renderer';
import { Home } from './Home';

// no need to define the mock here

describe('<Home />', () => {
  it('renders correctly', () => {
    const props = {
      // props to give to the Home component
    };
    const tree = renderer.create(<Home {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
```

## Example 3: Mock one of your own components

*In the example below, we chose to mock the Votes component when we added a container with graphql logic around the original Votes component*

**File to be tested:**

```javascript
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Votes } from '../../components/Votes/Votes.container'

export default class Recipe extends PureComponent {
  render() {
    return (
      <View>
        // render things and then use:
        <Votes />
      </View>
    );
  }
}
```

**Test file with snapshot test:**

```javascript
import React from 'react';
import renderer from 'react-test-renderer';
import Recipe from './Recipe';

jest.mock('../../components/Votes/Votes.container', () => props => <votes {...props} />);

  // Here we use <votes {...props} /> WITHOUT a capital letter

describe('<Recipe />', () => {
  it('renders correctly', () => {
    const props = {
      // props to give to the Recipe component
    };
    const tree = renderer.create(<Recipe {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
```

## Example 4: Mock a class that is used for both rendering a component AND using static methods

In the example below we use the `react-rte/lib/RichTextEditor` module to build our own state-controlled markdown input component.


**File to be tested:**

```javascript
import React, { Component } from 'react';
import RichTextEditor from 'react-rte/lib/RichTextEditor';

export default class MarkdownInput extends Component{

  // use RichTextEditor.createValueFromString() and RichTextEditor.createEmptyValue() in some lifecycle methods

  render() {
    return <RichTextEditor
      //pass some props
      />;
  }
}
```

**jest mock:**

```javascript
jest.mock('react-rte/lib/RichTextEditor', () => {
  const RichTextEditor = props => <richTextEditor {...props} />;
  RichTextEditor.createValueFromString = string => ({ content: string });
  RichTextEditor.createEmptyValue = () => ({ content: '' });
  return RichTextEditor;
});
```
