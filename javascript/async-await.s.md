# [Standard] From the callback hell to async-await

## Owner: Alice Breton

## Callbacks:

Calbacks were a first used to allow asynchonous calls in a synchrone code.
In the following example, the user will get a token from a server.
Then with this token he will be able to access a list of friends.
Finally for each friend he will get their phone number and address. 


``` javascript
const list = getToken(ClientId, function(err1, res1){
  if(err1){
    return null;
  }else{
    return getListOfFriends(res1, function(err2, res2){
      if(err2){
        return null;
      }else{
        return getAdressAndPhoneNumber(res2, function(err3, res3){
          if(err3){
            return null;
          }else{
            return res3;
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

This is why were invented

## Promises

Promises 

``` javascript
const list = getToken(ClientId)
  .then(getListOfFriends)
  .then(getAdressAndPhoneNumber)
  .catch(err)

```


## Checks
- Has an owner with a link to his Github Profile
- Should contain all the the parts present in this document
  - Title
  - Checks
  - Bad example(s)
    - Based on real world use cases
  - Good example
    - Based on real world use case
- Title should be prefixed by [Standard]
- File name should be kebab case and suffixed by `.s`
- Referenced in the root *README.MD* and *SUMMARY.MD*

## Examples

#### Example 1: [[Standard] Project Architecture](/react-native/architecture/project-architecture.s.md)

- There is no owner
- There are no examples

#### Example 2:

This page is an example of what a good standard is
