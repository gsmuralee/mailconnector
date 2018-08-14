import React from 'react';

const Navigation = () => {
    return (
        <div className="animate">
            <nav className="navbar header-top fixed-top navbar-expand-lg  navbar-dark bg-dark">
            <a className="navbar-brand" href="#">LOGO</a>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav ml-md-auto d-md-flex">
                    <li className="nav-item">
                        <a className="nav-link" href="#">logout</a>
                    </li>
                </ul>
            </div>
            </nav>
        </div>    
    )
}

export default Navigation