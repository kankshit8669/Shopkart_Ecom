import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import ShopHeader from './components/layout/ShopHeader'
import ShopFooter from './components/layout/ShopFooter'

import ShopHome from './components/ShopHome'
import ShopProductDetails from './components/product/ShopProductDetails'

// Cart Imports
import ShopCart from './components/cart/ShopCart'
import ShopShipping from './components/cart/ShopShipping'
import ShopConfirmOrder from './components/cart/ShopConfirmOrder'
import ShopPayment from './components/cart/ShopPayment'
import ShopOrderSuccess from './components/cart/ShopOrderSuccess'

// Order Imports
import ShopListOrders from './components/order/ShopListOrders'
import ShopOrderDetails from './components/order/ShopOrderDetails'

// Auth or User imports
import ShopLogin from './components/user/ShopLogin'
import ShopRegister from './components/user/ShopRegister'
import ShopProfile from './components/user/ShopProfile'
import ShopUpdateProfile from './components/user/ShopUpdateProfile'
import ShopUpdatePassword from './components/user/ShopUpdatePassword'
import ShopForgotPassword from './components/user/ShopForgotPassword'
import ShopNewPassword from './components/user/ShopNewPassword'

// Admin Imports
import ShopDashboard from './components/admin/ShopDashboard'
import ShopProductsList from './components/admin/ShopProductsList'
import ShopNewProduct from './components/admin/ShopNewProduct'
import ShopUpdateProduct from './components/admin/ShopUpdateProduct'
import ShopOrdersList from './components/admin/ShopOrdersList'
import ShopProcessOrder from './components/admin/ShopProcessOrder'
import ShopUsersList from './components/admin/ShopUsersList'
import ShopUpdateUser from './components/admin/ShopUpdateUser'
import ShopProductReviews from './components/admin/ShopProductReviews'


import ShopProtectedRoute from './components/route/ShopProtectedRoute'
import { requestLoadUser } from './actions/userRequests'
import { useSelector } from 'react-redux'
import store from './store'
import axios from 'axios'

// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function ShopApplication() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(requestLoadUser())

    async function getStripePublicKey() {
      try {
        const { data } = await axios.get('/api/v1/stripeapi');
        if (data.stripeApiKey) setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        // The catalog and account pages still work without payment setup.
        setStripeApiKey('');
      }
    }

    getStripePublicKey();

  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <ShopHeader />
        <div className="container container-fluid">
          <Route path="/" component={ShopHome} exact />
          <Route path="/search/:keyword" component={ShopHome} />
          <Route path="/product/:id" component={ShopProductDetails} exact />

          <Route path="/cart" component={ShopCart} exact />
          <ShopProtectedRoute path="/shipping" component={ShopShipping} />
          <ShopProtectedRoute path="/confirm" component={ShopConfirmOrder} exact />
          <ShopProtectedRoute path="/success" component={ShopOrderSuccess} />
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ShopProtectedRoute path="/payment" component={ShopPayment} />
            </Elements>
          }

          <Route path="/login" component={ShopLogin} />
          <Route path="/register" component={ShopRegister} />
          <Route path="/password/forgot" component={ShopForgotPassword} exact />
          <Route path="/password/reset/:token" component={ShopNewPassword} exact />
          <ShopProtectedRoute path="/me" component={ShopProfile} exact />
          <ShopProtectedRoute path="/me/update" component={ShopUpdateProfile} exact />
          <ShopProtectedRoute path="/password/update" component={ShopUpdatePassword} exact />

          <ShopProtectedRoute path="/orders/me" component={ShopListOrders} exact />
          <ShopProtectedRoute path="/order/:id" component={ShopOrderDetails} exact />
        </div>

        <ShopProtectedRoute path="/dashboard" isAdmin={true} component={ShopDashboard} exact />
        <ShopProtectedRoute path="/admin/products" isAdmin={true} component={ShopProductsList} exact />
        <ShopProtectedRoute path="/admin/product" isAdmin={true} component={ShopNewProduct} exact />
        <ShopProtectedRoute path="/admin/product/:id" isAdmin={true} component={ShopUpdateProduct} exact />
        <ShopProtectedRoute path="/admin/orders" isAdmin={true} component={ShopOrdersList} exact />
        <ShopProtectedRoute path="/admin/order/:id" isAdmin={true} component={ShopProcessOrder} exact />
        <ShopProtectedRoute path="/admin/users" isAdmin={true} component={ShopUsersList} exact />
        <ShopProtectedRoute path="/admin/user/:id" isAdmin={true} component={ShopUpdateUser} exact />
        <ShopProtectedRoute path="/admin/reviews" isAdmin={true} component={ShopProductReviews} exact />

        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <ShopFooter />
        )}
      </div>
    </Router>
  );
}

export default ShopApplication;
