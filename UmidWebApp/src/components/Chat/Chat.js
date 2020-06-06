import React, { Component } from 'react';
import Firebase from "firebase";
import config from "../../config";
import './Chat.css'
import Avatar from 'react-avatar';
import { GiftedChat } from 'react-web-gifted-chat';
import CryptoJS from "react-native-crypto-js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { chatService } from '../../chatService';
class Chat extends Component {
  // obj={
  //   "alerttimestamp": 1589723697728,
  //   "category": "Food",
  //   "description": "food for 20people",
  //   "name": "rrrrrrr",
  //   "phonenumber": "8888888888",
  //   "timestamp": 0
  // }
constructor(props)
{
super(props)
this.user=JSON.parse(localStorage.getItem("user"));
this.contact=this.user["phone"];
this.chats=[];
this.name=this.user["name"];
this.id=0;
this.state=
{
    chatList:[],
    renderView: 2,
    messages:[],
    chatType:''
}
if (!Firebase.apps.length) {
    Firebase.initializeApp(config);
}
// Firebase.initializeApp(config);
}
componentDidMount()
{
  this.getInitialChatList();
  this.subscription = chatService.getMessage().subscribe(message => {
    if (message) {
      this.getChatList();
      // add message to local state if not empty
      this.setState({ chatList: [...this.state.chatList, message] });
  } else {
      // clear messages when empty message received
      this.setState({ chatList: [] });
  }
});
}
 getChatList()
 { 
  this.setState({ chatList:[]});
 console.log(this.state.chatList);
 var fetchMessage = new Promise((resolve, reject) => {
    
    // console.log(fetchedAlert);
    console.log(this.contact);
    let fetchedAlert = []
     Firebase.database().ref("ChatsUnderYou/Anonymous/"+this.contact+"/").on("child_added", snapshot => {
        //  snapshot.forEach((data) => {
             
        //      console.log("yes");
             console.log(snapshot.val())
             fetchedAlert.push(snapshot.val())
        //  });
         if(fetchedAlert.length>0){
           console.log(fetchedAlert)
           resolve(fetchedAlert)
         }
         else{
           console.log("here")
           resolve([])
          //  reject("No data")
         }
     })
   }).catch( error =>  console.log(error) );
     fetchMessage.then(arr1 => {
       let fetchedAlert = []
       console.log(arr1)
       if(arr1!==undefined)
       {
       fetchedAlert=arr1
       }
        console.log(fetchedAlert)
       var pro1 = new Promise((resolve,reject) => {
        Firebase.database().ref("ChatsUnderYou/alerts/"+this.contact+"/").on("value", snapshot => {
           snapshot.forEach((data) => {
              console.log(data);
               fetchedAlert.push(data.val())
           });
           if (fetchedAlert.length > 0)
           {
              console.log("yes")
               resolve(fetchedAlert)
           }
           else
               reject("no data")
       })
       }).catch( error =>  console.log(error) );

       pro1.then(arr2 => {
         let fetchedAlert = null
         // fetchedAlert.push(arr2)
         fetchedAlert = arr2
          console.log(fetchedAlert)
         var Pro2 = new Promise((resolve,reject) => {
           Firebase.database().ref("ChatsUnderYou/vendors/"+this.contact+"/").on("value", snapshot => {
             snapshot.forEach((data) => {
                 fetchedAlert.push(data.val())
             });
             if (fetchedAlert)
                 resolve(fetchedAlert)
             else
                 reject("no data")
         })
         }).catch( error =>  console.log(error) );
         Pro2.then(s  => {
            console.log("ashjdgjyahsgdash",s);
            if(s!==undefined)
            {
     s.sort((a, b) => {
         return -(a.alerttimestamp-b.alerttimestamp)
     })
     console.log(this.state.chatList);
    //  this.setState(prevState => ({
    //   chatList: [...prevState.chatList, s]
    // }))
    this.setState({chatList:s},()=> {
      return true
    });
     console.log(this.state.chatList);
     }
         }) 
       })
     })
    // console.log(this.state.chatList)
}  
getInitialChatList()
{ 
 this.setState({ chatList:[]});
console.log(this.state.chatList);
var fetchMessage = new Promise((resolve, reject) => {
   
   // console.log(fetchedAlert);
   console.log(this.contact);
   let fetchedAlert = []
    Firebase.database().ref("ChatsUnderYou/Anonymous/"+this.contact+"/").on("value", snapshot => {
        snapshot.forEach((data) => {
            
       //      console.log("yes");
           // console.log(snapshot.val())
            fetchedAlert.push(data.val())
        });
        if(fetchedAlert.length>0){
          console.log(fetchedAlert)
          resolve(fetchedAlert)
        }
        else{
          console.log("here")
          resolve([])
         //  reject("No data")
        }
    })
  }).catch( error =>  console.log(error) );
    fetchMessage.then(arr1 => {
      let fetchedAlert = []
      console.log(arr1)
      if(arr1!==undefined)
      {
      fetchedAlert=arr1
      }
       console.log(fetchedAlert)
      var pro1 = new Promise((resolve,reject) => {
       Firebase.database().ref("ChatsUnderYou/alerts/"+this.contact+"/").on("value", snapshot => {
          snapshot.forEach((data) => {
             console.log(data);
              fetchedAlert.push(data.val())
          });
          if (fetchedAlert.length > 0)
          {
             console.log("yes")
              resolve(fetchedAlert)
          }
          else
              reject("no data")
      })
      }).catch( error =>  console.log(error) );

      pro1.then(arr2 => {
        let fetchedAlert = null
        // fetchedAlert.push(arr2)
        fetchedAlert = arr2
         console.log(fetchedAlert)
        var Pro2 = new Promise((resolve,reject) => {
          Firebase.database().ref("ChatsUnderYou/vendors/"+this.contact+"/").on("value", snapshot => {
            snapshot.forEach((data) => {
                fetchedAlert.push(data.val())
            });
            if (fetchedAlert)
                resolve(fetchedAlert)
            else
                reject("no data")
        })
        }).catch( error =>  console.log(error) );
        Pro2.then(s  => {
           console.log("ashjdgjyahsgdash",s);
           if(s!==undefined)
           {
    s.sort((a, b) => {
        return -(a.alerttimestamp-b.alerttimestamp)
    })
    console.log(this.state.chatList);
   //  this.setState(prevState => ({
   //   chatList: [...prevState.chatList, s]
   // }))
   this.setState({chatList:s},()=> {
     return true
   });
    console.log(this.state.chatList);
    }
        }) 
      })
    })
   // console.log(this.state.chatList)
}  
chatClicked(e,obj)
 {
  console.log(obj);
   this.obj=obj;
   console.log(this.obj);
   document.getElementById("chatApp").style.display="block";
  this.setState({
    renderView: e.target.id,
    chatType : obj.category
  },()=>{console.log(this.state.renderView,this.state.chatType); this.onLoadEarlier()});
};
setValue()
  {
  if(this.state.chatType==="Emotional Support")
  {
    Firebase.database().ref("ChatsUnderYou/Anonymous/"+this.this.contact+"/"+this.obj.phonenumber+","+this.obj.timestamp).set({
      name: this.obj.name,
      description: this.obj.description,
      phonenumber:this.obj.phonenumber,
      category: this.obj.category,
      timestamp: 0,
      alerttimestamp: this.obj.timestamp,
  }).then(() => {
      Firebase.database().ref("ChatsUnderYou/Anonymous/"+this.obj.phonenumber+"/"+this.this.contact+","+this.obj.timestamp).set({
          name: this.name,
          description: this.obj.description,
          phonenumber:this.this.contact,
          category: this.obj.category,
          timestamp: 0,
          alerttimestamp: this.obj.timestamp,
      })
      }).then(() => {
        this.setState({showChat:true})
      })
  }
  else if(this.state.chatType==="kirana")
  {
    console.log(this.this.contact);
    console.log(this.obj.phonenumber);
    Firebase.database().ref("ChatsUnderYou/vendors/"+this.this.contact+"/"+this.obj.phonenumber).set({
      name: this.name,
      phonenumber:this.this.contact,
      category: "shops",
      timestamp: 0,
  }).then(() => {
      Firebase.database().ref("ChatsUnderYou/vendors/"+this.obj.phonenumber+"/"+this.this.contact).set({
          name: this.obj.name,
          phonenumber:this.obj.phonenumber,
          category: "shops",
          timestamp: 0,
      }).then(()=>{
        this.setState({showChat:true})
      })
      })
  }
  else{
    Firebase.database().ref("ChatsUnderYou/alerts/"+this.this.contact+"/"+this.obj.phonenumber+","+this.obj.timestamp).set({
      name: this.obj.name,
      description: this.obj.description,
      phonenumber:this.obj.phonenumber,
      category: this.obj.category,
      timestamp: 0,
      alerttimestamp: this.obj.timestamp,
  })
  }
  }
closeChat(e)
{
  document.getElementById("chatApp").style.display="none";
}
onSend(msgBody = []) {
  let textMsg=msgBody[0].text;
  let newMessageBody = CryptoJS.AES.encrypt(textMsg, 'U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=').toString();
  console.log(newMessageBody);
  if (!newMessageBody) {
    return;
  }
  if(this.state.chatType=== "Emotional Support"){
    if(this.contact > this.obj.phonenumber){
      var x=this.contact+','+this.obj.phonenumber;
    }else{
       x=this.obj.phonenumber+','+this.contact;
    }
    console.log(x)
    Firebase.database().ref('OneToOneAnonymous/'+x+","+this.obj.alerttimestamp+'/').push({
      id:(this.lastId++).toString(),
      text: newMessageBody,
    timestamp: new Date().getTime(),
    user: {
      name: this.name,
    id: this.contact}
    })
  }
  else if(this.state.chatType === "kirana"){
    if(this.contact > this.obj.phonenumber){
       x=this.contact+','+this.obj.phonenumber;
    }else{
      x=this.obj.phonenumber+','+this.contact;
    }
    Firebase.database().ref('OneToOneVendor/'+x+'/').push({
      id:(this.id++).toString(),
      text: newMessageBody,
    timestamp: new Date().getTime(),
    user: {
      name: this.obj.name,
    id: this.obj.phonenumber}
    })
  }
  else if(this.state.chatType=== "others" || this.state.chatType.toLowerCase()==="food")
  {
  console.log(this.obj.phonenumber+","+this.obj.alerttimestamp)
  Firebase.database().ref("chatroom/"+this.obj.phonenumber+","+this.obj.alerttimestamp+"/").push(({
    id:(this.id++).toString(),
    text: newMessageBody,
    timestamp: new Date().getTime(),
    user: {
      name: this.name,
    id: this.contact}
  }))
  this.newMessageBody ='';
  // this.setState((previousState) => ({
  //   messages: GiftedChat.append(previousState.messages, msgBody),

  // }));
}
}

onLoadEarlier()
{
    var chatT=this.state.chatType;
    //this.messages = null;
    var mess= [];
    //this.cat = this.obj
    // console.log(obj)
    if(chatT === "Emotional Support"){
      var pro5 = new Promise((resolve,reject) => {
        if(this.contact > this.obj.phonenumber){
          var x=this.contact+','+this.obj.phonenumber;
        }else{
           x=this.obj.phonenumber+','+this.contact;
        }
        Firebase.database().ref('OneToOneAnonymous/'+x+","+this.obj.alerttimestamp+'/').limitToLast(20)
        .on('child_added', snapshot => {
          console.log(snapshot.val())
          let bytes  = CryptoJS.AES.decrypt(snapshot.val().text, 'U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=');
          const text = bytes.toString(CryptoJS.enc.Utf8);
          const { timestamp: numberStamp, user } = snapshot.val();
          const { key: _id } = snapshot;
          const timestamp = new Date(numberStamp);
          const message = {
            _id,
            timestamp,
            text,
            user,
          };
           mess.push(message)
           console.log(mess)
          this.setState((previousState) => ({
            messages: mess,
      
          }));
          console.log(this.state.messages)
          if(mess.length>0){
            resolve(mess)
          }
          else{
            reject("no Data")
          }
        }
        )
      })
      pro5.then(s => {
        this.messages = s
      })
    }
    else if(chatT=== "kirana"){
       pro5 = new Promise((resolve,reject) => {
        if(this.contact > this.obj.phonenumber){
          var x=this.contact+','+this.obj.phonenumber;
        }else{
          x=this.obj.phonenumber+','+this.contact;
        }
        Firebase.database().ref('OneToOneVendor/'+x+'/').limitToLast(20)
        .on('child_added', snapshot => {
          let bytes  = CryptoJS.AES.decrypt(snapshot.val().text, 'U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=');
          const text = bytes.toString(CryptoJS.enc.Utf8);
          const { timestamp: numberStamp, user } = snapshot.val();
          const { key: _id } = snapshot;
          const timestamp = new Date(numberStamp);
          const message = {
            _id,
            timestamp,
            text,
            user,
          };
          mess.push(message)
          this.setState((previousState) => ({
            messages: mess,
      
          }));
          if(mess.length>0){
 
            resolve(mess)
          }
          else{
            reject("no Data")
          }
        }
        )
      })
    }
    else{
      var Pro5 = new Promise((resolve,reject) => {
        Firebase.database().ref('chatroom/'+this.obj.phonenumber+","+this.obj.alerttimestamp+'/').limitToLast(20)
      .on('child_added', snapshot => {
        console.log(snapshot.val());
        
        let bytes  = CryptoJS.AES.decrypt(snapshot.val().text, 'U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=');
          const text = bytes.toString(CryptoJS.enc.Utf8);
        const { timestamp: numberStamp, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
          _id,
          timestamp,
          text,
          user,
        };
        mess.push(message)
        this.setState((previousState) => ({
          messages: mess,
    
        }));
        if(mess.length>0){

          resolve(mess)
        }
        else{
          reject("no Data")
        }
      }
      )
      })
      Pro5.then(s => {
        this.messages = s
      })
      
    }
  }



openChatList=(e)=>
{
console.log("yes");
  document.querySelector("#chatListButton").style.display="none";
  console.log(document.getElementById("chatListButton").style.display);
  document.querySelector("#chatList").style.display="flex"
}


