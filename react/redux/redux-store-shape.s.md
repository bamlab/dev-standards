
# [Standard] Organising a redux store

## Owner: Nicolas Djambazian

# Introduction

This document give standards for a good redux integration. Each project can choose the library he wants, but the final architecture should respect this standard.


# Actions Architecture

**Actions must respect the [flux-standard-action]() standard**

## Why

This standard allows to :

 - Be easy to read and write by humans
 - The creation of useful tools and abstractions
 - Have a hierarchy of the informations in an action
 - Have side effect which works with the error
 - Reuse some reducer/module between project

## Checks
The action valid the following flow type:

```jsx
type Action = {
    type: string,
    payload?: any
    meta?: Object,
    error?: boolean
};
```

## Examples
### Good

```jsx
{
  type: 'FETCH_USERS_SUCCESS',
  payload: [{
    id: 3,
    name: 'John Snow'
  }],
  meta: {
    page: 3,
    totralPage: 4,
    stopLoading: true,
    loadingName: 'users_list',
  }
}

{
  type: 'FETCH_USERS_ERROR',
  payload: new Error('fetch failed')
  error: true,
}
```

### Bad

```jsx
{
  type: 'FETCH_USERS_SUCCESS',
  users: [{
    id: 3,
    name: 'John Snow'
    }],
    page: 3,
    totralPage: 4,
    stopLoading: true,
    loadingName: 'users_list',
}

{
  type: 'FETCH_USERS_ERROR',
  error: new Error('fetch failed')
}
```

# Actions Serialisation

**Actions must be serialisable**

## Why

This standard allows to :

 - Use debugging tools
 - Save actions when offline to send it later
 - ...

## Examples
### Good

```jsx
{
  type: 'FETCH_USERS_SUCCESS',
  payload: {
    date: 1234512345,
    error: new Error('azoiej'),
    user: { id: 1 },
  },
}
```

### Bad

```jsx
{
  type: 'FETCH_USERS_SUCCESS',
  payload: {
    date: moment(1234512345),
    user: new User({ id: 1 }),
    callback: () => {},
  },
}
```

# Store content

- **The data must not be duplicated in the store**
- **The store entities must have been normalized**
- **The store must not contain any information relevant only in one component**
- **The store must not contain any pagination information (ex: `selectedItem`, ...)**
- **State must be serialisable**


# Side Effects

**The side effect which launch an API request must not do any page specific operation (navigation, close modal, popover )**

# Selectors

**Only selectors can access to a part of the state**
