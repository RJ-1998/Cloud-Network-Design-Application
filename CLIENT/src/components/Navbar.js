import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
        <div className="navbar-fixed">
            <nav>
            <div className="nav-wrapper yellow accent-4">
            <Link to="/" className="brand-logo left black-text mylogo">FileCloud</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/" className=" black-text">SignUp</Link></li>
                <li><Link to="/" className=" black-text">SignIn</Link></li>
                <li><Link to="/" className=" black-text">Profile</Link></li>
            </ul>
            </div>
            </nav>
        </div>
    </div>
  )
}

export default Navbar
