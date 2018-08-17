import React, {Component} from 'react';
import {DropdownButton,MenuItem} from 'react-bootstrap'
 
class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            token: '',
            usernameerr: '',
            passworderr: '',
            authenticationMethod: 'Select Type'
        }
        this.submit = this.submit.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
    }

    callApi = async (username, password, authtype) => {
        const response = await fetch('http://localhost:9000/api/login', { method: 'POST', body: JSON.stringify({username, password, authtype}), headers: {'Content-Type':'application/json'} });
        const body = await response.json();
        console.log(body.status)
        if (body.status !== 200) throw Error(body.message);
        
        return body;
    };

    handleDropDown(eventKey) {
        this.setState({'authenticationMethod':eventKey});
    };

    submit(e){
        const {username, password, email} = this.refs;
        e.preventDefault();
        this.callApi(username.value, password.value, this.state.authenticationMethod)
        .then(res => {
            localStorage.setItem('_token', res.token);
            localStorage.setItem('_username', username.value);
            localStorage.setItem('_email', email.value);
            this.props.history.push("/");
        })
        .catch(err => {
            this.setState({'passworderr':'Invalid username, password, Auth type'});
        });
    }

    render(){
        return (
            <div className="container">
              <div className="row">
                <div className="absolute-center is-responsive">
      
                  <div className="col-sm-12 col-md-8 col-md-offset-2">
                    <form action="" id="loginForm" method="post" onSubmit={this.submit}>
                        <h4 style={{textAlign:"center",fontWeight:"bold"}}>Mail</h4><br/>
                        <div className="form-group input-group" style={{"width":"100%"}}>
                            <input className="form-control" type="text" ref='username' name='username' placeholder="Username" required/><br/>
                        </div>
                        <div className="form-group input-group" style={{"width":"100%"}}>
                            <input className="form-control" type="password" ref='password' name='password' placeholder="Password" required/><br />
                        </div>
                        <div className="form-group input-group" style={{"width":"100%"}}>
                            <input className="form-control" type="text" ref='email' name='email' placeholder="Mailing Email Address" required/><br/>
                        </div>
                         <div className='col-sm-12 col-md-12 form-group input-group zero-margin'>
                            <h4 className='heading-form-small'>Authentication Type</h4>
                            <DropdownButton bsStyle='default' title={this.state.authenticationMethod} id='authenticationMethodCreate' onSelect={this.handleDropDown}>
                                <MenuItem eventKey='secWinAD'>Windows AD</MenuItem>
                                <MenuItem eventKey='secLDAP'>LDAP</MenuItem>
                                <MenuItem eventKey='secEnterprise'>Enterprise</MenuItem>
                            </DropdownButton><br/><br/>
                            <div className="errorTxt">{this.state.passworderr}</div>
                        </div>      
                      <div className="form-group">
                        <button type="submit" className="btn btn-def btn-block">Login</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

export default Login