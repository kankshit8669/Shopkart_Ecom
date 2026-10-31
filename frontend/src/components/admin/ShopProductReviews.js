import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTable } from 'mdbreact'

import ShopMetaData from '../layout/ShopMetaData'
import ShopLoader from '../layout/ShopLoader'
import ShopSidebar from './ShopSidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { requestGetProductReviews, requestDeleteReview, clearErrors } from '../../actions/productRequests'
import { DELETE_REVIEW_RESET } from '../../constants/productTypes'

const ShopProductReviews = () => {

    const [productId, setProductId] = useState('')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, reviews } = useSelector(state => state.productReviews);
    const { isDeleted, error: deleteError } = useSelector(state => state.review)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (productId !== '') {
            dispatch(requestGetProductReviews(productId))
        }

        if (isDeleted) {
            alert.success('Review deleted successfully');
            dispatch({ type: DELETE_REVIEW_RESET })
        }



    }, [dispatch, alert, error, productId, isDeleted, deleteError])

    const onDeleteReview = (id) => {
        dispatch(requestDeleteReview(id, productId))
    }

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(requestGetProductReviews(productId))
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,

                actions:
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => onDeleteReview(review._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <ShopMetaData title={'Product Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <ShopSidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={onSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="productId_field">Enter ShopProduct ID</label>
                                        <input
                                            type="text"
                                            id="productId_field"
                                            className="form-control"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        SEARCH
								    </button>
                                </ form>
                            </div>

                        </div>

                        {reviews && reviews.length > 0 ? (
                            <MDBDataTable
                                data={setReviews()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        ) : (
                                <p className="mt-5 text-center">No Reviews.</p>
                            )}


                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default ShopProductReviews
