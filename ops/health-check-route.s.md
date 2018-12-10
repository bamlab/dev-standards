# [Standard] Writing a health check route

## Owner: Arthur Levoyer

# Why

In order to monitor correctly their environments, backend services require a HealthCheck route which returns a status depending on how the API is running.

## Checks

- [ ] Make a call to every database used by the API
- [ ] Send a 2xx status code status if the API is running correctly, 5xx status code if not
- [ ] Make database calls retrieving as little data as possible: the health check route is likely to be called very often in short period of time

## Examples

In the examples below the API is making calls to one database RDS and one DynamoDB

### Example 1: Bad example

```javascript
app.get("/health-check", (req, res) => {
  res.status(200).send({ status: "OK" });
});
```

- There is no call to any of the two databases
- There is no 5xx status code if the API is not running

### Example 2: Bad example

```javascript
app.get("/health", async (req, res) => {
  try {
    await RDS.getAllEntries();
    res.status(200).send({ status: "OK" });
  } catch (error) {
    res.status(503).send({ status: "KO" });
  }
});
```

- There is a call to one of the database but not the other
- The call is using too much data
- There is a 503 if the DB is down: the await RDS.getAllEntries() is then throwing an error hence the catch block is executed

### Example 3: Good example

```javascript
app.get("/health", async (req, res) => {
  try {
    await Promise.all([DynamoDB.getDynamoHealth(), RDS.getHealth()]);
    res.status(200).send({ status: 200, message: "OK" });
  } catch (error) {
    handleError(res, error, { status: 503, error: error.message, message: "KO" });
  }
});

RDS.getHealth = async () => {
  await knex.raw("select 1+1 as result");
};

DynamoDB.getDynamoHealth = () => {
  return new Promise((resolve, reject) => {
    dynamodb.describeTable({ TableName: dynamodbTableName }, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
};
```
