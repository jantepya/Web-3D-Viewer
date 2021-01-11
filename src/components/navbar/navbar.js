import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
    Collapse,
    Navbar as ReactNavbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

import './navbar.css';

const Navbar = function() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);  

    return (
        <div>
            <ReactNavbar expand="md">
                <Link to="/">
                    <NavbarBrand>Cloud3D</NavbarBrand>
                </Link>

                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <Link to="/test">
                                <NavLink>test</NavLink>
                            </Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </ReactNavbar>
        </div>
    )
}

export default Navbar;