# [MO] Trigger action on props update with componentDidUpdate and getDerivedStateFromProps

## Owner: Nicolas Djambazian

## Motivation

If you have ever worked with React, you will have probably used Redux at some point and found it great as your components can
subscribe to any changes to the store state and react accordingly. But what happens if you want to similarly handle the update
of one of your component's props? For example, call a certain method for a given change of the props?

Your component has a set of props that can change after it has been mounted and before it gets unmounted. The props change can be
triggered from within or outside the component.

Well you're in luck, because Facebook provides a set of methods that get called at different points of the lifecycle of a component <sup>1</sup>. We are going to look at the `getDerivedStateFromProps` and  the `componentDidUpdate` methods in the following article. The first one is useful if you want to change your state according to the props. The second, if you want to trigger actions on props or state change.


## Updating the state from a props (~10 minutes)

### Prerequisites

For the example, let's say we have an input text which saves its value in its internal state, but we want to allow the parent to control him sending a `value` props.


```jsx
type Props = { };
type State = { value: string };
class Input extends Component<Props, State> {
  state = {
    value: '',
  };

  onChange = (value: string) => {
    this.setState({ value });
  }

  render () {
    return (
      <SomeInputComponent value={this.state.value} onChange={this.onChange} />
    )
  }
}
```

### Steps

In the previous version of React, we used to implement the `componentWillReceiveProps` for that use case. Since react rendering will be asynchronous, this method is deprecated. You now need to use the static method `getDerivedStateFromProps`.



- Add your new prop in the flow typing
```jsx
type Props = { value?: string };
```

- Implement static method `getDerivedStateFromProps`

```jsx
class Input extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {

  }
  // ...
}
```

The method takes the new props and the previous state as parameters. This is a static method, so you can't access this inside of it.

This method should return the new state of the component, or null if it stays unchanged.

- Return the new state

```jsx
class Input extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): ?State {
    if (! nextProps.value) {
      // State is not changed
      return null;
    }
    return {
      ...prevState, // don't forget to merge the old state
      value: nextProps.value,
    };
  }
  // ...
}
```

If you want to make computation with the previous values of the props. You need to add it in the state.
```jsx
class Input extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): ?State {
    if (! nextProps.value && !prevState.previousPropsValue) {
      // State is not changed
      return null;
    }
    return {
      ...prevState, // don't forget to merge the old state
      value: nextProps.value,
      previousPropsValue: nextProps.value,
    };
  }
  // ...
}
```

## Call a method on props or state change (~5 minutes)

### Prerequisites

We will start from the code of the previous section. We want to add a props `onValueChanged` called when the `value` props or the `value` state have changed.

### Steps

- Add the `onValueChanged` props in the flow typing
```jsx
type Props = {
  value?: string
  onValueChanged?: (string) => any,
};
```

- Implement the `componentDidUpdate` method

```jsx
class Input extends Component<Props, State> {
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.value !== this.props.value || prevState.value !== this.state.value) {
      if (this.props.onValueChanged) {
        this.props.onValueChanged(this.state.value);
      }
    }
  }
  // ...
}
```

There is several things to be careful of with this method :
 - The method is called after the component rerender with the new props/state
 - The method can be called even if the props or the state didn't change (if the component is not pure and the parent has rerendered)


## Setting a state for a limited amount of time on props change (~10 minutes)

### Prerequisites

We want to show a text during 3 seconds after the props `isConnected` changed. We will need to combine both methods we saw.

Initial structure :
```jsx
type Props = { isConnected: boolean };
class MyClass extends Component<Props> {
  render () {
    return (
      if( this.props.isConnected ) {
        <Text>
          Connexion successful!
        </Text>
      }
    )
  }
}
```

### Steps



Let’s also add a component which is rendered at a certain `isTextVisible` condition saved in the state:
```jsx
type Props = { isConnected: boolean };
type State = { isTextVisible: boolean };
class MyClass extends Component<Props, State> {
  state = { isTextVisible: false }
  render () {
    return (
      if( this.state.isTextVisible ) {
        <Text>
          Connexion successful!
        </Text>
      }
    )
  }
}
```

Now set the `isTextVisible` when the props `isConnected` change :
```jsx
type Props = { isConnected: boolean };
type State = { isTextVisible: boolean, prevIsConnected: boolean };
class MyClass extends Component<Props, State> {

  // No need to initialize the state. The getDerivedStateFromProps method will be called before the first render

  static getDerivedStateFromProps(nextProps: Props, prevState: State): ?State {

    if (nextProps.isConnected === prevState.prevIsConnected) {
      return null;
    }

    return {
      ...prevState, // don't forget to merge the old state
      isTextVisible: nextProps.isConnected,
      prevIsConnected: nextProps.isConnected,
    };
  }
  render () {
    return (
      if( this.state.isTextVisible ) {
        <Text>
          Connexion successful!
        </Text>
      }
    )
  }
}
```

Then Trigger a method to change back the `isTextVisible` state after 3 seconds

```jsx
class MyClass extends Component<Props, State> {

  timeoutId: ?TimeoutID;

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.isTextVisible !== this.state.isTextVisible ) {

      // If isConnected go back from true to false
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      if (this.state.isTextVisible) {
        this.timeoutID = setTimeout(() => {
          this.timeoutID = null;
          this.setState({ isTextVisible: false });
        }, 3000);
      }
    }
  }

  componentWillUnmount() {
    // Do not update the state of an unmounted component
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
```


<sup>1</sup>: See [the official documentation](https://reactjs.org/docs/react-component.html) about the full lifecycle of a React component.
