# [Standard] Handle Errors and Exceptions in Javascript

## Owner: Maxime Sraïki

## Why

* On scaling projects you can easily be overwhelmed by a pretty large code source. When this occurs, if you don't have a proper way to handle errors/exceptions, you could easily start raising a lot of bug or regression and spend a lot of time trying to fix it.

## Definitions

* First let's make the distinction between Erros and Exceptions:
  - Errors are javascript objects that are thrown when something goes wrong in the code during runtime. It will usually have:
    - a `message` key containing a human readable error message
    - informations about where the error was raised like `fileName`, `lineNumber`, or even the whole `stack`
  - Exceptions are custom Errors objects created by developers to implement business logic.

## Checks

* Every Exceptions should be caught in a .catch statement and treated.
* Every caught Error should be rethrown (Even if it makes your application crash, you have to see it QUICKLY)
* Every .catch statement should take the error as argument
* [OPTIONAL] If you have a logging system, in every .catch statement, you should log a message with the context and the whole error object


## Examples

#TODO
