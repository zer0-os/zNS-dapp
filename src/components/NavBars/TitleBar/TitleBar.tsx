import React from 'react'

import titlebarStyles from './TitleBar.module.css'

type TitleBarProps = {
    style?: React.CSSProperties;
    children: React.ReactNode;
}

const TitleBar: React.FC<TitleBarProps> = ({ style, children }) => {
    return (
            <nav style={style} className={`${titlebarStyles.TitleBar} border-primary blur`}>
                {children}
            </nav>
    )
}

export default TitleBar