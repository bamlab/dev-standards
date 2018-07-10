# [Standard] Flow Typing a container

## Owner: [Yann Leflour](https://github.com/yleflour)

## Checks

- [ ] The component's ownprops have to be typed in `TOWnProps`
- [ ] The containers exposes its resulting props through a `TContainerProps` type
- [ ] Your component uses your `TContainerProps` in its `TProps`

## How

### 0. Add a `$Return` utils type (1 min)

- In your flowtypes folder a _utils.js_ folder
- Add the following type, it will help you extract the result of a function

```
// flowtypes/utils.js
// @flow

type Return_<R, F: (...args: Array<any>) => R> = R;
declare type $Return<T> = Return_<*, T>;

```

### 1. Type your ownprops (2 min)

- In your _mycomponent.container.js_ file, declare your ownprops type. Those are the props required by the mapStateToProps or mapDispatchToProps methods.

```
// mycomponent.container.js
// @flow

type TOwnProps = {
  myItemId: string,
}

const mapStateToProps = (state: TRootState, ownProps: TOwnProps) => ({...});
const mapDispatchToProps = (dispatch: Dispatch, ownProps: TOwnProps) => ({...});
```

### 2. Type your _mapStateToProps_ (2 min)

- In your _mycomponent.container.js_ once you've written the _mapStateToProps_ method, declare your _TStateProps_

```
// mycomponent.container.js
// @flow

const mapStateToProps = (state: TRootState, ownProps: TOwnProps) => ({...});

type TStateProps = $Return<typeof mapStateToProps>;
```

### 3. Type your _mapDispatchToProps_ (2 min)

- In your _mycomponent.container.js_ once you've written the _mapDispatchToProps_ method, declare your _TDispatchProps_

```
// mycomponent.container.js
// @flow

const mapDispatchToProps1 = (state: TRootState, ownProps: TOwnProps) => ({...});

type TDispatchProps1 = $Return<typeof mapStateToProps1>;

// OR

const mapDispatchToProps2 = {...};

type TDispatchProps2 = typeof mapStateToProps2;
```

### 4. Type your _TContainerProps_ (2 min)

- In your _mycomponent.container.js_ declare your _TContainerProps_ and export them

```
// mycomponent.container.js
// @flow

export type TContainerProps = TStateProps & TDispatchProps;
```

### 5. Type your TProps (1 min)

- In your _mycomponent.component.js_ use your _TContainerProps_

```
// mycomponent.component.js
// @flow

import { type TContainerProps } from './mycomponent.container.js';

type TProps = TContainerProps & {
  // Add other component required props here
}

```
