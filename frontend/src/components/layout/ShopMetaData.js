import React from 'react'
import { Helmet } from 'react-helmet'

const ShopMetaData = ({ title }) => {
    return (
        <Helmet>
            <title>{`${title} - ShopKart`}</title>
        </Helmet>
    )
}

export default ShopMetaData
