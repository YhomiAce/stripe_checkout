const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// app.use(express.json())
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }));

const stripe = require("stripe")(process.env.STRIPE_SECRET);

app.use(cors());

const storeItems = new Map([
    [1, { priceIncents: 10000, name: "Learn React" }],
    [2, { priceIncents: 20000, name: "Learn NodeJs" }],
    [3, { priceIncents: 50000, name: "Learn MERN Stack" }]
]);

app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id);
                console.log(storeItem);
                return {
                    quantity: item.quantity,
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceIncents
                    }
                }
            }),
            mode: 'payment',
            success_url: `${process.env.REACT_URL}/success`,
            cancel_url: `${process.env.REACT_URL}/cancel`,
        });
        console.log({ session });
        return res.status(201).send({
            success: true,
            url: session.url
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "server error"
        })
    }
})

app.post("/payment", async (req, res) => {
    console.log(req.body);
    const { amount, id } = req.body;
    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Yhomi Ace",
            payment_method: id
        });
        console.log({ payment });
        return res.status(200).send({
            success: true,
            message: "Payment successful",
            payment
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send({
            success: false,
            message: "Payment failed"
        })
    }
})

app.post("/payment-intent", async (req, res) => {
    console.log(req.body);
    const { amount } = req.body;
    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Yhomi Ace",
            automatic_payment_methods: {
                enabled: true
            }
        });
        console.log({ payment });
        return res.status(200).send({
            success: true,
            message: "Payment successful",
            payment
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send({
            success: false,
            message: "Payment failed"
        })
    }
})

app.post("/subscribe", async (req, res) => {
    try {
        const { name, email, paymentMethod, amount} = req.body;
        // Create customer
        const customer = await stripe.customers.create({
            email,
            name,
            payment_method: paymentMethod,
            invoice_settings: { default_payment_method: paymentMethod}
        })
        // Create Product
        const product = await stripe.products.create({
            name: "Weekly Subscription"
        });
        // Create Subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price_data: {
                        currency: "USD",
                        product: product.id,
                        unit_amount:  amount,
                        recurring: {
                            interval: "day" // day, month, week, year
                        }
                    }
                }
            ],
            payment_settings: {
                payment_method_types: ["card"],
                save_default_payment_method: "on_subscription"
            },
            expand: ["latest_invoice.payment_intent"]
        })
        console.log({subscription});
        // Send back client secret
        return res.status(200).send({
            success: true,
            clientSecret: subscription.latest_invoice.client_secret,
            subscriptionId: subscription.id
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "server error"
        })
    }
})

app.post("/webhook", async (req, res) => {
    let data;
    let eventType;
    // console.log({ body: req.body });
    // console.log({ headers: req.headers });
    // Check if webhook signing is configured.
    const webhookSecret = "whsec_da996a3a638232275788c72cba8c69b6f75e85d2fe657622c795552cdb6c853c";
    if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];
        // console.log({ signature });

        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }
    let subscription;
    let status;
    switch (eventType) {
        case 'checkout.session.completed':
            // console.log({ eventType, data: req.body.data });
            // Payment is successful and the subscription is created.
            // You should provision the subscription and save the customer ID to your database.
            break;
        case 'invoice.paid':
            // console.log({ eventType, data: req.body.data });
            // Continue to provision the subscription as payments continue to be made.
            // Store the status in your database and check when a user accesses your service.
            // This approach helps you avoid hitting rate limits.
            break;
        case 'invoice.payment_failed':
            // console.log({ eventType, data: req.body.data });
            // The payment failed or the customer does not have a valid payment method.
            // The subscription becomes past_due. Notify your customer and send them to the
            // customer portal to update their payment information.
            break;
        case 'customer.subscription.trial_will_end':
            subscription = req.body.data;
            status = subscription.status;
            // console.log(`Subscription status is ${status}.`);
            // Then define and call a method to handle the subscription trial ending.
            // handleSubscriptionTrialEnding(subscription);
            break;
        case 'customer.subscription.deleted':
            subscription = req.body.data;
            status = subscription.status;
            // console.log(`Subscription status is ${status}.`);
            // Then define and call a method to handle the subscription deleted.
            // handleSubscriptionDeleted(subscriptionDeleted);
            break;
        case 'customer.subscription.created':
            subscription = req.body.data;
            status = subscription.status;
            // console.log(`Subscription status is ${status}.`);
            // Then define and call a method to handle the subscription created.
            // handleSubscriptionCreated(subscription);
            break;
        case 'customer.subscription.updated':
            subscription = req.body.data;
            status = subscription.status;
            // console.log(`Subscription status is ${status}.`);
            // Then define and call a method to handle the subscription update.
            // handleSubscriptionUpdated(subscription);
            break;
        default:
            // console.log({ eventType, data: req.body.data });
        // Unhandled event type
    }

    res.sendStatus(200);
});

app.listen(5000, () => console.log('Server started on Port 5000'))