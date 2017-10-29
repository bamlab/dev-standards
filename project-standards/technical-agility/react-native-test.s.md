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
export default (state = {}, action) => {
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
export function* getFavoriteBooksByTypeSaga(action) {
  const userId = yield select(userIdSelector);
  const books = yield call(getFavoriteBookByType(userId, action.payload.type));
  yield put(setFavoritesBooks(books, type));
}

export default function*() {
  yield takeEvery('GET_FAVORITE_BOOKS_BY_TYPE', getFavoriteBooksByTypeSaga);
}

// Test
import { getFavoriteBooksByTypeSaga} from './sagas';
import { testSaga } from 'redux-saga-test-plan';

const favoriteCrimeBooks = [{
    title: 'The Truth About the Harry Quebert Affair',
    author: 'Joël Dicker'
  }, {
    title: 'Pars vite et reviens tard',
    author: 'Fred Vargas',
  }];

describe('getFavoriteBooksByTypeSaga', () => {
  it('should get user favorite books and store them', () => {
    testSaga(getFavoriteBooksByTypeSaga, {
      type: 'GET_FAVORITE_BOOKS_BY_TYPE',
      payload: { type: 'crime' },
    })
      .next()
      .select(userIdSelector)
      .next(1)
      .call(getFavoriteBookByType, 1, 'crime')
      .next(favoriteCrimeBooks)
      .put(setFavoritesBooks(favoriteCrimeBooks))
      .next()
      .isDone();
  });
});
```

- The effect of  a saga on the state

```javascript
// Test
import reducer from '../reducer';

it('should set the favorite books by type in the store', () => {
    const expectedState = {
      books: {
        favorite: {
          crime: favoriteCrimeBooks,
        },
      },
    }
    });
    return expectSaga(getFavoriteBooksByTypeSaga, {
      type: 'GET_FAVORITE_BOOKS_BY_TYPE',
      payload: { type: 'crime' },
    })
      .withReducer(reducer)
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
- The services
```javascript
// FormatService.spec.js
// The service formats a phone number
import FormatService from './normalization';

describe('FormatService', () => {
  describe('formatPhone', () => {
    it('should return undefined if the value is undefined', () => {
      expect(FormatService.formatPhone('12')).to.equal('12');
    });
    it('should return only numbers if length < 3', () => {
      expect(FormatService.formatPhone('12')).to.equal('12');
    });
    it('should return 3 numbers and a hyphen if length = 3', () => {
      expect(FormatService.formatPhone('123')).to.equal('123');
    });
    it('should return 3 numbers, a hyphen and numbers if 3 <= length < 6', () => {
      expect(FormatService.formatPhone('12345')).to.equal('123-45');
    });
    it('should return 3 numbers, a hyphen, 3 numbers and a hyphen if length = 6', () => {
      expect(FormatService.formatPhone('123456')).to.equal('123-456');
    });
    it('should return 3 numbers, a hyphen, 3 numbers and a hyphen and numbers if 6 < length <= 10', () => {
      expect(FormatService.formatPhone('12345678')).to.equal('123-456-78');
    });
    it('should return only 10 digits even if the number has more than 10 digits', () => {
      expect(FormatService.formatPhone('123456789012')).to.equal('123-456-789012');
    });
  });
});

```