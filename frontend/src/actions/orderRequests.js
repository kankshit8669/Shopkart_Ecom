import axios from 'axios'
import {
    CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST, MY_ORDERS_SUCCESS, MY_ORDERS_FAIL,
    ALL_ORDERS_REQUEST, ALL_ORDERS_SUCCESS, ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST, UPDATE_ORDER_SUCCESS, UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS, DELETE_ORDER_FAIL,
    ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL,
    CLEAR_ERRORS
} from '../constants/orderTypes'

const jsonHeaders = { headers: { 'Content-Type': 'application/json' } }

function getErrorMessage(error) {
    return error.response && error.response.data
        ? error.response.data.message
        : error.message || 'Could not complete the request'
}

function runOrderRequest(dispatch, loadingType, successType, errorType, request, selectData) {
    dispatch({ type: loadingType })
    return request()
        .then(response => {
            dispatch({ type: successType, payload: selectData(response.data) })
        })
        .catch(error => {
            dispatch({ type: errorType, payload: getErrorMessage(error) })
        })
}

export const requestCreateOrder = order => dispatch =>
    runOrderRequest(dispatch, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAIL,
        () => axios.post('/api/v1/order/new', order, jsonHeaders), data => data)

export const requestMyOrders = () => dispatch =>
    runOrderRequest(dispatch, MY_ORDERS_REQUEST, MY_ORDERS_SUCCESS, MY_ORDERS_FAIL,
        () => axios.get('/api/v1/orders/me'), data => data.orders)

export const requestGetOrderDetails = id => dispatch =>
    runOrderRequest(dispatch, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL,
        () => axios.get(`/api/v1/order/${id}`), data => data.order)

export const requestAllOrders = () => dispatch =>
    runOrderRequest(dispatch, ALL_ORDERS_REQUEST, ALL_ORDERS_SUCCESS, ALL_ORDERS_FAIL,
        () => axios.get('/api/v1/admin/orders'), data => data)

export const requestUpdateOrder = (id, orderData) => dispatch =>
    runOrderRequest(dispatch, UPDATE_ORDER_REQUEST, UPDATE_ORDER_SUCCESS, UPDATE_ORDER_FAIL,
        () => axios.put(`/api/v1/admin/order/${id}`, orderData, jsonHeaders), data => data.success)

export const requestDeleteOrder = id => dispatch =>
    runOrderRequest(dispatch, DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS, DELETE_ORDER_FAIL,
        () => axios.delete(`/api/v1/admin/order/${id}`), data => data.success)

export const clearErrors = () => dispatch => dispatch({ type: CLEAR_ERRORS })
