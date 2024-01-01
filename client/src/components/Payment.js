import { Elements} from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaymentCard from './PaymentCard';
import { loadStripe } from '@stripe/stripe-js';
import { ProgressBar } from 'react-bootstrap';


const PUBLIC_KEY = "pk_test_51MDokICA2MBanieYBjKdH7ZvnKbgOKlPnXhqFMowjgWOP7sh5PAvDxCPBZmEhLHg0nhGy3fSz5OrUu82bVHGDjFH00e6SNmYjD";
const stripTestPromise = loadStripe(PUBLIC_KEY);


const Payment = () => {
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setloading] = useState(false);
    const amount = 5999

    useEffect(() => {
        setloading(true)
        axios.post("http://localhost:5000/payment", {amount}).then(res => {
            console.log(res.data);
            setClientSecret(res.data.payment.client_secret)
            setloading(false)
        })
    }, []);

    if (loading) {
        return <ProgressBar />
    }

    return (
        <>
        <Elements stripe={stripTestPromise} options={{clientSecret}}>
            <PaymentCard />
        </Elements>
        </>
    )
}

export default Payment