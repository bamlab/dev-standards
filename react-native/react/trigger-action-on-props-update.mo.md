# [MO] Trigger action on props update with componentWillReceiveProps

## Owner: Yassine Chbani

## Motivation

If you have ever worked with React, you will have probably used Redux at some point and found it great as your components can
subscribe to any changes to the store state and react accordingly. But what happens if you want to similarly handle the update
of one of your component's props? For example, call a certain method for a given change of the props?

Well you're in luck, because Facebook provides a set of methods that get called at different points of the lifecycle of a component <sup>1</sup>. We are going to look at the `ComponentWillReceiveProps`method in the following article.


## Prerequisites

Your page has a set of props that can change after it has been mounted and before it gets unmounted. The props change can be
triggered from within or outside the page.

## Steps (~10 minutes)

- Add to your prop a component that gets updated from outside the page e.g. from a Redux store:

```jsx
import { Connectivity } from '../../../Connectivity';

const mapStateToProps = state => ({
  isConnected: Connectivity.isConnected(state),
});
```

Let’s also add a component which is rendered at a certain `isTextVisible` condition:

```jsx
class MyClass extends Component {
	state = {
		isConnected: false
		isTextVisible: false
	}

	render () {
		return (
			if( this.isTextVisible ) {
				<Text>
					Connexion successful!
				</Text>
			}
		)
	}
}
```

Let’s say you want to have a special behaviour for this Text component, such that it appears for 3 seconds when `isConnected` changes from `false` to `true`.

```jsx
componentWillReceiveProps (nextProps) {
	if (!this.props.isConnected && nextProps.isConnected) {
		this.setState(isActivated, () => this.makeTextDisappear())
	}
}

makeTextDisappear = () => {
	setTimeout(() => this.setState({isTextVisible: false}), 3000)
}
```

The critical point here is the `if (!this.props.isConnected && nextProps.isConnected)` condition (also called hook). It is necessary to be specific about what prop change triggers the desired action, because `componentWillReceiveProps` is called at every prop update and the code inside is executed each time then. Our code now looks like this:

```jsx
import { Connectivity } from '../../../Connectivity';

class MyClass extends Component {
	state = {
		isConnected: false
		isTextVisible: false
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.isConnected && nextProps.isConnected) {
			this.setState(isActivated, () => this.makeTextDisappear())
		}
	}

	makeTextDisappear = () => {
		setTimeout(() => this.setState({isTextVisible: false}), 3000)
	}

	render () {
		return (
			if( this.isTextVisible ) {
				<Text>
					Connexion successful!
				</Text>
			}
		)
	}
}

const mapStateToProps = state => ({
  isConnected: Connectivity.isConnected(state),
});
```

A couple of interesting notes<sup>2</sup>:
- `componentWillReceiveProps` can be called even if the props did not change
- If done before `render()`is called, then calling `setState` will not trigger an additional render

<sup>1</sup> : See [this](https://engineering.musefind.com/react-lifecycle-methods-how-and-when-to-use-them-2111a1b692b1) or
[that article](https://reactjs.org/docs/react-component.html) about the full lifecycle of a React component.

<sup>2</sup> : https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/component_will_receive_props.html
