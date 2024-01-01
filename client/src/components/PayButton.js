import React, { useState, useEffect } from 'react';
import { PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentApp = () => {
  const stripe = useStripe();
  const elements = useElements()
  const [paymentRequest, setPaymentRequest] = useState(null);
  const amount = 1999
  useEffect(() => {
    if (!stripe || !elements) {
      return
    }

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    console.log({ pr });

    // Check the availability of the Payment Request API.
    pr.canMakePayment().then(result => {
      console.log({ result });
      if (result) {
        setPaymentRequest(pr);
      }
    });
    pr.on("paymentmethod", async (e) => {
      // create payment intent on server
     
      const data = {
        id: e.paymentMethod.id,
        amount
      }
      const res = await axios.post("http://localhost:5000/payment", data);
      const response =res.data;
      console.log(response);
      const {client_secret: clientSecret} = response.payment;
      // confirm payment intent on client
      const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
        payment_method: e.paymentMethod.id,
      }, {
        handleActions: false
      })
      if (error) {
        e.complete('fail')
        return
      }
      e.complete("success");
      if(paymentIntent.status === 'requires_action') {
        stripe.confirmCardPayment(clientSecret)
      }
    })
  }, [stripe, elements]);
  return (
    <>
      {paymentRequest && <PaymentRequestButtonElement options={{ paymentRequest }} />}
    </>
  )
}
export default PaymentApp