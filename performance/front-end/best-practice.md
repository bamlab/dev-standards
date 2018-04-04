# [Standard] A page should take less than 2 seconds to load

## Owner: [Thibaut Guedou](https://github.com/thibautguedou3)

## Description

The waiting time of a user is composed with the displaying time of a page and the time to get data from the back-end. The displaying time of a component is the time between the mounting and the display of a component.

## Best practices

### Display

* Display only what you need
* Check if your components do not re-render while they do not need to
* Use `shouldComponentUpdate` only as a last resort

### Selectors/ store structure

* Do not make all your calculations in your selectors
* Create a service that will perform calculation when you receive data from your back-end (modelizer)
* Normalize data to access them by `dataList[my_id]` rather than doing:

  `dataList.find((element) => element.id === my_id);`

* If calculations have to be performed by your selectors, cache them thanks to a librairy such as [re-select](https://github.com/reactjs/reselect)
* Only put in your store data that you will use in your application, not the entire response from the back-end

### Request

* Do not perform request if the response has not changed

### Technical debt

* Do not leave useless `console.log` in your code
* Use `FlatList` instead of `ListView` for better performance
* Bind functions outside components props

### Navigation

* Watch the size of your navigation stack (it should not be greater than 7)
* Do not re-render components that are in the navigation stack but not displayed
