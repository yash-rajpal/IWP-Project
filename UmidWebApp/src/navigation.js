import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  HashRouter,
  NavLink,
  Route,
  BrowserRouter as Router
} from "react-router-dom";
import Map from './components/Map/Map.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
import SOSList from './components/SOSList/SOSList.js';
import Popup from 'reactjs-popup';
// import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Button from 'muicss/lib/react/button';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';
import { Row, Col, Container, Navbar, Form, FormCheck } from 'react-bootstrap';
import firebaseConfig from './config.js';
import Firebase from 'firebase';
import Chat from './components/Chat/Chat.js'
import createHistory from 'history/createBrowserHistory';
import {chatService} from './chatService';
import { logo } from './umid-logo.jpg';
const current_user = JSON.parse(localStorage.getItem('user'));
console.log("user check");
console.log("current_user",current_user);

class SOSForm extends React.Component {
  constructor(props){
    super(props)
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);
    }
    this.state = {
      category: null,
      name: null,
      contact: current_user.phone,
      desc: null
    }
  }

  formFieldChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  send_sos(){
    const timestamp = new Date().getTime();
    const dummy_id = this.state.contact + "," + timestamp;
    const data = {
      name: this.state.name,
      category: this.state.category,
      phonenumber: this.state.contact,
      description: this.state.desc,
      latitude: parseFloat(window.localStorage.getItem("lat")),
      longitude: parseFloat(window.localStorage.getItem("lng")),
      timestamp: timestamp
    }
    console.log("sending");
    console.log(data);
    Firebase.database().ref('sos/' + dummy_id).set(data);
    Firebase.database().ref("ChatsUnderYou/alerts/" + this.state.contact + "/" + this.state.contact + "," + timestamp).set({
      name: this.state.name,
      description: this.state.desc,
      phonenumber: this.state.contact,
      category: this.state.category,
      counter: 0,
      timestamp: 0,
      alerttimestamp: timestamp,
    });
  }

  render() {
    return (
      <Form onSubmit={e => { e.preventDefault(); }} className="form-container">
        <div className="Popup-prime">
          <div className="popup-title">
            <span className="form_title">CREATE EMERGENCY HERE</span>
          </div>

          <div className = "popup-list-items">
            <span className="popup-subheading">Choose Emergency</span>
            <div className = "popup-list">
              <Form.Check inline label="Emotional Support" type="radio"  className="list-item-pop-up" id="em_support" name="category" value="Emotional Support" 
              onChange={this.formFieldChangeHandler}/>
              <Form.Check inline label="Food Supply" type="radio" className="list-item-pop-up" id="food_supply" name="category" value="Food Supply" 
              onChange={this.formFieldChangeHandler}/>
              <Form.Check inline label="Others" type="radio" className="list-item-pop-up" id="others" name="category" value="Others" 
              onChange={this.formFieldChangeHandler}/>
            </div>
            
          </div>
          <div className = "popup-list-items">
            <span className="popup-subheading">Additional Details</span>
            <div className = "popup-list-vertical">
              <Input placeholder="Your Name" name="name" onChange={this.formFieldChangeHandler} />
              <Input placeholder="Your Contact" name="contact" value={current_user.phone} disabled />
              <Textarea placeholder="Description" name="desc" onChange={this.formFieldChangeHandler} />
            </div>
          </div>


        </div>
        <Row className="justify-content-md-center" id= "buttonrow">
          <Button variant="raised" onClick={() => { this.send_sos() }} className="sos-submit">Submit</Button>
        </Row>
      </Form>
    );
  }
}

class Navigation extends Component {
  constructor(props){
    super(props)
    navigator.geolocation.getCurrentPosition(function(position) {
      window.localStorage.setItem("lat", position.coords.latitude);
      window.localStorage.setItem("lng", position.coords.longitude);
    });
   this.state = {
    selectedFood: true,
    selectedAdhoc: true,
    selectedEmotional: true,
    name: ''
  }

  this.emlist = this.emlist.bind(this);

  
  }

