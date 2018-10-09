# [MO] Promisify a callback _(~5 min)_

## Owner: Arthur Levoyer

## Why

When asynchronous action is performed, if you want to wait for its success or failure and in order to avoid several chains of callbacks. See [callback hell](http://callbackhell.com/).

## Steps

- I identified the asynchronous work I want to wait for
- I included the function into a callback, the executor of the Promise will handle an asynchronous work (in the examples below the describeTable). Once the work is done, if it went well, we are calling the resolve function, if not we are calling the reject one.

## Examples

### Example 1: Bad example

```jsx
export const waitForCallbackToBeSolved = () => {
  asynchronousAction(params, (error, data) => {
    // We create a Promise with the function using a callback in second arguments
    if (error) throw error;
    else console.log(data);
  });
};

export const getResponse = async () => {
  try {
    await waitForCallbackToBeSolved();
    doStuff();
  } catch (error) {
    log(error);
    throw error;
  }
};
```

-> [ ] Neither `Promise` nor `promisify` had been used hence we are sending a 200 status in all cases

### Example 2: Good example

```jsx
export const waitForCallbackToBeSolved = (): Promise<Array<Object>> => {
  return new Promise((resolve, reject) => {
    // We create a Promise with the function using a callback in second arguments
    asynchronousAction(params, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
};

export const getResponse = async () => {
  try {
    await waitForCallbackToBeSolved();
    doStuff();
  } catch (error) {
    log(error);
    throw error;
  }
};
```
