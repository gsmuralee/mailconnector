import React, {Component} from 'react';
import {DropdownButton,MenuItem} from 'react-bootstrap'
import { routes } from '../config.js';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            token: '',
            usernameerr: '',
            passworderr: '',
            servererr: '',
            authenticationMethod: 'Select Type',
            serverMethod: 'Select Server',
            servers: []
        }
        this.submit = this.submit.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.handleServerDropDown = this.handleServerDropDown.bind(this);
    }

    callApi = async (username, password, serverAlias) => {
        console.log(serverAlias)
        const response = await fetch(routes('LOGIN'), { method: 'POST', body: JSON.stringify({username, password, serverAlias}), headers: {'Content-Type':'application/json'} });
        const body = await response.json();
        if (body.status !== 200) throw Error(body.message);
        return body;
    };
    getServer = async () => {
        const response = await fetch(routes('SERVERS'), { method: 'GET', headers: {'Content-Type':'application/json'} });
        const body = await response.json();
        if (body.status !== 200) throw Error(body.message);
        return body.servers;
    }
    componentWillMount () {
        this.getServer().then(servers => {
            this.setState({'servers':servers});
        }).catch(err => {
            this.setState({'servererr':'Add server in DMS portal'});
        });
    }

    handleDropDown(eventKey) {
        this.setState({'authenticationMethod':eventKey});
    };

    handleServerDropDown(eventKey) {
        this.setState({'serverMethod':eventKey});
    };

    submit(e){
        const {username, password, email} = this.refs;
        e.preventDefault();
        this.callApi(username.value, password.value, this.state.serverMethod)
        .then(res => {
            localStorage.setItem('_token', res.token);
            localStorage.setItem('_username', username.value);
            localStorage.setItem('_email', email.value);
            localStorage.setItem('_serverAlias', this.state.serverMethod);
            this.props.history.push("/");
        })
        .catch(err => {
            this.setState({'passworderr':'Invalid username, password'});
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
                            <h4 className='heading-form-small'>Servers</h4>
                            <DropdownButton bsStyle='default' title={this.state.serverMethod} id='serverlist' onSelect={this.handleServerDropDown}>
                                {this.state.servers.map((server, i) => 
                                    <MenuItem key={i} eventKey={server.serverAlias}>{server.serverAlias}</MenuItem>
                                )}
                            </DropdownButton><br/><br/>
                            <div className="errorTxt">{this.state.servererr}</div>
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