  componentDidMount() {
    this.renderListColor();
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

  searchBar = (event) => {
    this.setState({'name': event.target.value});
    chatService.setList({'food': this.state.selectedFood, 'emotional': this.state.selectedEmotional, 
    'adhoc': this.state.selectedAdhoc, 'name': event.target.value});
  }

  emlist(id){
    if (id == 'food') {
      const food = !this.state.selectedFood;
      this.setState({'selectedFood': food}, () => {
        this.renderListColor();
      })
    } else if (id == 'emotional') {
      const emo = !this.state.selectedEmotional;
      this.setState({'selectedEmotional': emo}, () => {
        this.renderListColor();
      })
    } else if (id == 'adhoc') {
      const adhoc = !this.state.selectedAdhoc;
      this.setState({'selectedAdhoc': adhoc}, () => {
        this.renderListColor();
      })
    }
  }

  renderListColor =() => {
    document.getElementById('food').style.color = (this.state.selectedFood ? '#0390E9' : '#0390E9');
      document.getElementById('food-check').style.backgroundColor = (this.state.selectedFood ? 'white' : '#0390E9');
      document.getElementById('emotional').style.color = (this.state.selectedEmotional ? '#0390E9' : '#0390E9');
      document.getElementById('emotional-check').style.backgroundColor = (this.state.selectedEmotional ? 'white' : '#0390E9');
      document.getElementById('adhoc').style.color = (this.state.selectedAdhoc ? '#0390E9' : '#0390E9');
      document.getElementById('adhoc-check').style.backgroundColor = (this.state.selectedAdhoc ? 'white' : '#0390E9');

      chatService.setList({'food': this.state.selectedFood, 'emotional': this.state.selectedEmotional, 'adhoc': this.state.selectedAdhoc, 
      'name': this.state.name});
  }
  
logout()
{
  localStorage.clear();
  this.props.history.push('/');
}

  render() {
    return(
      [<div className="ab-header">
        <div className="leftHeader"> 
          <span className="logoName">UMID</span>
          <i class="fa fa-filter" id="filter-icon" onClick={this.toggleBar}></i>

        </div>
       <div className="rightHeader">
         {/* Logout */}
         <div className="left-div">
         <Button variant="success" className="umid_food"  style={{marginRight:15}}
         onClick={()=>{   window.location.href = 'http://127.0.0.1:8000/';}}
         >UmidFood</Button>
         </div>
          <div className="left-div">
            <Popup modal closeOnEscape repositionOnResize closeOnDocumentClick 
              trigger={<Button variant="danger" className="sos_button">SOS</Button>}>
              <SOSForm className="form_box"/>
            </Popup>
          </div>
          
         <div class="dropdown">
          <button class="btn btn-default dropdown-toggle" id="userProfileButton" type="button" data-toggle="dropdown">{current_user.name}
          <span class="caret"></span></button>
          <ul class="dropdown-menu" style={{marginLeft:10}}>
            {/* <li><a href="#">CSS</a></li>
            <li><a href="#">JavaScript</a></li> */}
            <li onClick={this.logout.bind(this)}style={{marginLeft:10}}>  Logout</li>
          </ul>
        </div>
         {/* <i class="fa fa-sign-out" onClick={this.logout.bind(this)} style={{marginLeft: '10px', marginTop:'10px',fontSize : '14px'}}>LogOut</i> */}
       </div>
      </div>,
      <Container fluid style={{backgroundColor: '#f7f7f7'}}>
        <Row>
            <Col md="2" className="bg-white">
              <div id="sideBar">
                <div className="f1">
                  <h6 className="nav-name-heading">EMERGENCY</h6><br></br>
                    <div className="em-list" id="food"  onClick={()=>this.emlist('food')}>
                      <div className="checkbox" id="food-check"></div>
                      Food Supply
                    </div>
                    <div className="em-list" id="emotional"  onClick={() => this.emlist('emotional')}>
                      <div className="checkbox"  id="emotional-check"></div>
                      Emotional Support
                    </div>
                    <div className="em-list" id="adhoc"  onClick={() => this.emlist('adhoc')}>
                      <div className="checkbox"  id="adhoc-check"></div>
                      Adhoc
                    </div>
                </div>
                <div className="filterOptions">
                  <button id="applyBtn">Apply</button>
                  <button id="closeBtn" onClick={this.closeBar}>Cancel</button>
                </div>
              </div>
            </Col>
            <Col md="8" id="content" style={{marginTop: '90px', display : 'flex'}}>
              <div className="content-tab">
                <div className ="searchbar-icons">
                  <div className="left-div">
                    <Form.Control type="text" placeholder="Search by name..." onChange={this.searchBar} className="search-bar" />
                  </div>

                  <div className="right-div">
                  <ul className="navigator-list">
                  <li className="navigators">
                    <NavLink to="/dashboard">
                      <svg className="sc-bdVaJa fUuvxv ab-icon ab-icon--sm" id="MyId64" fill="#000000" width="22px" height="22px" viewBox="0 0 1024 1024" rotate="0">
                        <path
                            d="M160 560h512v96h-512v-96z M160 368h640v96h-640v-96z M160 176h704v96h-704v-96z M160 752h576v96h-576v-96z">
                        </path>
                    </svg>List
                    </NavLink>
                    </li>
                    <li className="navigators">
                    <NavLink to="/map"><div>
                    <svg className="sc-bdVaJa fUuvxv ab-icon ab-icon--sm" fill="#000000" width="22px" height="22px" viewBox="0 0 1024 1024" rotate="0">
                      <path
                          d="M512 96c-159 0-288 119.8-288 267.4 0 208 288 564.6 288 564.6s288-356.6 288-564.6c0-147.6-129-267.4-288-267.4zM512 477.8c-51.8 0-93.8-42-93.8-93.8s42-93.8 93.8-93.8 93.8 42 93.8 93.8-42 93.8-93.8 93.8z">
                      </path>
                    </svg>Map</div></NavLink>
                    </li>
                  </ul>
                </div>
          
                </div>
                <div className="SOS-component">
                  <Route exact path="/dashboard" component={SOSList}/>
                </div>      

              </div>

            <Router>
                <div className="right-div">
              <Row id="panelRow">
                <Col>
                
                
                </Col>
                <Col className="navigator-block">
                
                
                <div className="left-div">
                 
                </div>
                <Row className="view">
                {/* <Route exact path="/dashboard" component={SOSList}/> */}
                <Route path="/map" component={Map}/>
                </Row>
                </Col>
              </Row>
              </div>
            </Router>
            </Col>
          <Row><Chat/></Row>
        </Row>
      </Container>
      ]
    )
  }
}

export default Navigation;
