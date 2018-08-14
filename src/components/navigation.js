import React,  {Component} from 'react';
class Navigation extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout = (e) => {
        e.preventDefault()
        localStorage.clear()
        this.props.history.push("/login");
    }

    render(){
        return (
            <div className="animate">
                <nav className="navbar header-top fixed-top navbar-expand-lg  navbar-dark bg-dark">
                <a className="navbar-brand" href="#">LOGO</a>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ml-md-auto d-md-flex">
                        <li className="nav-item">
                            <a className="nav-link" href="" onClick={this.handleLogout}>logout</a>
                        </li>
                    </ul>
                </div>
                </nav>
            </div>    
        )
    }
}


export default Navigation