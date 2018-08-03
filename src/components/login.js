import React, {Component} from 'react';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            token: ''
        }
        this.submit = this.submit.bind(this)
    }

    callApi = async (username, password) => {
        const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({username, password}), headers: {'Content-Type':'application/json'} });
        const body = await response.json();
    
        if (body.status !== 200) throw Error(body.message);
    
        return body;
    };

    submit(e){
        const {_username, _password} = this.refs;
        e.preventDefault();
        this.callApi(_username.value, _password.value)
        .then(res => {
            return this.setState({ token: res.token})
        })
        .catch(err => console.log(err));
    }

    render(){
        return (
            <form onSubmit={this.submit}>
            <input ref="_username" type="text" placeholder="username" required/>
            <input ref="_password" type="password" placeholder="password" required/>
            <button> submit </button>
            </form>
        )
    }
}

export default Login