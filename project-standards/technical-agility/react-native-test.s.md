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

// @TODO

## Good Examples

### 1. Reducer & selector (~2min & ~2min):
``` javascript
// Reducer
export default (state = {}, action) => {
  switch (action.type) {
    case 'SIGNUP_SET_USER_INFO':
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
      };
    default:
      return state;
  }
};

//Test
it('should set the user info', () => {
  const action = {
    type: 'SIGNUP_SET_USER_INFO',
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

// Selector
export const userIdSelector = state => state.user.id;

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

### 2. Sagas ( ~5 -> ~15 min)

The execution order:

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

The effect on the state:

```javascript
// Test
import rootReducer from '../reducer';

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
      .withReducer(rootReducer)
      .run()
      .then(result => expect(result.storeState).toEqual(expectedState));
  });
```

### 3. The props presence of a presentational component and a container (~ 5min)

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
```

``` javascript
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

### 4. The UI of a component (~5 min)
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

If a child of this component is connected, you need to mock the store in your test:
```javascript
//
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

### 5. The services (~ 5min)
```javascript
// FormatService.spec.js
// The service formats an ISEN book code
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