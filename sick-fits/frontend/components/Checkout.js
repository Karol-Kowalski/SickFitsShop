import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import { useCart } from '../lib/CartState';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px tgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1px;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {
    // 1. Stop the form submiting and turn the loader one
    e.preventDefault();
    setLoading(true);
    // 2. Start the page transition
    nProgress.start();
    // 3. Create the payment method via stripe (Token comes back here if successful)
    const { error2, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);
    // 4. Handle any errors from stripe
    if (error2) {
      setError(error2);
      nProgress.done();
      return; // stops the checkout from happening
    }
    // 5. Send the token from step 3 to keystone server, via custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    console.log('Finished with the order!');
    // 6. change the page to view the order
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });
    // 7. Close the cart
    closeCart();

    // 8. turn the loader off
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p>{error.message}</p>}
      {graphQLError && <p>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };
