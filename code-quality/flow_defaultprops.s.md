# How to manage default Props with Flow
### <u>Owner : Julien Nassar</u>
### <u>Sponsor : Tycho</u>

## Preriquisites (15min):
- existing react application. if not, [install react](https://facebook.github.io/react/docs/installation.html) and create your react app using
```
create-react-app MY_APP_NAME
cd MY_APP_NAME
```
- [flowType](https://flow.org/en/docs/) v 0.47 installed. Install Flow and init your flowconfig from within your project with :
```
yarn add --dev flow-bin@0.47
yarn run flow init
```

# Steps :
### 1. Create a button component, and give it a props to handle the click
Create Button component with props='onClick' :
in your app src folder, create a component MyCoolButton with an onClick function using the props handleClick:

```
import React, { Component } from 'react'

export default class MyCoolButton extends Component {
  render () {
    return (
      <button onClick={() => this.props.handleClick}> click me </button>
    )
  }
}
```

now you want to add your button to your app, use it in App.js and give it a prop function handleClick to make a simple `console.log`

```
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MyCoolButton from './MyCoolButton'

class App extends Component {
  render() {
    return (
      <div className="App">
        <MyCoolButton
          handleClick={() => {console.log('Clicked !')}}
        />
      </div>
    );
  }
}

export default App;
```

Now your button logs the string `Clicked !` on each click

### 2. Use Flow Type on your component

To activate the flow check, add `// @flow` at the begining of your app.js and MyCoolButton.js files, then add props Type to your component :
here is how your MyCoolButton.js file should look like :

```
// @flow
import React, { Component } from 'react'

type PropsType = {
  handleClick: () => void
};

export default class MyCoolButton extends Component {
  props: PropsType;

  render () {
    ...
  }
}
```

### 3. Use your component without props

If you call you MyCoolButton without a props handleClick (`<MyCoolButton />`), flow will fail the check. To create a generic response to the onClick props of the Button component, you can use defaultProps.

```
export default class MyCoolButton extends Component {
  ...

  static defaultProps = {
    handleClick: () => console.log("Default Click Handler")
  }
  render () {
    ...
  }
}
```

Now you can use your component without props and running flow will not trigger any error !

For example, here the first button logs `Clicked !` and the second one `Default Click Handler` when clicked on :

```
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MyCoolButton from './MyCoolButton'

class App extends Component {
  render() {
    return (
      <div className="App">
        <MyCoolButton handleClick={() => {console.log('Clicked !')}} />
        <MyCoolButton />
      </div>
    );
  }
}

export default App;
```
