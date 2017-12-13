# [Standard] Test files indentation

## Owner: [Pierre-Louis Le Portz](https://github.com/pleportz)

## Why

Standardizing the indentation of a test file saves the developer 30 seconds per new function to test.

## Checks

The test file must have the following indentation even if only one function is tested:

``` javascript
describe('Name of the tested file', () => {
  describe('function1', () => {
    it('should do something', () => {
      //...
    });
    it('should do some other thing', () => {
      //...
    });
  });

  describe('function2', () => {
    it('should do something', () => {
      //...
    });
  });
});
```

## Bad Examples

// @TODO

## Good examples

### A saga test with redux-saga-test-plan

```javascript
import { testSaga } from 'redux-saga-test-plan';
import { buyRoamingPackage, fetchRoamingBundlesSaga } from './sagas';
import { selectedRoamingPackageSelector } from '../../TopUps/Bundle/selectors';
import { setLoading } from '../../LoadingStatus/actions';

describe('sagas', () => {
  describe('buyRoamingPackage', () => {
    it('should initialize the product and buy it', () => {
      const roamingPackage = { ouid: '4' };
      testSaga(buyRoamingPackage, { type: 'BUY_ROAMING_PACKAGE' })
        .next()
        .select(selectedRoamingPackageSelector)
        // ...
        .isDone();
    });
  });

  describe('fetchRoamingBundlesSaga', () => {
    it('should fetch the roaming bundles and store them', () => {
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
