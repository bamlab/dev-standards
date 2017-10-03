# [Standard] Binding functions in react components

## Owner: [Jean Faverie](https://github.com/jfaverie)

> **Note**: Please create an [issue](https://github.com/bamlab/dev-standards/issues/new) or even a Pull Request with your feedback, typo correction.

## Context

During this standard, we will take an example from the egghead react native tutorial when launching an event with a submit button.

The tutorial does it the old ES5 way when we should better use the ES6 way (with arrow functions).

## Prerequisites (~4 min)

- Have **react-native** installed (`npm i -g react-native-cli`) (~2 min)
- Have a react-native projet (`react-native init <project name`) (~2 min)

## Checks

### Bad Examples :
When using the TextInput onChange, the tutorial tells you to define an handleChange function this way (CAUTION, this is a BAD EXAMPLE) :

```javascript
class Test extends Component {
  // ...
  handleChange(event) {
    this.setState({
      username: event.nativeEvent.text,
    });
  }
  // ...
  render() {
    return (
      <TextInput
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}
```

- This is bad in two ways : performance and syntax.

1. Performance : the first problem here is we use `bind` at every `onChange` event, which is very costly. What we coud do is (still not optimal) : 

```javascript
class Test extends Component {
  // ...
  handleChange(event) {
    this.setState({
      username: event.nativeEvent.text,
    }).bind(this);
  }
  // ...
  render() {
    return (
      <TextInput
        onChange={this.handleChange}
      />
    )
  }
}
```
we improve our performance, as we only bind at the creation of the class. This is not ideal though.

2. The `bind` function is used to be sure to use the good context (the `this` of the class, not the one of the handleChange function). 

### Good Examples :
We can improve the syntax by using an arrow function, which has no proper context and uses the context of the class (you can use tis example).

```javascript
class Test extends Component {
  // ...
  handleChange = event => {
    this.setState({
      username: event.nativeEvent.text,
    });
  };
  // ...
  render() {
    return (
      <TextInput
        onChange={this.handleChange}
      />
    )
  }
}
```

The `this` inside the arrow function `handleChange` now refers to the `Test` class.
