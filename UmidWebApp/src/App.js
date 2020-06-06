import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.min';
import './App.css';
import {
  BrowserRouter as Router, Switch,
  Route
} from "react-router-dom";
import PrivateRoute from 'react-private-route'
import Authentication from './components/Auth/Authentication.js';
import Navigation from './navigation.js';
import createHistory from 'history/createBrowserHistory'

class App extends Component {
  constructor(props){
    super(props)
    
    navigator.geolocation.getCurrentPosition(function(position) {
      window.localStorage.setItem("lat", position.coords.latitude);
      window.localStorage.setItem("lng", position.coords.longitude);
    });
    
  }

  toggleBar = (event) => {
    console.log("bar");
    document.getElementById('sideBar').style.display = 'block';
    document.getElementById('content').style.display = 'none';
  }

  closeBar = (event) => {
    document.getElementById('sideBar').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }

  isLoggedIn()
  {
    if (localStorage.getItem("user") === null) {
      const history = createHistory()
      history.push('/');
      return false;
    }
    else
       return true;
  }
  
  render() {
    // localStorage.clear();
    return(
       <Router>
         <Switch>
        <Route exact path='/' component={Authentication} />
        <Route path='/dashboard' component = {Navigation} />
        <PrivateRoute exact path="/" component={Authentication} isAuthenticated={!!this.isLoggedIn() /* this method returns true or false */}/>
        </Switch>
    </Router>
    )
  }
}

export default App;
