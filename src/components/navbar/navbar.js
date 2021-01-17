import React from 'react';
import {
    Navbar as ReactNavbar,
    NavbarBrand,
} from 'reactstrap';

import './navbar.css';

const Navbar = function() {
    return (
        <div>
            <ReactNavbar expand="md">
                <NavbarBrand>Cloud3D</NavbarBrand>
            </ReactNavbar>
        </div>
    )
}

export default Navbar;