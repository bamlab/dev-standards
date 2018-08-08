# [MO] How to log your queries durations with Knex (~10)

## Owner: [Guillaume Renouvin](https://github.com/GuillaumeRenouvin)
## Creation date: August, 1st 2018
## Update date: August, 1st 2018

## Context
- You want to log your database requests durations using Knex query builder

## Prerequisites
- Have Knex installed

## Steps

### Log your queries informations (~5min)
- After your Knex instantiation add listeners on each query, query response and query errors
```javascript
db.on('query', query => {
 console.log(query.sql);
})
 .on('query-response', (response, query) => {
   console.log(query.sql);
 })
 .on('query-error', err => {
   console.log(err);
 });
```
> Check: Launch your server, call an API route and you should see your queries on the logs

### Log query duration (~5min)
- Blabla
  ```javascript
import now from 'performance-now';

const durations = {};

knex
 .on('query', query => {
   times[uid] = {
     query,
     startTime: now(),
   };
 })
 .on('query-response', (response, query) => {
   times[query.__knexQueryUid].endTime = now();

   console.log(query.sql, ',', `[${query.bindings ? query.bindings.join(',') : ''}]`);
   console.log(
     `Time: ${(
       times[query.__knexQueryUid].endTime - times[query.__knexQueryUid].startTime
     ).toFixed(3)} ms\n`
   );
   delete times[uid];
 });

  ```
> Check: Launch your server, call an API route and you should see your queries durations on the logs

### Sources
- [Timing Your Queries in Knex.js for Node.js](https://spin.atomicobject.com/2017/03/27/timing-queries-knexjs-nodejs/)
