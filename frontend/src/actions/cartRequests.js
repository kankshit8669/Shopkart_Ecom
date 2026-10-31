import axios from 'axios';
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartTypes';

function rememberCart(cart) {
    window.localStorage.setItem('cartItems', JSON.stringify(cart));
}

function productForCart(product, selectedQuantity) {
    const quantity = Math.min(Math.max(parseInt(selectedQuantity, 10) || 1, 1), product.stock);
    return {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images.length ? product.images[0].url : '',
        stock: product.stock,
        quantity
    };
}

export const requestAddItemToCart = (productId, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${productId}`);
    if (data.product.stock <= 0) return;
    const cartItem = productForCart(data.product, quantity);
    dispatch({ type: ADD_TO_CART, payload: cartItem });
    rememberCart(getState().cart.cartItems);
};

export const requestRemoveItemFromCart = productId => (dispatch, getState) => {
    dispatch({ type: REMOVE_ITEM_CART, payload: productId });
    rememberCart(getState().cart.cartItems);
};

export const requestSaveShippingInfo = shippingInfo => dispatch => {
    dispatch({ type: SAVE_SHIPPING_INFO, payload: shippingInfo });
    window.localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
};
