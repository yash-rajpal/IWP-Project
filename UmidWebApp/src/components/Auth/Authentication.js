import React, { Component } from 'react';
import Firebase from "firebase";
import config from "../../config";
import './Authentication.css'
// import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from 'lodash';


class Authentication extends Component
{
 b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

constructor(props)
{
    super(props)
    console.log(this);
    if (!Firebase.apps.length) {
        Firebase.initializeApp(config);
    } 
  this.submitUser=this.submitUser.bind(this);

    this.state={
      login:"true",
      signup :"false",
      name:"",
      phonenumber:"",
      password:"",
      phonenumber:"",
      organisation:"",
      errorMessage:'',
      errorOccurred:"false"
    }
    this.handleGoogleLogin.bind(this);
}

    encode(key, data) {
      console.log(key,data)
      data = this.xor_encrypt(key, data);
      return this.b64_encode(data);
    }
    decode(key, data) {
      data = this.b64_decode(data);
      return this.xor_decrypt(key, data);
    }
 

 
b64_encode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
    if (!data) { return data; }
    do {
      o1 = data[i++];
      o2 = data[i++];
      o3 = data[i++];
      bits = o1 << 16 | o2 << 8 | o3;
      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;
      enc += this.b64_table.charAt(h1) + this.b64_table.charAt(h2) + this.b64_table.charAt(h3) + this.b64_table.charAt(h4);
    } while (i < data.length);
    r = data.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
  }
 b64_decode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
    if (!data) { return data; }
    data += "";
    do {
      h1 = this.b64_table.indexOf(data.charAt(i++));
      h2 = this.b64_table.indexOf(data.charAt(i++));
      h3 = this.b64_table.indexOf(data.charAt(i++));
      h4 = this.b64_table.indexOf(data.charAt(i++));
      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      o1 = bits >> 16 & 0xff;
      o2 = bits >> 8 & 0xff;
      o3 = bits & 0xff;
      result.push(o1);
      if (h3 !== 64) {
        result.push(o2);
        if (h4 !== 64) {
          result.push(o3);
        }
      }
    } while (i < data.length);
    return result;
  }
 
 xor_encrypt(key, data) {
   console.log(data,key);
    return _.map(data, function(c, i) {
      return c.charCodeAt(0) ^ key.charCodeAt( Math.floor(i % key.length) );
    });
  }
xor_decrypt(key, data) {
    return _.map(data, function(c, i) {
      return String.fromCharCode( c ^ key.charCodeAt( Math.floor(i % key.length) ) );
    }).join("");
  }
 


handleChange(event) {
  console.log(event.target.name)
  this.setState({
    [event.target.name]: event.target.value
});
}
switch(type) {
  console.log(this.state);
  if (type=='login') {
    this.setState(
         {login : "true", signup :"false",name:"", phonenumber:"", address:"", city:"",state:"",categoryType:"",
         category:"",password:"",phonenumber:"",errorMessage:'',errorOccurred:"false" }
    )
  }
    else {
      this.setState(
        {login : "false", signup :"true",name:"", phonenumber:"", address:"", city:"",state:"",categoryType:"",
        category:"",password:"",phonenumber:"",errorMessage:'',errorOccurred:"false" }
   )
  }
  console.log(this.state);
}

submitUser=(event)=> {
  debugger;
  event.preventDefault();
  let category;
  // console.log(this.categorytype);
  
  if (this.state.categorytype == 'individual') {
    category = 'individual'
  } else {
    category = this.state.category
  }
  //add encryption
//check for the user
Firebase.database().ref('SignUpInComplete/'+this.state.phonenumber).limitToFirst(1).once("value", snapshot => {
  if (snapshot.exists()){
    this.setState({errorOccurred:"true"});
    this.setState({errorMessage:"User already exists"});
     console.log("exists!");
     return false;
  }
  else{
    let Password_for_Db = this.encode("U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=",this.state.password)
    console.log(Password_for_Db);
    Firebase.database().ref('SignUpInComplete/' + this.state.phonenumber).set({
      category: this.state.category,
      City: this.state.city,
      Password: Password_for_Db,
      State: this.state.state,
      address: this.state.address,
      name: this.state.name,
      PhoneNumber: this.state.phonenumber,
      Organisation: '',
      isRegistered: '',
      latitude: '',
      longitude: '' 
    }).then(res => {
      localStorage.setItem('user', JSON.stringify({'phone': this.state.phonenumber,'name': this.state.name}))
      this.props.history.push('/dashboard');
    }).catch(err => {
      // console.log(err);
      
    });
  }
})
  // .then(res => {
  //   console.log(res);
    
    // localStorage.setItem('user', this.PhoneNumber);
    // this.router.navigate(['/dashboard']);
  // }).catch(err => {
  //   alert('Something went wrong');
  // })
}

