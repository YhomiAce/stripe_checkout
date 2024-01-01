import React, {useState} from 'react';
import { CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from 'axios';


const PaymentForm = () => {
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

        if (!error) {
            try {
                const {id } = paymentMethod
                const data = {
                    id,
                    amount: 1000
                }
                const response = await axios.post("http://localhost:5000/payment", data);
                if (response.data.success) {
                    console.log("Successful Payment");
                    setSuccess(true)
                }
            } catch (error) {
                console.log('Error', error);
            }
        }else{
            console.log(error.message);
        }
    }


  return (
    <>
    {
        !success ?
        <form onSubmit={handleSubmit}>
            <fieldset className='FormGroup'>
                <div className="FormRow">
                    <CardElement />
                </div>
            </fieldset>
            <button>Pay with Card</button>
        </form> :
        <div>
            <h2>You just bought something</h2>
        </div>
    }
    </>
  )
}

export default PaymentForm