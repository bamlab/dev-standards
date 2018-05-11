# \[Standard\] Test files indentation

## Owner: [Pierre-Louis Le Portz](https://github.com/pleportz)

## Why

Standardizing the indentation of a test file saves the developer 30 seconds per new function to test.

## Checks

There are 2 cases:

### Case 1: The tested file exports at least 1 named function

Use the following indentation even if only one function is tested:

* 1 `describe` per file
  * 1 `describe` per function
  * 1 `it` for each case

### Case 2: The tested file exports only 1 function or element as `default`

Use the following indentation:

* 1 `describe` with the name of the file
  * 1 `it` for each functionality

## Good examples

### Case 1: Generic example

```javascript
describe('Name of the tested file', () => {
  describe('function1', () => {
    it('does something', () => {
      //...
    });
    it('does some other thing', () => {
      //...
    });
  });

  describe('function2', () => {
    it('does something', () => {
      //...
    });
    it('does some other thing', () => {
      //...
    });
  });
});
```

### Case 1: A saga test with redux-saga-test-plan

```javascript
import { testSaga } from 'redux-saga-test-plan';
import { buyRoamingPackage, fetchRoamingBundlesSaga } from './sagas';
import { selectedRoamingPackageSelector } from '../../TopUps/Bundle/selectors';
import { setLoading } from '../../LoadingStatus/actions';

describe('sagas', () => {
  describe('buyRoamingPackage', () => {
    it('initializes the product and buy it', () => {
      const roamingPackage = { ouid: '4' };
      testSaga(buyRoamingPackage, { type: 'BUY_ROAMING_PACKAGE' })
        .next()
        .select(selectedRoamingPackageSelector)
        // ...
        .isDone();
    });
  });

  describe('fetchRoamingBundlesSaga', () => {
    it('fetches the roaming bundles and store them', () => {
      testSaga(fetchRoamingBundlesSaga, {
        type: 'FETCH_ROAMING_BUNDLES',
      })
        .next()
        .put(setLoading('roamingOffer', true))
        // ...
        .isDone();
    });
  });
});
```

### Case 2: A react-native component

```javascript
import React from 'react';
import IdentityRequirements from './IdentityRequirements';
import renderer from 'react-test-renderer';

describe('<IdentityRequirements />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<IdentityRequirements />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
```

## Bad examples // @TODO

