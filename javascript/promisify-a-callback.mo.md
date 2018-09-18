# [MO] Promisify a callback _(~5 min)_

## Owner: Arthur Levoyer

## Why

When asynchronous action is performed, if you want to wait for its success or failure and in order to avoid several chains of callbacks. See [callback hell](http://callbackhell.com/).

## Steps

- I identified the aynchronous work I want to wait for
- I included the function into a callback, the executor of the Promise will handle an asynchronous work (in the examples below the describeTable). Once the work is done, if it went well, we are calling the resolve function, if not we are calling the reject one.
  -> When we perform the `await getDynamoHealth()`, we are truly waiting for the call of the resolve or reject function

## Examples

### Example 1: Bad example

```jsx
export const getDynamoHealth = () => {
  dynamodb.describeTable({}, (error, data) => {
    // AWS asynchronous function that describe tables in the DB and takes in second argument a callback
    if (error) throw error;
    else console.log(data);
  });
};

export const getHealth = async () => {
  try {
    await getDynamoHealth(); // If the callback does not throw the error I want to send a 200 otherwise I send a 500
    sendStatus(200);
  } catch (error) {
    throw error;
    sendStatus(500);
  }
};
```

-> [ ] No Promise nor promisify had been used hence we are sending a 200 status in all cases

### Example 2: Good example

```jsx
export const getDynamoHealth = (): Promise<Array<Object>> => {
  return new Promise((resolve, reject) => {
    // We create a Promise with the function using a callback in second arguments
    dynamodb.describeTable({ TableName: dynamodbTableName }, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
};

export const getHealth = async () => {
  try {
    await getDynamoHealth(); // If the callback does not throw the error I want to send a 200 otherwise I send a 500
    sendStatus(200);
  } catch (error) {
    throw error;
    sendStatus(500);
  }
};
```
