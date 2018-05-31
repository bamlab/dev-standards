# [MO] How to use redux-form with custom fields (~10min)

## Owner: [Darius Afchar](https://github.com/DariusAf)

* What is **redux-form**?

Redux-form is a higher-order component decorator that enables you to efficiently manage your form by automating a lot of things as form-validation, focus events, storage synchronisation...

* The point of this article?

With redux-form, a lot of things are done under the hood, so it may be tricky to add a custom component and have it work as expected. For instance, you might want to use a external component as a date-picker, or a super-component composed with different inputs that should return an aggregated answer. In those cases, you have to get your hands dirty to customise how redux-form connect to your component. Here is one way to do so.

## Prerequisities

A react project with a redux store, obviously.

* a react project: create one with [create-react-app](https://github.com/facebookincubator/create-react-app)
* [redux installed](http://redux.js.org/docs/basics/UsageWithReact.html), make sure to install **redux** and **react-redux**
* create a store and a reducer

## Steps

1. Add **redux-form** to your project, run

```bash
npm install redux-form
```

2. Connect redux-form to your store by adding it to your reducers

It depends on how you did organize your code, but if you have several reducers it might be similar to the following code:

```javascript
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
// your imports ...

const appReducer = combineReducers({
  // ... your project reducers
  form: formReducer,
});

const initialState = {};
const rootReducer = (state = initialState, action) => (appReducer(state, action));

export default rootReducer;

```

3. Add a form field component to the front

Let's say we have a custom component called *MySuperNiceInput* we want to connect.

```javascript
import { Field, reduxForm } from 'redux-form'
import { MySuperNiceInput } from 'path/to/MySuperNiceInput'
// your imports ...

const MyForm = ({ handleSubmit }) => (
	<form onSubmit={ handleSubmit }>
	  // ...
	  <div>
	    <label>Not a custom field</label>
	    <Field name="firstName" component="input" type="text" />
	  </div>
	  <div>
	    <label>A tricky field</label>
	    <Field name="superNiceInput" component="MySuperNiceInput" />
	  </div>
	  <button type="submit">Submit</button>
	</form>
);

export default reduxForm(
	form: 'myformnamethatwillappearinthestore'
)(MyForm);
```

4. Control how things change with *this.props.input.onChange()*

Redux-form automatically pass some props to the component you pass through the *component* prop of *\<Field\>*.

```javascript
import { connect } from 'react-redux';
// your imports ...

class MySuperNiceInput extends Component {
  handleChange(callbackValue) {
    // ...
    this.props.input.onChange(valueToSendToStore);
  }

  render() {
    return (
      <div>
          <MyWeirdInputComponentThatWontWorkNicely
            {...restOfProps /* replace me by the actual props */}
            onChange={m => this.handleChange(m)}
          />
    	</div>
    );
  }
}
```

This will dispatch actions to the form reducers whenever onChange is triggered.

You can find all the props you can pass [on the official documentation](http://redux-form.com/6.0.0-alpha.4/docs/api/Field.md/).

6. Manage the submit event

Time to use what we gave to redux-form. There is a high chance you would like your form data to be sent to a specific store of redux, so that's how to do it.

Something you have to know about redux-form that can be a bit confusing is that if you want to pass a prop to the form, you have to use the syntax **onNameOfProp** and you receive it as **handleNameOfProp**.

It means that the wording *handleSubmit* we have used previously is mandatory. We did write
```const MyForm = ({handleSubmit}) => (<form onSubmit={handleSubmit}> ...```
which is equivalent to 
```const MyForm = props => (<form onSubmit={props.handleSubmit}> ...```

In the light of what was said above, to pass this *handleSubmit* function you will have to use *onSubmit*:

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxSubmitAction } from 'path/to/redux/action';
import MyForm from 'path/to/my/form';

class MyPage extends Component {
  submit(data) {
    const dataToSubmit = {
      firstname: data.firstName,
      mycustominput: data.superNiceInput
    };
    this.props.dispatchSubmit(dataToSubmit);
  }

  render() {
    return (
      // ... your page
       <MyForm onSubmit={(data) => this.submit(data)} />
      // ...
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchSubmit: (data) => {
    dispatch(reduxSubmitAction(data));
  }
});

const MyPageContainer = connect(null, mapDispatchToProps)(SignUp);

export default MyPageContainer;

```

You are done here!

