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
1) A reducer and its test (~2min):
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

A selector and its test (~2min):
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

2) A saga and the test of the order execution:

``` javascript
// Saga
export function* cancelPlan(action) {
  const uuidPlan = yield select(nextPlanUuidSelector);
  try {
    yield call([myAPI, 'deletePlanByUuid'], uuidPlan);
    const subscription = yield select(subscriptionSelector);
    yield put(fetchNextPlan(subscription));
  } catch (e) {
    yield put(cancelPlanFailure())
  }
}

export default function*() {
  yield takeEvery('CANCEL_PLAN_REQUEST', cancelPlan);
}

// Test
describe('cancelPlan saga', () => {
  describe('Success case', () => {
    const action = {
      type: 'CANCEL_PLAN_REQUEST',
    };
    const saga = cancelPlan(action);

    it('should select nextPlanUuidSelector', () => {
      expect(saga.next().value).toEqual(select(nextPlanUuidSelector));
    });
    it('should call deletePlanByUuid', () => {
      expect(saga.next('1234').value).toEqual(call([myAPI, 'deletePlanByUuid'], '1234'));
    });
    it('should select subscriptionSelector', () => {
      expect(saga.next().value).toEqual(select(subscriptionSelector));
    });
    it('should select put fetchNextPlan', () => {
      const subscription = {
        data: Map({
          daysLeft: 15,
          nextRenewalDate: '1504796837',
        }),
      };
      expect(saga.next(subscription).value).toHaveProperty('PUT');
    });
  });

  describe('Failure case', () => {
    const action = {
      type: 'CANCEL_PLAN_REQUEST',
    };
    const saga = cancelPlan(action);

    it('should select nextPlanUuidSelector', () => {
      expect(saga.next().value).toEqual(select(nextPlanUuidSelector));
    });
    it('should call deletePlanByUuid', () => {
      expect(saga.next('1234').value).toEqual(call([tripica, 'deletePlanByUuid'], '1234'));
    });
    it('should dispatch cancelPlanFailure if API call failed', () => {
      expect(saga.next(new Error('fetch API failed')).value).toEqual(put(cancelPlanFailure));
    });
  });
});
```