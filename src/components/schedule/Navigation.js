// @flow
'use strict'
import React from 'react';
import {Link} from 'react-router-dom';
import R from 'ramda';
import {ToastContainer,ToastMessage} from 'react-toastr';
import { message } from 'antd';
import createReactClass  from 'create-react-class';
import CustomLoader from './CustomLoader'

import ProfileSettings from './ProfileSettings'

const logo = require('../images/visualbi_final_cube_color-133x150.png');

require('../lib/animate/animate.css')
require('../lib/toastr/toastr.min.css')

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

const styles = {
  userimage: {
      "height": "30px"
  }
};

const NavLink = createReactClass({
    getInitialState() {
      return {
        'currentNode':{},
        'previousNode':{}
      }
    },
    contextTypes: {
        router: React.PropTypes.object,
        props: React.PropTypes.object
    },
    componentDidMount() {
      this.setState({previousNode:this.state.currentNode,currentNode:this.context.router.route.location});
    },
    render: function () {
                if(this.state.currentNode.pathname==this.props.to) {
                  return(<Link {...this.props} className="sidenav-active">
                      {this.props.children}
                  </Link>);
                } else {
                    if(this.state.currentNode.pathname!=undefined) {
                      if(R.contains(R.drop(1,R.dropLast(1,this.props.to)),this.state.currentNode.pathname)) {
                          return(<Link {...this.props} className="sidenav-active">
                              {this.props.children}
                          </Link>);
                      }
                    }
                    return(<Link {...this.props}>
                        {this.props.children}
                    </Link>);
                }
    }
});

const Navigation = React.createClass({
  getInitialState() {
      return {
        profileSettingsSideBar: false,
        'customLoaderClass': ''
      }
    },
  updateUser() {
    this.setState({ profileSettingsSideBar: false });
    this.refs.container.info(
        "Profile successfully Updated",
        "Success", {
        timeOut: 5000,
        extendedTimeOut: 5000
      });
  },
  showProfileUpdate(event) {
    event.preventDefault()
    localStorage.setItem('profileUpdate',true)
    this.setState({ profileSettingsSideBar: true });
  },
  viewHideSideBarCancel(){
    this.setState({profileSettingsSideBar:false});
  },
  componentWillMount() {
    const _this = this
    Common.ping().then(function(response){
      if(!response) {
        _this.setState({'loadingActive':true,'loadingText':'error','customLoaderClass':'opacity-full'})
      }
      else {
        _this.setState({'loadingActive':false,'loadingText':'','customLoaderClass':''})
      }
    });
    if(localStorage.getItem('refCode') == 10500 || localStorage.getItem('refCode') == 10550) {
      message.destroy();
      message.warning("Your trial license expires in "+localStorage.getItem('remainingDays')+" days. Love our product? Get full license now,contact us at support@visualbi.com",10);
    }
  },
  render() {
    return (
      <div>
        {!Authentication.isLoggedIn()?(
          <span></span>
        ):(
      <div className="sidenav">
      <img src={logo} style={styles.userimage} />
        <br /><br />
        <div>
          <NavLink {...this.props} to="/servers" className="navigation-bar">
            <i className="ion-social-buffer-outline" aria-hidden="true" style={{fontSize: 25}}></i><br />Servers
          </NavLink>
          <NavLink {...this.props} to="/users" className="navigation-bar">
            <i className="ion-ios-people-outline" aria-hidden="true" style={{fontSize: 25}}></i><br />Users
          </NavLink>
          <NavLink {...this.props} to="/projects" className="navigation-bar">
            <i className="ion-ios-albums-outline" aria-hidden="true" style={{fontSize: 25}}></i><br />Projects
          </NavLink>
          <NavLink {...this.props} to="/schedules" className="navigation-bar">
            <i className="ion-ios-clock-outline" aria-hidden="true" style={{fontSize: 25}}></i><br />Schedules
          </NavLink>
          <NavLink {...this.props} to="/search" className="navigation-bar">
          <i className="ion-ios-search" aria-hidden="true" style={{fontSize: 25}}></i><br />Search
        </NavLink>
          <span className="logout-button">
            <a href="#" onClick={this.showProfileUpdate} className="navigation-bar">
                <i className="ion-ios-gear-outline active" aria-hidden="true"  style={{fontSize: 25}}></i>
              <br/>Settings</a>
              <NavLink {...this.props} to="/login" onClick={Authentication.logout} className="navigation-bar">
                <i className="ion-ios-undo-outline active" 
                    onClick={Authentication.logout} aria-hidden="true"  
                    style={{fontSize: 25}}></i>
              <br/>Logout</NavLink>
          </span>
        </div>
        </div>
      )}
      <ProfileSettings isActive={this.state.profileSettingsSideBar} onCreate={this.updateUser} onDismiss={this.viewHideSideBarCancel} />
      <ToastContainer
            toastMessageFactory={ToastMessageFactory}
            ref="container"
            className="toast-top-right"
          />
          <CustomLoader isActive={this.state.loadingActive} loadingType={this.state.loadingText} customClass={this.state.customLoaderClass} />
      </div>
);
}
});

export default Navigation;
