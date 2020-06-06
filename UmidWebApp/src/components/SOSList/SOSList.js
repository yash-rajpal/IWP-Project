import React, { Component } from 'react';
import './SOSList.css';
import { ListGroup, Button, Form } from 'react-bootstrap';
import firebaseConfig from '../../config.js';
import Firebase from 'firebase';
import { getDistance } from 'geolib';
import Chat from '../Chat/Chat';
import {chatService} from '../../chatService';
import getDirections from 'react-native-google-maps-directions';

let all_sos = [];
let curr_lat = null;
let curr_lng = null;
const current_user = JSON.parse(localStorage.getItem('user'));
console.log(current_user);

class SOSList extends Component {
    constructor(props){
        super(props)
        if (!Firebase.apps.length) {
          Firebase.initializeApp(firebaseConfig);
        }
        // this.createChat = this.createChat.bind(this);
        this.user=JSON.parse(localStorage.getItem("user"));
        this.contact=this.user["phone"];
        this.state = {
            currentPosition: {
                lat: 51, lng: 7
            },
            chatList:[],
            sos: []
        }
        
    }

    componentDidMount(){
        window.navigator.geolocation.getCurrentPosition(
            success => this.setState({
              currentPosition: { lat: success.coords.latitude, lng: success.coords.longitude }
            })
        );

        curr_lat = this.state.currentPosition.lat;
        curr_lng = this.state.currentPosition.lng;
        this.getSOSData({'food': true, 'emotional': true, 'adhoc': true, 'name': ''});
        chatService.getList().subscribe(res => {
            this.getSOSData(res);
        })
    }

    getSOSData = (res) => {
        console.log(res);
        Firebase.database().ref("sos").on("value", snapshot => {
            let sos_markers = [];
            snapshot.forEach((snap) => {
                if ((snap.val().category == 'Food' && res.food) || 
                    (snap.val().category == 'Emotional Support' && res.emotional) || 
                    (snap.val().category == 'Others' && res.adhoc)) {
                        if(snap.val().name.toLowerCase().includes(res.name.toLowerCase())){
                            sos_markers.push(snap.val());
                        }
                        
                }
            });
            sos_markers.forEach((snap)=>{
                if(snap.category == 'Emotional Support'){
                    snap.name = "Anonymous"
                }
            })
            console.log(sos_markers);
            this.setState({sos: sos_markers});
            all_sos = sos_markers;
        });
    }


    searchBar(e){
        const search_value = e.target.value;
        let s = [];
        this.state.sos.forEach((sos_temp) => {
            if(sos_temp.category.includes(search_value)){
                s.push(sos_temp);
            }
        });
        if(search_value == ""){
            s = all_sos;
        }
        console.log(s);
        this.setState({sos: s});
    }


