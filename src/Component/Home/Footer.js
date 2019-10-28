import React from 'react';
import {Link} from '@material-ui/core'
import '../../css/header.scss'

const Footer = props => {
    return (<footer className = "appFooter">
                <ul className = "footerUl">
                    <li>
                        <Link href = "https://github.com/Orzoon" color = "inherit" target = "_blank" rel = "noopener">
                            visit my github
                        </Link>
                    </li>
                    <li>
                        <Link href = "https://codepen.io/orzoon" color = "inherit" target = "_blank" rel = "noopener">
                            visit my codepen
                        </Link>
                    </li>
                </ul>
            </footer>)
}

export default Footer;