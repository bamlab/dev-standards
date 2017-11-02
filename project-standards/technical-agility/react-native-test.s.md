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

  1. The reducers and selectors are tested. It helps to develop faster by reducing the number of manual testings. Furthermore it helps you to not forget edge cases.
  1. The sagas, order of execution and effects on the state are tested, when the logic is not straight-forward. It prevents regressions as they hold the business logic of the app.
  1. The props existence are tested in both containers and presentational components to ensure it's consistent. It helps to develop faster by reducing the number of manual testings.
  1. The presentational components are tested with a snapshot. It avoids UI regression and save time when you make a change as you don't have to check all the app manually.
  1. The services are tested. It helps to not forget edge cases.

## Bad Examples

// @TODO

## Good Examples

In these examples we use `jest`, `redux-saga-test-plan` and `flow`.

Here is the MO to write each kind of test.

### Reducer (~2min)

The reducer you want to test is the following:

``` javascript
// Reducer
const initialState = {
  user: {},
  books: {
    favorite: {},
    read: {},
    toRead: {}
  }
};
export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
      };
    default:
      return state;
  }
};
```

And the tests you will write are these ones:

```javascript
//Test
it('should have no user info by default', () => {
  const nextState = reducer(initialState, {});
  expect(nextState.user).toEqual({})
});

it('should set the user info', () => {
  const action = {
    type: 'SET_USER_INFO',
    payload: {
      id: 1,
      name: 'Donald',
    },
  };
  const nextState = reducer(initialState, action);
  expect(nextState.user).toEqual({
    id: 1,
    name: 'Donald',
  })
});
```

 > **KEY POINT**: The first test is important, it allows you to check that only the 'SET_USER_INFO' action has an action on the user part of the state.

### Selector (~2min)

Here is the selector you want to test:

```javascript
// Selector
export const userIdSelector = state => state.user.id;
```

And the corresponding test:

```javascript
//Test
it('should select the user Id', () => {
  const state = {
    user: {
      id: 1,
    },
  };
  expect(userIdSelector(state)).toEqual(1);
});
```

### Sagas ( ~5 -> ~15 min)

Here is a saga you want to test. It makes an API call to get the user favorites books by type:

``` javascript
// Saga
export function* getFavoriteBooksByTypeSaga(action) {
  const userId = yield select(userIdSelector);
  const books = yield call(getFavoriteBookByTypeCall, userId, action.payload.type);
  yield put(setFavoritesBooks(books, action.payload.type));
}

export default function*() {
  yield takeEvery('GET_FAVORITE_BOOKS_BY_TYPE', getFavoriteBooksByTypeSaga);
}
```

First, let's test the order of execution.
NB: You're not supposed the order of execution of all your sagas, but only the one with complex logic (loop, conditions, ...).

Nevertheless, for a learning purpose, we write the test for `getFavoriteBooksByTypeSaga`:

```javascript
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

> **KEY POINT**: The test ensure that your saga has no side-effect.

A more interesting test to do is to test the saga effect on the state:

```javascript
// Test
import reducer from '../reducer';

it('should set the favorite books by type in the store', () => {
  const initialState = {
    user: {
      id: 1,
    },
    books: {
      favorite: {},
    },
  };
  const expectedState = {
    user: {
      id: 1,
    },
    books: {
      favorite: {
        crime: favoriteCrimeBooks,
      },
    },
  };
  return expectSaga(getFavoriteBooksByTypeSaga, {
    type: 'GET_FAVORITE_BOOKS_BY_TYPE',
    payload: { type: 'crime' },
  })
    .withReducer(reducer, initialState)
    .provide([
      [select(userIdSelector), 1],
      [matchers.call.fn(getFavoriteBookByTypeCall, 1, 'crime'), favoriteCrimeBooks],
    ])
    .run()
    .then(result => expect(result.storeState).toEqual(expectedState));
});
```

### The props presence of a presentational component and a container (~ 5min)

Here are the presentational component and the corresponding container we want to test:

``` javascript
// BookView.js - component
import type { NavigationScreenProp } from 'react-navigation';
type Props = NavigationScreenProp & DispatchProps & StateProps;

export type DispatchProps = {
  setBookAsFavorite: Function,
};

export type StateProps = {
  title: string,
  author: string,
  publicationDate?: Date,
  isFavorite: boolean,
};

// BookView.container.js - container
import type { DispatchProps, StateProps } from './ChoosePlan';

const mapDispatchToProps: DispatchProps = {
  setBookAsFavorite,
};

const mapStateToProps = (state: StateType): StateProps => ({
  title: bookTitleSelector(state),
  author: bookAuthorSelector(state),
  publicationDate: bookPublicationDateSelector(state),
  isFavorite: isFavoriteBookSelector(state),
});
```

> **KEY POINT**: Use `flow` to write this kind of test.

### The UI of a component (~5 min)

Let's say we want to take a snapshot of the `BookView` component of the previous part:

``` javascript
import 'react-native';
import React from 'react';
import BookView from './BookView';
import renderer from 'react-test-renderer';

describe('<BookView />', () => {
  it('renders correctly when the book is not a favorite one', () => {
    const tree = renderer.create(<BookView
      navigation={() => {}}
      setBookAsFavorite={() => {}}
      title={'Antigone'}
      author={'Jean Anouilh'}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders correctly when the book is a favorite one', () => {
    const tree = renderer.create(<BookView
      navigation={() => {}}
      setBookAsFavorite={() => {}}
      title={'Antigone'}
      author={'Jean Anouilh'}
      isFavorite={true}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
```

> **KEY POINT**: Test the component with several sets of props. For instance if book is allowed to not have an author, make a snapshot with and one without the author name.

If a child of this component is connected, you need to mock the store in your test:

```javascript
import { createStore, Provider } from 'react-redux';
describe('<BookView />', () => {
  const store = createStore({
    books: {
      favorite: {
        crime: [],
        work: [{
          title: 'Lean in',
          author: 'Sheryl Sandberg'
        }]
      },
    },
    user: {
      name: 'Donald',
      id: 1
    }
  });
  it('renders correctly when the book is not a favorite one', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <BookView
          navigation={() => {}}
          setBookAsFavorite={() => {}}
          title={'Antigone'}
          author={'Jean Anouilh'}
        />
      </Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
```

### The services (~ 5min)

Let's say we want to test a service which formats an ISEN book code. The service is not given here, as the tests are the better explanation of what the service is supposed to do!

```javascript
// FormatService.spec.js
import FormatService from './normalization';

describe('FormatService', () => {
  describe('formatIsenNumber', () => {
    it('should return undefined if the value is undefined', () => {
      expect(FormatService.formatPhone(undefined)).to.equal(undefined);
    });
    it('should return undefined if length != 13', () => {
      expect(FormatService.formatPhone('123')).to.equal(undefined);
      expect(FormatService.formatPhone('12345678910111213')).to.equal(undefined);
    });
    it('should return undefined if there is a letter ', () => {
      expect(FormatService.formatPhone('123a45678910')).to.equal(undefined);
    });
    it('should return formatted ISEN code', () => {
      expect(FormatService.formatPhone('9782253002154')).to.equal('978-2-253-00215-4');
    });
  });
});
```

> **KEY POINT**: You should be exhaustive in the cases.
