import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { Button, Container, Stack } from 'react-bootstrap';
import axios from 'axios';

const PaymentCard = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setisLoading] = useState(false);
    const amount = 5999
    // const paymentElement = elements.create('payment', {
    //     layout: {
    //       type: 'accordion',
    //       defaultCollapsed: false,
    //       radios: true,
    //       spacedAccordionItems: false
    //     }
    //   });

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            return;
        }
        setisLoading(true)
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`
            }
        });
        console.log({ paymentIntent });

        if (error) {
            console.log(error);
        }
    }

    return (
        <Container className='mt-4'>
            <PaymentElement />
            <Stack direction="horizontal" gap={2}>
                <Button as="a" variant="primary" onClick={handleSubmit} className='mt-3 btn-block'>
                    PAY
                </Button>

            </Stack>
        </Container>
    )
}

export default PaymentCard