  render() {
    return (
     <div>
       {/* <button className="open-button" id="chatListButton" onClick={(e)=>this.openChatList(e)}>Chat List</button> */}
             <div className="chatList" id="chatList">
               <div className="contact">
                 <span className="contact-heading">Contacts</span>
               </div>
             <div className="chats">
              {this.state.chatList.length===0 && <div style={{margin:"20px", color :"#0390E9"}}>No chats found</div>}
              {this.state.chatList.length>0 && this.state.chatList.map((marker, index) => (
                <div className="chatUser" key={index}>
                   <Avatar className="userAvatar"  name={marker.category==='Emotional Support'?'Anonymous':marker.name} />
                   <div className="userName" id={marker.timestamp} onClick={(e)=>this.chatClicked(e,marker)} key={marker.alerttimestamp}>{marker.category==='Emotional Support'?'Anonymous':marker.name}</div>
                   </div>
                   ))}
                </div>
              </div>  
              
     { this.state.renderView && <div className="chatApp" id="chatApp">
     <div className = "chatPerson" onClick={(e)=>this.closeChat(e)}>
              {/* <label className="personName">Swapnil Sudhir</label> */}
              <span className="closeChat">X
              {/* <img class="" src={require("./close-icon.svg")}/> */}
             </span>
     </div>   
     <GiftedChat  className="chatArea" messages={this.state.messages.slice().reverse()}
     onSend={(msgBody) => this.onSend(msgBody)}
     user={{id:this.contact, name:this.name}}
     loadEarlier={true} 
     onLoadEarlier={this.onLoadEarlier.bind(this)}
      />
      </div>
      } 
     </div>
    );  
    }
    
    
  }
 
export default Chat;