# [Standard] Flow Type

## Owner: [Tycho Tatitscheff](https://github.com/tychota)

## Why

Flowtype is awesome:
- it successfully replaces unit tests for some tasks, like ensuring that the differents parts of the app, remains in sync with each others.
- it give you autocompletion

That being said, if flow is misconfigured and you blindly trust the result, you can still have bug where it should have raised an alert for you.

## Checks

- Every `*.js` file **should** have a comment on first line of the code with `// @flow`.
  - **Why?**
    - If it is not, the file is ignored by flow.
- Every types **should** use **exact typing** `{|...|}` and not `{...}`
  - **What?**
    - https://flow.org/en/docs/types/objects/#toc-exact-object-types
  **Why?**
    - https://twitter.com/cpojer/status/780268582974296064

## Examples

### // @flow comment

#### ✅ **Good example**

```js
// @ flow

import React from "react";
// rest of the file
class Comp from React.Component {
    
}
```

If you make a typo in `React`, you can see it, for instance.

#### ⛔️ **Bad example**

```js
import React from "react";
// rest of the file
class Comp from Reeeeeeeact.Component {

}
```

If you make a typo in `React`, you can don't see it.

### Exact object types

#### ✅ **Good example**

```js
// @ flow

type PropsType = {|
    chevres: Array<string>
|}

const Troupeau = (props: PropsType) => (<View><Text>{props.chevres.lenght}</Text></View>)
```

If you make a typo in `PropsType`, you can see it.

#### ⛔️ **Bad example**

```js
// @ flow

type PropsType = {
    maChevrePreferee: string
}

const Troupeau = (props: PropsType) => (<View><Text>{props.monMoutonPrefere}</Text></View>)
```

(`monMoutonPrefere` should raise an error, but don't since `PropsType` are not exact)
