import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const PUBLIC_KEY = "pk_test_51MDokICA2MBanieYBjKdH7ZvnKbgOKlPnXhqFMowjgWOP7sh5PAvDxCPBZmEhLHg0nhGy3fSz5OrUu82bVHGDjFH00e6SNmYjD";
const stripTestPromise = loadStripe(PUBLIC_KEY);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
     <Elements stripe={stripTestPromise}>
     <App />
    </Elements>
    
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
