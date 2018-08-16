import React, { Component } from 'react';
import { Route,Redirect } from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import Auth from './helpers/auth';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  
  render() {
    const PrivateRoute = ({component: Component, ...rest}) => (
      <Route {...rest} render={(props) => (
          (Auth.isLoggedIn() === true)
          ? <Component {...props} />
          : <Redirect to='/login' />
      )}/>
    )
    const PublicRoute =  ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        (Auth.isLoggedIn() === true)
          ?  <Redirect to='/' />
          : <Component {...props} />
      )} />
    )
    return(
      <div className="height-100">
        <PublicRoute exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={Home} />
      </div>
    );
  }
}

export default App;
