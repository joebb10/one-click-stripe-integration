import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

//import { checkAuth } from './Routes/ProtectedRoutes';

import Login from './Pages/_Login.jsx';
import Pricing from './Pages/Pricing.jsx';
import Error from './Pages/Error.jsx';
import StripeIntegrationForm from './Pages/Uranx.jsx';



function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Login />} />

        <Route path='/uranx' element={<StripeIntegrationForm />} />
        <Route path='/pricing' element={<Pricing />} />

       
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