    render() {
        const createChat=(e, obj)=> {
            chatService.sendMessage('Messg');
             console.log("obj",obj)
             var c = 0
             if(this.state.chatList.length!=0){
             this.state.chatList.forEach(chat => {
               if(chat.category == "shops"){
                 if(chat.phonenumber == obj.phonenumber)
                 {
                     console.log("Im in")
                     c++;
                 }
             }
             else{
                 if(chat.alerttimestamp == obj.timestamp)
                 {
                     console.log("Im in")
                     c++;
                 }
             }
             
             })}
             // console.log(c)
             if(c==0){
                 if(obj.category == "Emotional Support"){
                       Firebase.database().ref("ChatsUnderYou/Anonymous/"+this.contact+"/"+obj.phonenumber+","+obj.timestamp).set({
                         name: obj.name,
                         description: obj.description,
                         phonenumber:obj.phonenumber,
                         category: obj.category,
                         timestamp: 0,
                         alerttimestamp: obj.timestamp,
                     }).then(() => {
                         Firebase.database().ref("ChatsUnderYou/Anonymous/"+obj.phonenumber+"/"+this.contact+","+obj.timestamp).set({
                             name: obj.name,
                             description: obj.description,
                             phonenumber:this.contact,
                             category: obj.category,
                             timestamp: 0,
                             alerttimestamp: obj.timestamp,
                         })
                         }).then(() => {
                           //this.router.navigate(['/dashboard/chat']);
                         })
                       }
                         else if(obj.category == "kirana" || obj.category == "chemist") {
                             Firebase.database().ref("ChatsUnderYou/vendors/"+this.contact+"/"+obj.PhoneNumber).set({
                                 name: obj.name,
                                 phonenumber:this.contact,
                                 category: "shops",
                                 timestamp: 0,
                             }).then(() => {
                                 Firebase.database().ref("ChatsUnderYou/vendors/"+obj.PhoneNumber+"/"+this.contact).set({
                                     name: obj.name,
                                     phonenumber:obj.PhoneNumber,
                                     category: "shops",
                                     timestamp: 0,
                                 })
                                 }).then(() => {
                                 //  this.router.navigate(['/dashboard/chat']);
                                 })
                         }
                 else {
                     Firebase.database().ref("ChatsUnderYou/alerts/"+this.contact+"/"+obj.phonenumber+","+obj.timestamp).set({
                         name: obj.name,
                         description: obj.description,
                         phonenumber:obj.phonenumber,
                         category: obj.category,
                         timestamp: 0,
                         alerttimestamp: obj.timestamp,
                     }).then(() => {
                      // this.router.navigate(['/dashboard/chat']);
                     })}
             }else{
              // this.router.navigate(['/dashboard/chat']);
             }
        }
        
        const handleGetDirections = (e, obj) => {
            const data = {
                source: {
                 latitude: this.state.currentPosition.lat,
                 longitude: this.state.currentPosition.lng
               },
               destination: {
                 latitude: obj.latitude,
                 longitude: obj.longitude
               },
               params: [
                 {
                   key: "travelmode",
                   value: "driving"        // may be "walking", "bicycling" or "transit" as well
                 },
                 {
                   key: "dir_action",
                   value: "navigate"       // this instantly initializes navigation using the given travel mode
                 }
               ]
             }
          
             getDirections(data)
        }

        const deleteSos = (e, obj) => {
            const id = obj.phonenumber + "," + obj.timestamp;
            let sos = Firebase.database().ref("sos/" + id);
            sos.remove();
        }
        return(
            <>
            <div style={{width: '98%', margin: 'auto'}}>
            </div>
            <ListGroup id="list-view">
                {this.state.sos.map(function(s, index) {
                    console.log("phone check")
                    console.log(s);
                    console.log(current_user.phone);
                    console.log(s.phonenumber)
                    let d = getDistance(
                        {latitude: curr_lat, longitude: curr_lng},
                        {latitude: s.latitude, longitude: s.longitude}
                    );
                    d = d/1000;
                    d = Number(d.toFixed(2));
                    d = d + " km";
                    return (
                    <ListGroup.Item className="list-item" key={index}>
                        <div className="list-div"  id="main_div">
                            <div className = "category-name">
                                <div className="name">
                                    <h5 className="category">{s.category}</h5>
                                    <span className="list-span-distance">({s.category == "Emotional Support"? "NA": d})</span>
                                </div>
                                <div className = "user-icon-button-delete">
                                        {current_user.phone == s.phonenumber ? <button className="functional-btn1 btn-class" onClick={(e)=>deleteSos(e,s)}>Delete</button>:
                                        <button className="functional-btn-delete btn-class" 
                                        disabled><i class="fa fa-times" aria-hidden="true"></i> </button>}
                                </div>
                            </div>
                            <div className = "userDetails">
                                <div className="username-main">
                                    <div className = "user-icon">
                                    <i class="fa fa-user-o" aria-hidden="true"></i>
                                    </div>
                                    <div className = "username">
                                        <span className="list-span">{s.name}</span>
                                    </div>
                                    <div className = "user-icon-button">
                                            {current_user.phone == s.phonenumber ? <button className="functional-btn btn-class" disabled>Chat</button>:
                                            <button className="functional-btn btn-class" onClick={(e)=>createChat(e,s)}><i class="fa fa-comments" aria-hidden="true"></i>Chat</button> }            
                                    </div>
                                </div>

                                <div className="username-main">
                                    <div className = "user-icon">
                                        <i class="fa fa-mobile" aria-hidden="true"></i>
                                    </div>
                                    <div className = "username">
                                        <span className="list-span">{s.category == "Emotional Support"? "NA": s.phonenumber}</span>
                                    </div>
                                    <div className = "user-icon-button">
                                            <button className="functional-btn btn-class" onClick={(e)=>handleGetDirections(e,s)} 
                                            target="_blank"> <i class="fa fa-map-marker" aria-hidden="true"></i>Direction </button>
                                    </div>
                                </div>

                                {/* <div className="username-main">
                                    <div className = "user-icon">
                                        <i class="fa fa-map-o" aria-hidden="true"></i>
                                    </div>
                                    <div className = "username">
                                        <span className="list-span">{s.category == "Emotional Support"? "NA": d}</span>                                  
                                    </div>
                                    <div className = "user-icon-button">
                                            {current_user.phone == s.phonenumber ? <button className="functional-btn btn-class" onClick={(e)=>deleteSos(e,s)}>Delete</button>:
                                            <button className="functional-btn btn-class" 
                                            disabled><i class="fa fa-times" aria-hidden="true"></i> Delete</button>}
                                    </div>
                                </div> */}

                            </div>
                        </div>
                        <div className="list-div featured-btn">
                            
                            
                        </div>
                    </ListGroup.Item>)
                })}
            </ListGroup>
            {/* <Chat/> */}
            </>
        )
    }
}


export default SOSList;