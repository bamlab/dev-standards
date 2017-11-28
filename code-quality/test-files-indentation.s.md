# [Standard] Test files indentation

## Owner: [Pierre-Louis Le Portz](https://github.com/pleportz)

## Why

Standardizing the indentation of a test file saves the developer 30 seconds per new function to test.

## Checks

The test file must have the following indentation even if only one function is tested:

``` javascript
describe('Name of the tested file', () => {
  describe('function1', () => {
    it('should do someting correctly', () => {
      //...
    });
    it('should do some other thing correctly', () => {
      //...
    });
  });

  describe('function2', () => {
    it('should do someting correctly', () => {
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
import { tripica } from '../../../api';
import { addTopUpToSelection, initTopUp, topUpUsages } from '../../TopUps/actions';
import { selectedRoamingPackageSelector } from '../../TopUps/Bundle/selectors';
import { setRoamingBundles } from '../../TopUps/Bundle';
import { setLoading } from '../../LoadingStatus/actions';

describe('sagas', () => {
  describe('buyRoamingPackage', () => {
    it('should initialize the top up and buy it', () => {
      const roamingPackage = { ouid: '4' };
      testSaga(buyRoamingPackage, { type: 'BUY_ROAMING_PACKAGE' })
        .next()
        .select(selectedRoamingPackageSelector)
        .next(roamingPackage)
        .put(initTopUp())
        .next()
        .put(addTopUpToSelection(roamingPackage))
        .next()
        .put(topUpUsages())
        .next()
        .isDone();
    });
  });

  describe('fetchRoamingBundlesSaga', () => {
    it('should get the roaming bundles and store them', () => {
      const mockBundles = {
        ROAMING_G4: {
          characteristics: {},
          name: 'TYROAMINGG4',
          ouid: '800D5B881DB041590527285D43993D26',
          periodicity: {
            number: 0,
          },
          price: 3800,
        },
      };
      testSaga(fetchRoamingBundlesSaga, {
        type: 'FETCH_ROAMING_BUNDLES',
      })
        .next()
        .put(setLoading('roamingOffer', true))
        .next()
        .call([tripica, 'getRoamingBundle'])
        .next(mockBundles)
        .put(setRoamingBundles(mockBundles))
        .next()
        .put(setLoading('roamingOffer', false))
        .next()
        .isDone();
    });
  });
});
```
