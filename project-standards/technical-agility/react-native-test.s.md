# [Standard] My React Native Project is correctly tested

## Owner: [Aurore Malherbes](https://github.com/aurorem)

## Description
- Writing tests helps the technical team to :
  - Architecture its code
  - Develop faster
  - Prevent bugs
  - Document the code

## Impact
- A lack of tests will put in jeopardy the 4 points listed above.

## Checks
My React Native app is well tested if :
  - 1) The reducers and selectors are tested. It helps to develop faster.
  - 2) The sagas, order of execution and effects on the state are tested. It prevents regressions as they hold the business logic of the app.
  - 3) The props existence of the containers and presentional components are checked. It helps to develop faster by reducing the number of manual testings.
  - 4) The presentational components are tested with a snapshot. It avoids UI regression.
  - 5) The services are tested. It helps to decouple the code.


## Bad Examples
*TBD*

## Good Examples
1.
- Reducer (~2min):
``` javascript
// Reducer
export default (state, action) => {
  switch (action.type) {
    case 'SIGNUP_SET_SIM_CARD_NUMBER':
      return {
        ...state,
        SIMSerialNumber: action.payload.SIMSerialNumber,
      };
    default:
      return state;
  }
};

//Test
it('should set the SIM card number', () => {
  const action = {
    type: 'SIGNUP_SET_SIM_CARD_NUMBER',
    payload: {
      SIMSerialNumber: '89101214',
    },
  };
  const nextState = reducer(initialState, action);
  expect(nextState.SIMSerialNumber).toEqual('89101214');
});
```

- Selector (~2min):
``` javascript
// Selector
export const SIMSerialNumberSelector = state => state.signUp.simCardScan.SIMSerialNumber;

//Test
it('should select the SIM card number', () => {
  const state = {
    signUp: {
      simCardScan: {
        SIMSerialNumber: '1234',
      },
    },
  };
  expect(SIMSerialNumberSelector(state)).toEqual('1234');
});
```

2.
- The execution order of a saga

``` javascript
// Saga
export function* selectSubscriptionDuringActivateSaga(action) {
  yield put(selectSubscription(action.payload.subscription));
  yield call(initNewOfferWithSelectedSubscription);
  yield call(goToNextActivationPage);
}

export default function*() {
  yield takeEvery('SIGNUP_SELECT_SUBSCRIPTION_DURING_ACTIVATE', selectSubscriptionDuringActivateSaga);
}

// Test
import { selectSubscriptionDuringActivateSaga } from './sagas';
import { testSaga } from 'redux-saga-test-plan';

describe('selectSubscriptionDuringActivateSaga', () => {
  it('should select subscription and go to the next page', () => {
    testSaga(selectSubscriptionDuringActivateSaga, {
      type: 'SIGNUP_SELECT_SUBSCRIPTION_DURING_ACTIVATE',
      payload: { subscription: { ouid: 'ouidSubscription' } },
    })
      .next()
      .put(selectSubscription({ ouid: 'ouidSubscription' }))
      .next()
      .call(initNewOfferWithSelectedSubscription)
      .next()
      .call(goToNextActivationPage)
      .next()
      .isDone();
  });
});
```

- The effect of  a saga on the state

```javascript
// Saga
export function* confirmPersonalInfo(action) {
  let customer = fromJS(action.payload);
  const sameAddresses = customer.get('billingAddress').equals(customer.get('idAddress'));

  customer = customer.setIn(['idAddress', 'country'], customer.get('nationality'));
  if (action.meta.useAddressAsBilling) {
    customer = customer.set('billingAddress', customer.get('idAddress'));
  } else if (sameAddresses) {
    customer = customer.set('billingAddress', new Map());
  }
  const birthdate = customer.get('birthdate') ? moment(customer.get('birthdate'), I18n.t('dateFormat')).valueOf() : '';
  customer = customer.set('birthdate', birthdate);

  try {
    yield put(setPersonalInfo(customer.toJS()));
    yield put(NavigationActions.navigate({ routeName: 'selfieCheck' }));
  } catch (e) {
    console.warn('[saga] confirmPersonalInfo', e);
    HandleErrorService.showToastError(e);
  }
}

// Test
it('should set the personal infos in the store', () => {
    const action = {
      type: 'SIGNUP_CONFIRM_PERSONAL_INFO',
      payload,
    };
    const expectedState = Map({
      fetching: true,
      failure: false,
      toRefresh: true,
      refreshing: false,
      data: Map({
        ouid: '569C3BBD0C238FB43B804DEE3B865C2A',
        gender: 'MALE',
        birthdate: -324352800000,
        billingAddress: Map({
          street1: '19 JALAN S…',
          postCode: '47300',
          city: 'PETALING J…',
          country: 'MYS',
        }),
        idAddress: Map({
          street1: '19 JALAN S…',
          postCode: '47300',
          city: 'PETALING J…',
          country: 'MYS',
        }),
        fullName: 'SOMANATHAN A/L K.C.A MENON',
        nationality: 'MYS',
      }),
    });
    return expectSaga(confirmPersonalInfo, action)
      .withReducer(customerReducer)
      .run()
      .then(result => expect(result.storeState).toEqual(expectedState));
  });
```

