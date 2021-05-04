import React from 'react'

import breadcrumbStyles from './BreadCrumb.module.css'

const BreadCrumb = (props) => {

    return (
        <div className={breadcrumbStyles.breadcrumb}>
            <a className={breadcrumbStyles.crumb}>0:/Wilder</a>
        </div>
    )
}

export default BreadCrumb