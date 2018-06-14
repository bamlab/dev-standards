# [Standard] Writing a Component

## Owner: Nicolas Djambazian

## Standards

**A react component begins than a `// @flow`**

Why ? Flow typings will be used to check the Props and the State



**A react component should import React with the following syntax**
```
import * as React from 'react';
```
Why ? To be able o access to the flow defined properties : https://flow.org/en/docs/react/types/


**The props and the state must be checked by flow**

Why ? It allows to :

 - Check the props are valid when you use the component
 - Be sure to have done all checks for nullable props
 - Give a good updated documentation of the props


Ex :
```
type Props = {
    title?: ?string
    id: number,
    cards: Array<{
        title: string,
    }>,
}
type State = { isOpenend: boolean };
class MyComponent extends React.PureComponent<Props, State> {
    // ...
}
```

**When we open a component file, we should see elements in that orders : props and state typings, class definition, style, hoc and then the final export**

Why ? The first thing you want to know when you open a component is his API. So the typing should be as first.

Then You want to know how it works and/or what it contains. So the class should be in seconds.

Styling is the last thing you want to know.


**The styling of a component should be in the same file at the end**

The style of a component is highlty coupled with his implementation. When you want to change the DOM, you often have to change the style and vice-versa.

If you want to use the same DOM with different styles, add a `style` props on your component.

If another component need a part of your style, you have several choices :
 - Create a third component with that style, used by both of them
 - Add this part of the style in a theme


**The Component should be exported as `default`**

To not have to think of the name of the export.

**The `render` function should come last**

To immediately know where to look for the `render` function.

**Instance methods should not be prefixed with `_`**

It is common practice to add `_` in front of the private methods of your components.
It turns out that *most* component methods are private. It would mean that most of our methods would need a `_`.

To not forget any `_`, we simply choose to not put any.

## Bad Example


```jsx
// No @flow
import React from 'react'; // Bad React import
import { Text, View } from 'react-native';

// style in an other file.
import centeredStyle from '../../../style';

// Style at the begining of the file
const styles = {
    centeredStyle,
    text: {
        color: '#bbbbbb'
    },
};

// No flow Props typing and no default export
export class Page extends React.PureComponent {
  render() {
    return (
      <View style={centeredStyle}>
        <Text style={styles.text}>{this.props.text}</Text>
      </View>
    );
  }
}

```


## Good Example
```jsx
// @flow
import * as React from 'react';
import { Text } from 'react-native';
import { CenteredPageContent } from '../components';

type Props = {
  text: string,
}

class Page extends React.PureComponent<Props> {
  render() {
    return (
      <CenteredPageContent>
        <Text style={styles.text}>{this.props.text}</Text>
      </CenteredPageContent>
    );
  }
}

const styles = {
  text: {
    color: '#bbbbbb'
  },
};

export default Page;
```

