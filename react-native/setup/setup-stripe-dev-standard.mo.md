# [MO] Setup Stripe in app payment form with tipsi-stripe (~2 hours)

## Owner: [Guillaume Renouvin](https://github.com/GuillaumeRenouvin)

## Prerequisites
- Have a Stripe account and its publishable/secret key duet that you can find on [your Stripe account](https://dashboard.stripe.com/login)

## Context
On a project, I had to let my user pay within my React Native app. My client wanted to use Stripe services.

First I tried to develop a browser solution with [stripe element](https://stripe.com/docs/stripe-js/elements/quickstart). I had two problems:
- It was really time consuming to develop a web page for the payment;
- It made the user navigate back and forth from the app to their web browser, resulting in a really poor user experience.

I then found out [tipsi-stripe](https://github.com/tipsi/tipsi-stripe) which is a React Native library that wraps the Stripe native SDK for iOS and Android. It only took me 2 hours to set it up and granted a far better user experience, satisfying our client ;).

## However your client should be aware of
- [tipsi-stripe](https://github.com/tipsi/tipsi-stripe) only supports english;
- [tipsi-stripe](https://github.com/tipsi/tipsi-stripe) has not been audited by Stripe yet. The PCI DSS (Payment Card Industry Data Security Standard) regulation committee recently forced Stripe to stop accepting credit card data from direct calls to their API. Therefore, they enforced the usage of "Stripe-controlled" libraries like Elements and their own SDKs.  
**It means, Stripe could actually ask you to stop using tipsi in order to fit new PCI DSS requirements anytime.**  
So far, tipsi-stripe uses direct calls to Stripe SDKs and therefore, we did not receive any warning from them, still you should keep it in mind.

However, even if Stripe asked you to stop using tipsi, the time loss would be light as it only takes around 2 hours to install the lib. Setting up browser payment would take more than a day and offers a poorer UX.

## Steps (~1 hour)
- Install tipsi-stripe package following its [installation documentation](https://github.com/tipsi/tipsi-stripe#installation)
**check:**
  - Break point in iOS in the code;
  - Break point in Android in the code;
  - `console.log(NativeModules)` (where NativeModules is a react native import) should show the tipsi-stripe module
- I recommend to use the basic add card form to be Stripe friendly
[Documentation](https://github.com/tipsi/tipsi-stripe#request-with-card-form)

```js
import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import stripe from 'tipsi-stripe';

const ENV = "staging";
export default class Payment extends PureComponent<PropsType, StatesType> {
  props: PropsType;
  states: StatesType;

  static title = 'Card Form';

  state = {
    token: null,
  };

  componentDidMount() {
    stripe.init({ // Place this in the App.js file
      publishableKey: "fake token",
      androidPayMode: ENV === "production" ? "production" : "test"
    });
  }

  handleCardPayPress = async () => {
    try {
      this.setState({
        token: null,
      });
      const token = await stripe.paymentRequestWithCardForm({
        smsAutofillDisabled: true,
      });

      this.setState({
        token,
      });
      this.props.addCard(token.tokenId);
    } catch (error) {}
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.handleCardPayPress}
      >
        <Text>Payment</Text>
      </TouchableOpacity>
    );
  }
}
```

### Plug it with your back
With Stripe, you have a publishable key that you can store on you application and a private key that should never appear in any distributed binary. The publishable key can only be used to create tokens from card informations. Then, you have to combine them with the private key to post it to Stripe through their API.   
**Therefore the private key should only be used server side.**  
You can find more information [here](https://stripe.com/docs/dashboard#api-keys).

Here is the most basic example of the relations between your app, your server and Stripe for a payment:
![Stripe payment example](./assets/stripe_basic_payment.png)
