import React, {Component} from 'react';
import Auth from '../helpers/auth';
import {equals, isEmpty} from '../helpers/common'
class Login extends Component {
    constructor(props){
        super(props);
        console.log(this.props.history)
        this.state = {
            token: '',
            usernameerr: '',
            passworderr: ''
        }
        this.submit = this.submit.bind(this)
    }

    callApi = async (username, password) => {
        const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({username, password}), headers: {'Content-Type':'application/json'} });
        const body = await response.json();
        console.log(body.status)
        if (body.status !== 200) throw Error(body.message);
        
        return body;
    };

    submit(e){
        const {username, password} = this.refs;
        e.preventDefault();
        this.callApi(username.value, password.value)
        .then(res => {
            console.log(res)
            localStorage.setItem('_token', res.token);
            localStorage.setItem('_username', username.value);
            this.props.history.push("/");
        })
        .catch(err => {
            this.setState({'passworderr':'Invalid username, password! Don\'t worry,this happens even for best of us!!'});
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
                        <div className="errorTxt">{this.state.usererr}</div>
                      </div>
                      <div className="form-group input-group" style={{"width":"100%"}}>
                        <input className="form-control" type="password" ref='password' name='password' placeholder="Password" required/><br />
                        <div className="errorTxt">{this.state.passworderr}</div><br/>
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