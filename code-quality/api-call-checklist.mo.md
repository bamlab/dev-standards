# [MO] What to check when making an API call

## Owner: [Yassine Chbani](https://www.github.com/yassinecc)

## Prerequisites

* [] Have the API's documentation

## Steps

Note: Do not assume that the documentation is complete, if you are uncertain about something get in touch with the API's authors

* [ ] I know which parameters are mandatory/optional in my call
* [ ] From each parameter, I know:

- its type
- its format
- whether it is mandatory or optional
- its maximal/minimal values
- its signification in the API

* [ ] I know how will each parameter be interpreted (Ex: a request that needed a vehicle's mileage expected a string between 0 for 0% and 8 for 100%)
* [ ] I have tested the API request on all environments (staging/production) (Ex: a request with a SOAP client succeeds in  staging but not in production => we had to do a POST request with an XML body)
* [ ] I know how to distinguish between success and failure cases of the API request (Ex: the API's response is an XML one with the error tag written as an 'Error' string)
* [ ] I have tested my request with parameters that lead to successful and failure responses (Ex: Due to a defective catch statement, we received an OK response from a login routine no matter what password was used)
* [ ] I have a real-life dataset with which I can test the API (Ex: testing with mock data is not representative of real-life use cases, the best is to test the API call from within the associated user path)
* [ ] If I need authentication, I have checked that the authentication credentials will always be available when the request is made, otherwise the users can authentiate themselves
* [ ] For chaque response element, I have checked:

- its type
- its format
- whether it is mandatory or optional
- its maximal/minimal values
- its signification in the API
- its pagination: will we receive all data at once or in multiple requests

* [ ] I have taken into account the following response cases:

- An object returned with its correct format
- An object with an incorrect format (ex: missing key, wrong date format)
- A non-JSON response
- An empty response
- A 500 error
- A 400 error
