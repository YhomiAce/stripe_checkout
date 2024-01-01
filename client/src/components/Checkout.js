import React from 'react';
import { Button, Stack, Container } from 'react-bootstrap';
import axios from 'axios';


const Checkout = () => {
    const checkoutStripe = async() => {
        try {
            const items = [
                {
                    id: 1, quantity: 3
                },
                {
                    id: 2, quantity: 1
                }
            ]
            const data = {items}
            const res = await axios.post("http://localhost:5000/create-checkout-session", data)
            const { url } = res.data;
            window.location = url
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Container className='mt-4'>
            <Stack direction="horizontal" gap={2}>
                <Button onClick={checkoutStripe} as="a" variant="primary">
                    Checkout
                </Button>
                {/* <Button as="a" variant="success">
                    Button as link
                </Button> */}
            </Stack>
        </Container>
    )
}

export default Checkout