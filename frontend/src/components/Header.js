import React from 'react'
import { Link, Redirect } from 'react-router-dom';

const Header = () => {

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top d-flex">
                <div className="container-fluid">
                    <Link to="/home" className="navbar-brand">Microcred</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Dashboards
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><Link to="/dashboard/student" className="dropdown-item">Student</Link></li>
                            <li><Link to="/dashboard/staff" className="dropdown-item">Staff</Link></li>
                        </ul>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    <div class="form-inline my-2 my-lg-0">
                    <Link to="/" className="btn btn-outline-success my-2 my-sm-0">Login</Link>
                    </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header;
