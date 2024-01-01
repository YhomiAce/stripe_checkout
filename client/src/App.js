import './App.css';
import StripeContainer from './components/StripeContainer';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import SuccessCheckout from './components/SuccessCheckout';
import FailedCheckout from './components/FailedCheckout';
import Checkout from './components/Checkout';
import CancelCheckout from './components/CancelCheckout';
import BaseElement from './components/BaseElement';
import SubscribeButton from './components/SubscribeButton';
import PaymentCard from './components/Payment';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<StripeContainer />}  />
        <Route path='/pay' element={<BaseElement />}  />
        <Route path='/card' element={<PaymentCard />}  />
        <Route path='/subscribe' element={<SubscribeButton />}  />
        <Route path='/checkout' element={<Checkout />}  />
        <Route path='/success' element={<SuccessCheckout />} />
        <Route path='/fail' element={<FailedCheckout />} />
        <Route path='/cancel' element={<CancelCheckout />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
