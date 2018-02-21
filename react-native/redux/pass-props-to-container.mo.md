# [MO] Pass props to a container (~5min)

## Owner: [Jean Faverie](https://github.com/jfaverie)

## Context

In this article, we will see how to have access to and use the props of a component inside its container.

## The point of this article?

Usually, developers need to have access to the props of a component inside its presentational part (the .component.js file) and not its container. Thus, they use the object form of mapStateToProps and mapDispatchToProps, which don't have access to the props of the component but are easier to use and write.

## Prerequisites

* a react project: create one with [create-react-app](https://github.com/facebookincubator/create-react-app)
* [redux installed](http://redux.js.org/docs/basics/UsageWithReact.html), make sure to install **redux** and **react-redux**

## Steps

1. Create a simple component's container, for example a Todo component:

```javascript
import { connect } from 'react-redux';
import { selectTodoEvents } from 'redux/todos/selectors';
import { addTodoEvent } from 'redux/todos/actions';
import { Todo } from 'Todo.component.js';

const mapStateToProps = {
  todoEvents: selectTodoEvents,
};

const mapDispatchToProps = {
  addTodoEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);

```

This is a standard container, with a selector giving access to a list of events to the component and an action to create a todo event.

{% hint style='info' %}  

But what if you want to give a specific behavior to your container? For example enabling the adding of an event only if the todo is editable ? Or seeing only a limited number of events depending on the rights of your user ? You can give props to your container ! Let's see how :

{% endhint %}

2. Refactor your container to keep the same behavior but using the function way.

To make sure you use the function way correctly, refactor your code but don't change the behavior of your code!

The function way works exactly the same as the object way but gives you access to more features because you have now access to `dispatch` function.

```javascript
import { connect } from 'react-redux';
import { selectTodoEvents } from 'redux/todos/selectors';
import { addTodoEvent } from 'redux/todos/actions';
import { Todo } from 'Todo.component.js';

const mapStateToProps = (state) => {
  todoEvents: selectTodoEvents(state),
};

const mapDispatchToProps = (dispatch) => {
  addTodoEvent: () => dispatch(addTodoEvent()),
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);

```

{% hint style='success' %} **CHECK** 

The behavior must be the same! Test that everything works like before.

(If it works differently, this is not a refactoring).

{% endhint %}

3. Give access to the props of your component to your container

We want to have access to 2 props, `hasAdminAccess` and `canAddEvent`.

```javascript
import { connect } from 'react-redux';
import { selectLimitedTodoEvents, selectTodoEvents } from 'redux/todos/selectors';
import { addTodoEvent, makeAddingRequest } from 'redux/todos/actions';
import { Todo } from 'Todo.component.js';

const mapStateToProps = (state, ownProps) => {
  todoEvents: ownProps.hasAdminAccess ? selectTodoEvents(state) : selectLimitedTodoEvents(state),
};

const mapDispatchToProps = (dispatch, ownProps) => {
  addTodoEvent: () => ownProps.canAddEvent ? dispatch(addTodoEvent()) : dispatch(makeAddingRequest()),
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);

```

Now you can give a specific action and a specific selector to your container depending on the props of your component!

{% hint style='success' %} **CHECK 1** 

If you give `hasAdminAccess` and `canAddEvent` props to the container set to true, you should have the same behavior than before

{% endhint %}

{% hint style='success' %} **CHECK 2** 

If you give `hasAdminAccess` or `canAddEvent` props to the container set to false, your behavior will be different and you will only be able to see a limited number of events and only make an adding request

{% endhint %}
