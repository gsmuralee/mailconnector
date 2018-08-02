import React, { Component } from 'react';


import './App.css';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => {
          return this.setState({ response: res})
      })
      .catch(err => console.log(err));
  }

  callApi = async () => {
    
    const body = await response.json();

    if (body.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <p className="App-intro">{this.state.response.token}</p>
      </div>
    );
  }
}

export default App;
