import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartTypes';

const initialState = { cartItems: [], shippingInfo: {} };

export function reduceCartReducer(state = initialState, action) {
    if (action.type === SAVE_SHIPPING_INFO) {
        return { ...state, shippingInfo: { ...action.payload } };
    }

    if (action.type === REMOVE_ITEM_CART) {
        const remaining = state.cartItems.filter(item => item.product !== action.payload);
        return { ...state, cartItems: remaining };
    }

    if (action.type === ADD_TO_CART) {
        const newItem = action.payload;
        const position = state.cartItems.findIndex(item => item.product === newItem.product);
        const updatedItems = state.cartItems.slice();
        if (position === -1) updatedItems.push(newItem);
        else updatedItems[position] = newItem;
        return { ...state, cartItems: updatedItems };
    }

    return state;
}
