import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const PUBLIC_KEY = "pk_test_51MDokICA2MBanieYBjKdH7ZvnKbgOKlPnXhqFMowjgWOP7sh5PAvDxCPBZmEhLHg0nhGy3fSz5OrUu82bVHGDjFH00e6SNmYjD";
const stripTestPromise = loadStripe(PUBLIC_KEY)

const StripeContainer = () => {
  return (
    <Elements stripe={stripTestPromise}>
        <PaymentForm />
    </Elements>
  )
}

export default StripeContainer