signIn(e) {
  e.preventDefault();
  if((this.state.phonenumber=="" && this.state.password=="") || (this.state.phonenumber=="" || this.state.password==""))
  {
    this.setState({errorOccurred:"true"});
    this.setState({errorMessage:"Invalid Credentials!!"});
    return false;
  }
  const data = {
    PhoneNumber: this.state.phonenumber,
    Password: this.state.password
  }
  let pro = new Promise((resolve,reject) => {
    console.log(this.state.phonenumber)
    Firebase.database().ref('SignUpInComplete').orderByChild('PhoneNumber').equalTo(this.state.phonenumber).on("value", snapshot => {
      // const password = snapshot.val().Password;
      snapshot.forEach((data)=> {
      let bytes;
       bytes  = data.val().Password;
      let originalText = this.decode("U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=",bytes);
      console.log(originalText)
      if (originalText == this.state.password) {
        const retdata = {
          phone: data.val().PhoneNumber,
          name: data.val().name
        }
        console.log("here");
        resolve(retdata);   
      } 
      else {
        console.log("login failed");
        this.setState({errorOccurred:"true"});
        this.setState({errorMessage:"Invalid Credentials!!"});
        reject();
      }
    }) 
          
    });
  })
console.log(pro);
  pro.then(res => {
    console.log(res);
    console.log("login success");
    localStorage.setItem('user', JSON.stringify(res))
    this.props.history.push('/dashboard');
  }).catch(err => {
    this.errorOccurred="true";
    this.errorMessage="Wrong number or password";
  })

  

  // var chekcUser = this.fire.getUser(, this.Password);
  // if (chekcUser == 'true') {
  //   this.router.navigate(['/dashboard']);
  // }
}