3.
*TO DO : Regarder flow-typed*
- The props presence of a presentational component

``` javascript
// ChoosePlan.js
import type { NavigationScreenProp } from 'react-navigation';
type Props = NavigationScreenProp & DispatchProps & StateProps;

export type DispatchProps = {
  clearChoosenPhoneNumber: Function,
};

export type StateProps = {
  newOfferPrice: number,
  newOfferPeriodicity: Object,
  isFreeSimPathAvailable: boolean,
  isOfferValid?: boolean,
};
```

- The props presence of the container component
``` javascript
// ChoosePlan.container.js
import type { DispatchProps, StateProps } from './ChoosePlan';

const mapDispatchToProps: DispatchProps = {
  clearChoosenPhoneNumber,
};

const mapStateToProps = (state: StateType): StateProps => ({
  newOfferPrice: newOfferPriceSelector(state),
  newOfferPeriodicity: newOfferPeriodicitySelector(state),
  isFreeSimPathAvailable: true,
  isOfferValid: isNewOfferValidSelector(state),
});

```

4.
- The UI of a component
``` javascript
import 'react-native';
import React from 'react';
import PendingDeliveryPanel from './PendingDeliveryPanel';
import renderer from 'react-test-renderer';

describe('<PendingDeliveryPanel />', () => {
  const deliveryResource = {
    deliveryAddress: {
      street1: '1 rue du Paradis',
      postCode: '56000',
      city: 'Vannes',
      region: 'Bretagne',
      deliveryInstructions: 'Sonnez !',
      status: 'inPreparation',
    },
    deliveryMethod: {
      id: 'PREMIUM_DELIVERY',
      price: 70,
    },
  };
  it('renders correctly with "inPreparation" as a deliveryStatus', () => {
    const tree = renderer.create(<PendingDeliveryPanel navigation={() => {}} deliveryResource={deliveryResource} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders correctly with "shipped" as a deliveryStatus', () => {
    deliveryResource.status = 'shipped';
    deliveryResource.trackingLink = 'http://tracking-link.com';
    const tree = renderer.create(<PendingDeliveryPanel navigation={() => {}} deliveryResource={deliveryResource} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders correctly with "delivered" as a deliveryStatus', () => {
    deliveryResource.status = 'delivered';
    deliveryResource.trackingLink = 'http://tracking-link.com';
    const tree = renderer.create(<PendingDeliveryPanel navigation={() => {}} deliveryResource={deliveryResource} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

```

5.
- The service are tested
```javascript
// FormatService.spec.js
// The service formats a phone number
import FormatService from './normalization';

describe('FormatService', () => {
  describe('formatPhone', () => {
    it('should return only numbers if length < 3', () => {
      expect(FormatService.formatPhone('12')).to.equal('12');
    });
    it('should return 3 numbers and an hyphen if length = 3', () => {
      expect(FormatService.formatPhone('123')).to.equal('123');
    });
    it('should return 3 numbers, an hyphen and numbers if 3 <= length < 6', () => {
      expect(FormatService.formatPhone('12345')).to.equal('123-45');
    });
    it('should return 3 numbers, an hyphen, 3 numbers and an hyphen if length = 6', () => {
      expect(FormatService.formatPhone('123456')).to.equal('123-456');
    });
    it('should return 3 numbers, an hyphen, 3 numbers and an hyphen and numbers if 6 < length <= 10', () => {
      expect(FormatService.formatPhone('12345678')).to.equal('123-456-78');
    });
    it('should return only 10 digits even if the number has more than 10 digits', () => {
      expect(FormatService.formatPhone('123456789012')).to.equal('123-456-789012');
    });
  });
});

```