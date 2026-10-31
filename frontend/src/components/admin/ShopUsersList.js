import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import ShopMetaData from '../layout/ShopMetaData'
import ShopLoader from '../layout/ShopLoader'
import ShopSidebar from './ShopSidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { requestAllUsers, requestDeleteUser, clearErrors } from '../../actions/userRequests'
import { DELETE_USER_RESET } from '../../constants/userTypes'

const ShopUsersList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector(state => state.requestAllUsers);
    const { isDeleted } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(requestAllUsers());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('User deleted successfully');
            history.push('/admin/users');
            dispatch({ type: DELETE_USER_RESET })
        }

    }, [dispatch, alert, error, isDeleted, history])

    const onDeleteUser = (id) => {
        dispatch(requestDeleteUser(id))
    }

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

                actions: <Fragment>
                    <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => onDeleteUser(user._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }


    return (
        <Fragment>
            <ShopMetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <ShopSidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Users</h1>

                        {loading ? <ShopLoader /> : (
                            <MDBDataTable
                                data={setUsers()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default ShopUsersList
