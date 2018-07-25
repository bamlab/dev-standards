# [MO] How to use mocks with jest (~2minutes)

## Owner: [Pierre-Louis Le Portz](https://github.com/pleportz)

## Why

Most teams at BAM use jest for testing their react components. **One of the most frequent andon is about mocks.**

Typical use case:
*"My component's snapshot test was passing but then I imported a module and now the test is broken :'("*

## Prerequisites

Have jest installed ;)

## Steps

In this MO you will learn to:
- mock some method on an imported module
- mock an imported component
- mock a class that is used for both rendering a component AND using static methods

## Example 1: mock some method on an imported module

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

**Test file with snapshot test:**

```javascript

import React from 'react';
import renderer from 'react-test-renderer';
import { Home } from './Home';

jest.mock('react-native-permissions', () => ({
  check: _ => Promise.resolve(true),
}));

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

**Even better**

In the example above we are mocking a native module (`react-native-permissions`). Since you always need to mock a native module, **you should centralize the mock definition in order to avoid redefining it in numerous test files**. Here is how to do it:

 ```javascript
 //project_root/__mocks__/react-native-permissions.js

 jest.mock('react-native-permissions', () => ({
   check: _ => Promise.resolve(true),
 }));
 ```

## Example 2: Mock one of your own components

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

## Example 3: Mock a class that is used for both rendering a component AND using static methods

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

**Centralized mock (see Example 1, section "Even better"):**

```javascript
jest.mock('path_from_root_to_node_modules/node_modules/react-rte/lib/RichTextEditor', () => {
  const RichTextEditor = props => <richTextEditor {...props} />;
  RichTextEditor.createValueFromString = string => ({ content: string });
  RichTextEditor.createEmptyValue = () => ({ content: '' });
  return RichTextEditor;
});
```
