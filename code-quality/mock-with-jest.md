# [Standard] How to use mocks with jest

## Owner: [Pierre-Louis Le Portz](https://github.com/pleportz)

## Why

Most teams at BAM use jest for testing their react components. **One of the most frequent andon is about mocks.**

Typical use case:
*"My component's snapshot test was passing but then I imported a module and now the test is broken :'("*

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
        // render something and use Votes component...
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
