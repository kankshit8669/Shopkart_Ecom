import axios from 'axios'
import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL,
    LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAIL,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST, NEW_PASSWORD_SUCCESS, NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST, ALL_USERS_SUCCESS, ALL_USERS_FAIL,
    USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL,
    LOGOUT_SUCCESS, LOGOUT_FAIL, CLEAR_ERRORS
} from '../constants/userTypes'

const jsonConfig = { headers: { 'Content-Type': 'application/json' } }
const formConfig = { headers: { 'Content-Type': 'multipart/form-data' } }

function userError(error) {
    if (error.response && error.response.data) return error.response.data.message
    return error.message || 'Unable to complete the request'
}

function performUserRequest(dispatch, requestType, successType, failureType, apiCall, responseValue) {
    dispatch({ type: requestType })
    return apiCall()
        .then(response => dispatch({ type: successType, payload: responseValue(response.data) }))
        .catch(error => dispatch({ type: failureType, payload: userError(error) }))
}

export const requestLogin = (email, password) => dispatch =>
    performUserRequest(dispatch, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
        () => axios.post('/api/v1/login', { email, password }, jsonConfig), data => data.user)

export const requestRegister = userData => dispatch =>
    performUserRequest(dispatch, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL,
        () => axios.post('/api/v1/register', userData, formConfig), data => data.user)

export const requestLoadUser = () => dispatch =>
    performUserRequest(dispatch, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAIL,
        () => axios.get('/api/v1/me'), data => data.user)

export const requestUpdateProfile = userData => dispatch =>
    performUserRequest(dispatch, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAIL,
        () => axios.put('/api/v1/me/update', userData, formConfig), data => data.success)

export const requestUpdatePassword = passwords => dispatch =>
    performUserRequest(dispatch, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL,
        () => axios.put('/api/v1/password/update', passwords, jsonConfig), data => data.success)

export const requestForgotPassword = email => dispatch =>
    performUserRequest(dispatch, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL,
        () => axios.post('/api/v1/password/forgot', email, jsonConfig), data => data.message)

export const requestResetPassword = (token, passwords) => dispatch =>
    performUserRequest(dispatch, NEW_PASSWORD_REQUEST, NEW_PASSWORD_SUCCESS, NEW_PASSWORD_FAIL,
        () => axios.put(`/api/v1/password/reset/${token}`, passwords, jsonConfig), data => data.success)

export const requestLogout = () => dispatch =>
    axios.get('/api/v1/logout')
        .then(() => dispatch({ type: LOGOUT_SUCCESS }))
        .catch(error => dispatch({ type: LOGOUT_FAIL, payload: userError(error) }))

export const requestAllUsers = () => dispatch =>
    performUserRequest(dispatch, ALL_USERS_REQUEST, ALL_USERS_SUCCESS, ALL_USERS_FAIL,
        () => axios.get('/api/v1/admin/users'), data => data.users)

export const requestGetUserDetails = id => dispatch =>
    performUserRequest(dispatch, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL,
        () => axios.get(`/api/v1/admin/user/${id}`), data => data.user)

export const requestUpdateUser = (id, userData) => dispatch =>
    performUserRequest(dispatch, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
        () => axios.put(`/api/v1/admin/user/${id}`, userData, jsonConfig), data => data.success)

export const requestDeleteUser = id => dispatch =>
    performUserRequest(dispatch, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL,
        () => axios.delete(`/api/v1/admin/user/${id}`), data => data.success)

export const clearErrors = () => dispatch => dispatch({ type: CLEAR_ERRORS })
