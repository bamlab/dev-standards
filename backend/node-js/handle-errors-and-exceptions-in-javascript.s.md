# [Standard] Handle Errors and Exceptions in Javascript

## Owner: Maxime Sraïki

## Why

* On projects that are scaling, you can easily be overwhelmed by a pretty large code source. When this occurs, if you don't have a proper way to handle errors/exceptions, you could easily start raising a lot of bugs or regressions and spend a lot of time trying to fix them.

## Definitions

* First, let's make the distinction between Errors and Exceptions:
  - Errors are javascript objects that are thrown when something goes wrong in the code during runtime. It will usually have:
    - a `message` key containing a human readable error message
    - informations about where the error was raised like `fileName`, `lineNumber`, or even the whole `stack`
  - Exceptions are custom Errors objects created by developers to implement business logic.

## Checks

* Every Exceptions should be caught in a .catch statement and treated.
* Every caught Error should be rethrown (Even if it makes your application crash, you have to see it QUICKLY).
* Every .catch statement should take the error as argument.
* [OPTIONAL] If you have a logging system, in every .catch statement, you should log a message with the context and the whole error object.


## Examples

### Bad Examples:
#### Example 1: No catch statement

```js
myFunction().then(res => {
  //Do something with res
})
```

Here if `myFunction` throws an error, it will remain unhandled and can make my server crash without prior notice!

#### Example 2: Error not rethrown

```js
myFunction().then(res => {
  //Do something with res
}).catch(console.log)
```

Here if `myFunction` throws an error, it will be caught in the .catch statement and logged to the console logger. The problems are:
- The statement
```js
.catch(console.log)
```
is equivalent to 
```js
.catch(err => console.log(err))
```
 which is 
 ```js
 .catch(err => {return console.log(err)})
 ```
 therefore it will step in your next `.then` and acts as if everything was normal with an undefined response...
 - You make the error disappear and it will not be caught in your next `.catch`.

#### Example 3: Error not even handled

```js
myFunction().then(res => {
  //Do something with res
}).catch(() => {
  //Whatever
})
```

If you don't even use the error that has been caught, you can be almost sure that you don't handle it correctly.
Note that you *might* want under certain circumstances to ignore the error. In this case, make sure to add a comment explaining why and be sure that you don't overlook an edge case where handling the error was necessary.

### Good Examples:
#### Example 1: Error

```js
myFunction(argument).then(res => {
  //Do something with res
}).catch(error => {
  logger.log('The following Error occured when executing myFunction with argument', { error, argument })
  throw err
})
```

#### Example 2: Exception

```js
myFunction(argument).then(res => {
  //Do something with res
}).catch(error => {
  if (error.msg === EXPECTED_MESSAGE) {
    // Do something with error
  }
  logger.log('The following Error occured when executing myFunction with argument', { error, argument })
  throw err
})
```
