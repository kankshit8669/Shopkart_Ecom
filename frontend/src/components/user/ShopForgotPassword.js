import React, { Fragment, useState, useEffect } from 'react'

import ShopMetaData from '../layout/ShopMetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { requestForgotPassword, clearErrors } from '../../actions/userRequests'

const ShopForgotPassword = () => {

    const [email, setEmail] = useState('')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, loading, message } = useSelector(state => state.requestForgotPassword)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            alert.success(message)
        }

    }, [dispatch, alert, error, message])

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('email', email);

        dispatch(requestForgotPassword(formData))
    }

    return (
        <Fragment>
            <ShopMetaData title={'Forgot Password'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={onSubmit}>
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false} >
                            Send Email
                    </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default ShopForgotPassword
