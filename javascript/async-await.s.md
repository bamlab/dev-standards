# [Standard] From the callback hell to async-await

## Owner: Alice Breton

## Callbacks:

Calbacks were first used to allow asynchronous calls in a synchrone code.
In the following example, the user will get a token from a server.
Then with this token he will be able to access a list of friends.
Finally for each friend he will get their phone number and address. 


``` javascript
const list = getToken(ClientId, function(err1, token){
  if(err1){
    return null;
  }else{
    return getListOfFriends(token, function(err2, listOfFriends){
      if(err2){
        return null;
      }else{
        return getAdressAndPhoneNumber(listOfFriends, function(err3, phoneNumbersAndAddresses){
          if(err3){
            return null;
          }else{
            return phoneNumbersAndAddresses;
          }
        })
      }
    })
  }
})

```

As you can see this is quite difficult to grasp at first sight. And even after a second look it still is quite barbaric.
Now imagine you need to access the token (res1) in the function getAdressAndPhoneNumber, it becomes a real nightmare !
You would need to add arguments to getAdressAndPhoneNumber and also to getListOfFriends ...
Another problem is dealing with errors: they need to be declared after each call. If not, the flow will not be interupted and all the calls will be executed even though they don't have the requested parameters.

This is why were invented...

## Promises

The code bellow the code is much more lisible:

``` javascript
const phoneNumbersAndAddresses = new Promise((resolve, reject) => {
  getToken(ClientId);
})
  .then(token => getListOfFriends(token))
  .then(listOfFriends => getAdressAndPhoneNumber(listOfFriends))
  .catch(err)
  .then(() =>
    console.log("This text will be printed whatever happened before")
  );

```

`phoneNumberAndAddresses` will contain ???
Promisses can now easily be chained.
If one of the calls throws an error, it is directly caught by the first `.catch(err)` met and the `.then(...)` are not executed.

However we still encounter the problem of passing results through the different calls. There are two ways of tackling this problem:
- Either declaring `var resulst = ...` before the promise and overriding it after each call,
- Or passing the results of each call through the next one...

To overcome this problem, Promises were combined to Generators (ask Tycho ???) to create ...

##Async/Await

Async / Await a asynchronous functions that ARE promisses wrapped by a Generator: they return a Promise.
Finally, this is the code of the API call we wanted:

``` javascript
async function getPhoneNumbersAndAddresses(ClientId) {
  var token = await getToken(ClientId);
  var listOfFriends = await getListOfFriends(token);
  var adressesAndPhoneNumbers = await getAdressAndPhoneNumber(listOfFriends);
  return adressesAndPhoneNumbers;
}

```

To catch errors, we can surround all the calls by try/catch:

``` javascript
async function getPhoneNumbersAndAddresses(ClientId) {
  try {
    var token = await getToken(ClientId);
    var listOfFriends = await getListOfFriends(token);
    var adressesAndPhoneNumbers = await getAdressAndPhoneNumber(listOfFriends);
    return adressesAndPhoneNumbers;
  } catch (err) {
    // Deal with the error
  }
}

```

This way, we can access the results of all the calls at any time. If a call throuws an error, it is caught and you can the execute other actions.
To call this function, it is important to do it as so:


``` javascript
const phoneNumbersAndAddresses = yield getPhoneNumbersAndAddresses(ClientId)
```

:warning: If you want to use an asynchronous function in ComponentDidMount (and where else ???), you will need to add `.Done()` at the end of the function to bring the errors to the current context (=> Tycho)
