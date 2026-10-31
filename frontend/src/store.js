import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
    reduceProductsReducer, reduceNewProductReducer, reduceProductReducer,
    reduceProductDetailsReducer, reduceNewReviewReducer,
    reduceProductReviewsReducer, reduceReviewReducer
} from './reducers/productState';
import {
    reduceAuthReducer, reduceUserReducer, reduceForgotPasswordReducer,
    reduceAllUsersReducer, reduceUserDetailsReducer
} from './reducers/userState';
import { reduceCartReducer } from './reducers/cartState';
import {
    reduceNewOrderReducer, reduceMyOrdersReducer, reduceOrderDetailsReducer,
    reduceAllOrdersReducer, reduceOrderReducer
} from './reducers/orderState';

function readSavedValue(key, fallback) {
    try {
        const saved = window.localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        return fallback;
    }
}

const reducers = combineReducers({
    products: reduceProductsReducer,
    productDetails: reduceProductDetailsReducer,
    requestNewProduct: reduceNewProductReducer,
    product: reduceProductReducer,
    productReviews: reduceProductReviewsReducer,
    review: reduceReviewReducer,
    auth: reduceAuthReducer,
    user: reduceUserReducer,
    requestAllUsers: reduceAllUsersReducer,
    userDetails: reduceUserDetailsReducer,
    requestForgotPassword: reduceForgotPasswordReducer,
    cart: reduceCartReducer,
    newOrder: reduceNewOrderReducer,
    requestMyOrders: reduceMyOrdersReducer,
    requestAllOrders: reduceAllOrdersReducer,
    orderDetails: reduceOrderDetailsReducer,
    order: reduceOrderReducer,
    requestNewReview: reduceNewReviewReducer
});

const savedCart = {
    cartItems: readSavedValue('cartItems', []),
    shippingInfo: readSavedValue('shippingInfo', {})
};

const store = createStore(
    reducers,
    { cart: savedCart },
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
