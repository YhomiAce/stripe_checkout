import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PayButton from './PayButton';

const PUBLIC_KEY = "pk_test_51MDokICA2MBanieYBjKdH7ZvnKbgOKlPnXhqFMowjgWOP7sh5PAvDxCPBZmEhLHg0nhGy3fSz5OrUu82bVHGDjFH00e6SNmYjD";
const stripTestPromise = loadStripe(PUBLIC_KEY)

const BaseElement = () => {
  return (
    <Elements stripe={stripTestPromise}>
        <PayButton />
    </Elements>
  )
}

export default BaseElement