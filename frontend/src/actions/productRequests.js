import axios from 'axios'
import {
    ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAIL,
    ADMIN_PRODUCTS_REQUEST, ADMIN_PRODUCTS_SUCCESS, ADMIN_PRODUCTS_FAIL,
    NEW_PRODUCT_REQUEST, NEW_PRODUCT_SUCCESS, NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST, NEW_REVIEW_SUCCESS, NEW_REVIEW_FAIL,
    GET_REVIEWS_REQUEST, GET_REVIEWS_SUCCESS, GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, DELETE_REVIEW_FAIL,
    CLEAR_ERRORS
} from '../constants/productTypes'

const jsonHeaders = { headers: { 'Content-Type': 'application/json' } }

function errorText(error) {
    return error.response && error.response.data
        ? error.response.data.message
        : error.message || 'Unable to complete that request. Please try again.'
}

function sendProductRequest(dispatch, requestType, successType, failType, request, result) {
    dispatch({ type: requestType })
    return request()
        .then(response => dispatch({ type: successType, payload: result(response.data) }))
        .catch(error => dispatch({ type: failType, payload: errorText(error) }))
}

function listUrl(keyword, currentPage, price, category, rating) {
    const values = [
        `keyword=${encodeURIComponent(keyword)}`,
        `page=${currentPage}`,
        `price[lte]=${price[1]}`,
        `price[gte]=${price[0]}`,
        `ratings[gte]=${rating}`
    ]
    if (category) values.push(`category=${encodeURIComponent(category)}`)
    return `/api/v1/products?${values.join('&')}`
}

export const requestGetProducts = (keyword = '', currentPage = 1, price, category, rating = 0) => dispatch =>
    sendProductRequest(dispatch, ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAIL,
        () => axios.get(listUrl(keyword, currentPage, price, category, rating)), data => data)

export const requestGetAdminProducts = () => dispatch =>
    sendProductRequest(dispatch, ADMIN_PRODUCTS_REQUEST, ADMIN_PRODUCTS_SUCCESS, ADMIN_PRODUCTS_FAIL,
        () => axios.get('/api/v1/admin/products'), data => data.products)

export const requestGetProductDetails = id => dispatch =>
    sendProductRequest(dispatch, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,
        () => axios.get(`/api/v1/product/${id}`), data => data.product)

export const requestNewProduct = productData => dispatch =>
    sendProductRequest(dispatch, NEW_PRODUCT_REQUEST, NEW_PRODUCT_SUCCESS, NEW_PRODUCT_FAIL,
        () => axios.post('/api/v1/admin/product/new', productData, jsonHeaders), data => data)

export const requestUpdateProduct = (id, productData) => dispatch =>
    sendProductRequest(dispatch, UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAIL,
        () => axios.put(`/api/v1/admin/product/${id}`, productData, jsonHeaders), data => data.success)

export const requestDeleteProduct = id => dispatch =>
    sendProductRequest(dispatch, DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAIL,
        () => axios.delete(`/api/v1/admin/product/${id}`), data => data.success)

export const requestNewReview = reviewData => dispatch =>
    sendProductRequest(dispatch, NEW_REVIEW_REQUEST, NEW_REVIEW_SUCCESS, NEW_REVIEW_FAIL,
        () => axios.put('/api/v1/review', reviewData, jsonHeaders), data => data.success)

export const requestGetProductReviews = id => dispatch =>
    sendProductRequest(dispatch, GET_REVIEWS_REQUEST, GET_REVIEWS_SUCCESS, GET_REVIEWS_FAIL,
        () => axios.get(`/api/v1/reviews?id=${encodeURIComponent(id)}`), data => data.reviews)

export const requestDeleteReview = (id, productId) => dispatch =>
    sendProductRequest(dispatch, DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, DELETE_REVIEW_FAIL,
        () => axios.delete(`/api/v1/reviews?id=${encodeURIComponent(id)}&productId=${encodeURIComponent(productId)}`),
        data => data.success)

export const clearErrors = () => dispatch => dispatch({ type: CLEAR_ERRORS })
