# [MO] How to use redux-form with custom fields (~10min)

## Owner : [Darius Afchar](https://github.com/DariusAf)

*Why would you want to do that ?*

Redux-form is great and can automate a lot of things as form-validation, focus events, storage synchronisation... But it can be a bit tricky if you want to add a custom component that includes many fields whose values have to be aggregated, or an external component, for instance a date-picker.

## Prerequisities

A react project with a redux store, obviously.

## Steps

1. Add form-redux to your project, run

```bash
npm install redux-form
```

2. Connect redux-form to your store by adding it to your reducers


```javascript
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
// ...

const appReducer = combineReducers({
  // ... your project reducers
  form: formReducer,
});

const rootReducer = (state = initialState, action) => (appReducer(state, action));

export default rootReducer;

```

3. Add a form field component to the front

Let's say we have a custom component called *MyWeirdInput* we want to connect.

```javascript
import { Field, reduxForm } from 'redux-form'
...

	render() {
		return(
		return (
			...
		    <form onSubmit={ handleSubmit }>
		      <div>
		        <label>Not a custom field</label>
		        <Field name="firstName" component="input" type="text" />
		      </div>
		      <div>
		        <label>A tricky field</label>
		        <Field name="weirdInput" component="MyWeirdInput" />
		      </div>
		      <button type="submit">Submit</button>
		    </form>
		    ...
		);
	}
```

4. Control how things change with *this.props.input.onChange()*

```javascript
...
import { connect } from 'react-redux';

class MyWeirdInput extends Component {
  handleChange(chosenValue) {
    // ...
    this.props.input.onChange(valueToStore);
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

5. Reap the reward

Manage the handleSubmit 

```javascript
undefined

```