handleGoogleLogin=(event)=>
{
  console.log(this);
  event.preventDefault();
  var provider = new Firebase.auth.GoogleAuthProvider();
  var prom1=new Promise((resolve,reject)=>
  {
    Firebase.auth().signInWithPopup(provider).then(function(result) {
    // var token = result.credential.accessToken;  
    // var user = result.user;
    const userData={
     user_name:result.user.displayName,
     user_email:result.user.email,
     mod_user_email : '',
     newUser:result.additionalUserInfo.isNewUser,
    }
    console.log(userData);
    resolve(userData);
    })})
    prom1.then(res=>{
     var user_email=res.user_email;
     var mod_user_email='';
     var user_name=res.user_name;
    if(res.newUser==true)
    {
     //yaha par prompt do phone number ka
     var phone = prompt("Please enter your Phone Number", "Enter Phone Number");
     while (!phone)
      {
      var phone = prompt("Please enter your Phone Number", "Enter Phone Number");
      }
      console.log(phone,user_email);
      //this.setState({phonenumber:phone},()=>{console.log(this.state.phonenumber)});
     for (let index = 0; index < user_email.length; index++) {
      if (user_email[index] == ".") {
        mod_user_email = mod_user_email + ','
      }
      else {
        mod_user_email = mod_user_email + user_email[index]
      }
    }
    console.log("asjfgadj", mod_user_email);
    Firebase.database().ref("GmailFbLogin/" + mod_user_email + "/").set({
      PhoneNumber: phone,
    })
    Firebase.database().ref("SignUpInComplete/" + phone + "/").set({
      // BlockedCounter: 0,
      City: '',
      Organisation: '',
      Password: '',
      PhoneNumber: phone,
      name: user_name,
      State: '',
      address: '',
      category: "individual",
      isRegistered: false,
      latitude: '',
      longitude: '',
      // GoogleId: '',
     
    })
    console.log("database entry complte");
    localStorage.setItem('user', JSON.stringify({'phone': phone,'name': user_name}))
    console.log("heyyy");
     this.props.history.push('/dashboard');
  //  alert("yes");
  }
 else
    {
     //returns all the mailID's
     console.log("false");
     console.log(this);
     var readEmails = new Promise((resolve, reject) => {
      Firebase.database().ref("GmailFbLogin/").on("value", (snapshot) => {
        var emails = Object.keys(snapshot.val())
        if (emails)
          resolve(emails)
        else
          reject("No mail found")
      })
    })


    readEmails.then((emails) => {
      console.log("emails= ", emails);
      for (let index = 0; index < user_email.length; index++) {
        if (user_email[index] == ".") {
          mod_user_email = mod_user_email + ','
        }
        else {
          mod_user_email = mod_user_email + user_email[index]
        }
      }
      emails.forEach(element => {
        console.log("element= ", element);
        console.log("mod= ", mod_user_email);

        if (element == mod_user_email) {
          console.log("inside if");

          //if match then find the phone number
          var get_prompt_number = new Promise((resolve, reject) => {
            Firebase.database().ref("GmailFbLogin/" + mod_user_email + "/").on("value", (snapshot) => {
              console.log(snapshot.val());
              if (snapshot.val())
                resolve(snapshot.val())
              else
                reject("sdhvj")
            })
          })

          get_prompt_number.then((details) => {
            console.log("details", details);
            //afterword change this to a better logic to find key inside a collection
            var searchSignup = new Promise((resolve, reject) => {
              Firebase.database().ref("SignUpInComplete/"+details.PhoneNumber+"/").on("value", snapshot => {
                console.log("snapshot.val()",snapshot.val())
                if (snapshot.val() != null)
                  resolve(snapshot.val())
                else{
                  reject("no data found")
                  //this.props.history.push("Drawer")
                }
              })
            })

            searchSignup.then((phone_key) => {
              console.log("phone_key",phone_key.PhoneNumber);
              console.log("name",phone_key.name);
              localStorage.setItem('user', JSON.stringify({'phone': phone_key.PhoneNumber,'name': phone_key.name}))
              this.props.history.push('/dashboard');
              // this.props.dispatch({type: 'UPDATE_TEXT', text: phone_key.name})
              // this.props.dispatch({type: 'UPDATE_PHONE', text: phone_key.PhoneNumber})
              // this.props.dispatch({type: 'UPDATE_CAT', text: phone_key.category})
              // this.props.dispatch({type: 'UPDATE_CITY', text: phone_key.City})
              // this.props.navigation.navigate("Drawer")
            })//end of searchSignup
          })//end of get_prompt_number
            .catch(() => {

            })
        }
      });
    })//end of reademails
      .catch((err_msg) => {

      })
    }
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

forgotPassword()
{

}

render()
    {
    return (
      <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          
            <div className="imgDiv">
               <img className="logo" src={require("./Logo-White.jpg")} alt="IMG"/>
            </div>
          
  
         {this.state.login==="true" &&  <form className="login100-form validate-form" onSubmit={(e)=>this.signIn(e)}>
            {/* <span className="login100-form-title">
               Login
            </span> */}
  
            <div className="wrap-input100 validate-input" data-validate = "Phone Number is required" >
              <input required className="input100" type="phone" pattern="^\d{10}$" value={this.state.phonenumber} onChange={this.handleChange.bind(this)}  name="phonenumber" placeholder="Phone Number" />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </span>
            </div>
  
            <div className="wrap-input100 validate-input" data-validate = "Password is required">
              <input required className="input100" type="password" value={this.state.password} onChange={this.handleChange.bind(this)} name="password" placeholder="Password"/>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            
             

            <div className="container-login100-form-btn">
              <button className="login100-form-btn" >
                Login
              </button>
             
                <a className="btn" href="/users/googleauth" onClick={this.handleGoogleLogin} role="button" style={{textTransform:"none", marginTop:'17px'}}>
                <div className="googleSignIn">
                  <div className="gmailLogo">
                  <img width="20px" style={{marginBottom:"3px", marginRight:"5px"}} alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                  </div>
                  <div className="gmailText">
                   Sign In with Google
                   </div>
                   </div>
             </a> 
           
            </div>
            {this.state.errorOccurred && <div  style={{marginTop:'10px', color : 'red', textAlign:'center'}} className="wrap-input100 validate-input" >
               {this.state.errorMessage}
              {/* <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span> */}
            </div>}
            {/* <div className="text-center p-t-12">
              <span className="txt1">
                Forgot
              </span>
              <a className="txt2" href="#">
                Username / Password?
              </a>
            </div> */}
  
            <div className="text-center p-t-136" onClick={(type)=>{this.switch('signup')}}>
              <a className="txt2" href="#">
                Create your Account
                
              </a>
            </div>
          </form>
        }
          {this.state.signup==="true" &&  <form className="login100-form validate-form" onSubmit={this.submitUser}>
            {/* <span className="login100-form-title">
              Signup
            </span> */}
            {/* <label style={{marginLeft:'10px'}}>Name*</label> */}
            <div className="wrap-input100 validate-input">
            <input type="text" className="input100" pattern="^[a-zA-Z]+(\s[a-zA-Z]+)?$" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} placeholder="Name*"  required autoComplete="off" />
            <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-user-o" aria-hidden="true"></i>
              </span>
            </div>

            {/* <label style={{marginLeft:'10px'}}>Phone Number*</label> */}
            <div className="wrap-input100 validate-input">
            <input type="text" className="input100" pattern="^\d{10}$" name="phonenumber" required placeholder="Phone Number" value={this.state.phonenumber} onChange={this.handleChange.bind(this)} autoComplete="off"/>  

              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </span>
              </div> 
            
              {/* <label style={{marginLeft:'10px'}}>Organisation*</label> */}
            <div className="wrap-input100 validate-input">
            <input type="text" className="input100" name="organisation" required placeholder="Organisation" value={this.state.organisation} onChange={this.handleChange.bind(this)} autoComplete="off"/>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-building-o" aria-hidden="true"></i>
              </span>
            </div>


            {/* <div className="wrap-input100 validate-input" >
            <div className="labelBox100">
            <label style={{marginLeft:'10px'}}>Address</label>
            <input className="input100" name="address" type="text" value={this.state.address} onChange={this.handleChange.bind(this)} required placeholder="Address*" autoComplete="off"/>
            </div> 
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div> */}
            
            {/* <div className="wrap-input50 validate-input">
            <div className='labelBox'>
              <label style={{marginLeft:'10px'}}>City</label>
            <input className="input50" name="city" type="text" value={this.state.city} onChange={this.handleChange.bind(this)} required placeholder="City*"  autoComplete="off"/>
            </div>
            <div className="labelBox">
              <label style={{marginLeft:'10px'}}>State</label>
            <input className="input50" name="state" type="text" value={this.state.state} onChange={this.handleChange.bind(this)} required placeholder="State*"  autoComplete="off"/>  
            </div>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div> */}

            {/* <div className="wrap-input100 validate-input" >
            <input className="input100" name="state" type="text" value={this.state.state} onChange={this.handleChange.bind(this)} required placeholder="State*"  autoComplete="off"/>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div> */}
           
            {/* <div className="wrap-input100 validate-input" >
            <div className="labelBox100">
              <label style={{marginLeft:'10px'}}>Category</label>
            <select  className="input100" name="categoryType" value={this.state.categoryType} onChange={this.handleChange.bind(this)}  aria-placeholder="Category">
                 <option defaultValue="">Category*</option>
                <option value="individual">Individual</option>
                <option value="vendor">Vendor</option>
            </select>
            </div>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div> */}

          {/* {this.state.categoryType=='vendor' &&
           <div className="wrap-input100 validate-input radioButtons" data-validate = "Password is required">
              <input type="radio" id='kirana'  name="category" value="kirana" onChange={this.handleChange.bind(this)}></input>
              <label htmlFor="kirana">Kirana</label><br></br>
              <input type="radio" id="chemist"  name="category" value="chemist" onChange={this.handleChange.bind(this)} ></input>
              <label htmlFor="chemist">Chemist</label><br></br>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>} */}

            {/* <label style={{marginLeft:'10px'}}>Password*</label> */}
            <div className="wrap-input100 validate-input" data-validate = "Password is required">
              <input className="input100" type="password" value={this.state.password} onChange={this.handleChange.bind(this)} name="password" required placeholder="Password"/>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            
            <div className="container-login100-form-btn">
             <button className="login100-form-btn">
                SignUp
              </button>
            </div>
  
            {/* <div className="text-center p-t-12">
              <span className="txt1">
                Forgot
              </span>
              <a className="txt2" href="#">
                Username / Password?
              </a>
            </div>
   */}
            {this.state.errorOccurred=='true' && <div style={{marginTop:'10px', color:'red'}} className="text-center p-t-136">
               {this.state.errorMessage}
            </div>}
            <div className="text-center p-t-136 mt15" onClick={(type)=>{this.switch('login')}}>
              <a className="txt2" href="#">
                Already have an Account
              </a>
            </div>
           
          </form>
        }
        </div>
      </div>
    </div>
    
    
	
	
    
    );
    }

}
export default Authentication;