# [Standard] Writing a health check route

## Owner: Arthur Levoyer

# Why

In order to monitor correctly their environments, some Cloud services require a HealthCheck route which returns a status depending on how the API is running.

## Checks

- [ ] Do a call to every DB used by the API
- [ ] Send a 2xx status code status in case of API running correctly and 5xx status code if not
- [ ] Do the less data usage DB calls
- [ ] Include a timestamp in order not to reduce the number of successive calls

## Examples

In the examples below the API is concentrating calls to one database RDS and one DynamoDB

### Example 1: Bad example

```javascript
app.get("/health-check", (req, res) => {
  res.status(200).send({ status: "OK" });
});
```

- There is no call to any of the two databases
- There is no 5xx status code if the API is not running
- There is not timestamp hence the route may be called successively every seconds

### Example 2: Bad example

```javascript
app.get("/health", async (req, res) => {
  try {
    await findAllDataCollectors(); //  DataCollectors ~ 100 entries
    res.status(200).send({ status: "OK" });
  } catch (error) {
    res.status(503).send({ status: "KO" });
  }
});
```

- There is a call to one of the database but not the other
- The call is using too much data
- There is no timestamp
- There is a 503 if the DB is down

### Example 3: Good example

```javascript
app.get("/health", async (req, res) => {
  try {
    if (nextFetchingDate && nextFetchingDate > Date.now()) {
      return res.status(200).send({ status: 200, message: "OK" });
    }

    nextFetchingDate = Date.now() + TIME_CHECKING_INTERVAL;
    await Promise.all([AppsDynamoRepo.getDynamoHealth(), getHealth()]);

    res.status(200).send({ status: 200, message: "OK" });
  } catch (error) {
    nextFetchingDate = Date.now();
    handleError(res, error, { status: 503, error: error.message, message: "KO" });
  }
});
```
