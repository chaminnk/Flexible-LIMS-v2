import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import 'react-phone-number-input/style.css';

import PhoneInput from 'react-phone-number-input';
import * as ROUTES from '../../constants/routes';

import * as firebase from 'firebase';


const AddUserPage = () => (
  <div>
    
    <AddUserForm />
  </div>
);


class AddUserFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = ({ 
      firstName: '',
      lastName: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      contactNum: '',
      address:'',
      dob:'',
      today:'',
      gender: 'Male',
      userType: 'unapproved',
      signupLoading: false,
      
      //error: false
    })
      //this.handleChange = this.handleChange.bind(this);
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
 
  addUser = (email, passwordOne, firstName, lastName,contactNum, address, dob, gender, userType) => {
    // const { firstName, lastName, email, passwordOne } = this.state;
    email=email.trim(); //remove unnecessary white spaces
    const end = new Date();
    this.setState({today: String(end.getFullYear())+'-'+(String(end.getMonth()+1))+'-'+String(end.getDate())});
   
    // add user validation
    if(this.state.firstName.length<3 || this.state.firstName.length>20){
      alert("First name should have 3-20 characters.");
      return;
    
    }else if(this.state.lastName.length<3 || this.state.lastName.length>20){
      alert("Last name should have 3-20 characters.");
      return;
    }else if (!(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+/.test(this.state.email))) { 
      alert("Please enter a valid Email adress");
      return;
    }else if(this.state.passwordOne.length<6 ){
      alert("Password should have at least 6 characters.");
      return;
    }else if(this.state.passwordOne !== this.state.passwordTwo){
      alert("Passwords do not match.");
      return;
    }
    // else if(this.state.contactNum !== 10){
    //   alert("Contact Number you entered has only "+this.state.contactNum.length+" numbers. It should have 10 numbers.");
    //   return;
    // }
   
    // var bcrypt = require('bcryptjs');
    // bcrypt.genSalt(10, function(err, salt) {
    //   bcrypt.hash(passwordOne, salt, function(err, hash) {
    //       hashpass=hash;
    //   });
    // });
    firstName=firstName.charAt(0).toUpperCase()+firstName.slice(1);
    lastName=lastName.charAt(0).toUpperCase()+lastName.slice(1);
    this.setState({signupLoading: true});
    this.props.firebase.doCreateUserWithEmailAndPassword(email, passwordOne).then(function(user) {
  
          var userId = firebase.auth().currentUser.uid;
         
   
          firebase.database().ref("users/" + userId).set({
            userKey: userId,
            firstName: firstName,
            lastName:lastName,
            email: email,
            contactNum:contactNum,
            address: address,
            dob: dob,
            gender: gender,
            userType: userType,
          });
          alert("User successfully created. Please log in to continue after Admin approval");
          
          
        
        this.setState({signupLoading: false});
        
        firebase.auth().signOut();
        this.props.history.push(ROUTES.SIGN_IN);
      }.bind(this)).catch(error => {
        alert(error.message);
      });
      
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event
    
  };
  
  render() {
   


    return (
      <div style ={{marginTop: "50px"}} >
      <div class="d-flex justify-content-center ">
      
         
        
          <div class="card w-50">
          <div class="d-flex justify-content-center ">
          <div class="card" style={{width: "18rem"}}>
            <div class="text-center">
                  <h3><i class="fas fa-user-plus"></i>  Add User</h3>
                  <hr class="mt-2 mb-2"></hr>
            </div>
            <div class="md-form">
                <div class="text-center">
              <input
                name="firstName"
                onChange={this.onChange}
                type="text"
                placeholder="Enter First Name"
                value={this.state.firstName}

              />
              </div>
            </div>
            <div class="md-form">
                <div class="text-center">
              <input
                name="lastName"
                value={this.state.lastName}
                onChange={this.onChange}

                type="text"
                placeholder="Enter Last Name"
              />
              </div>
            </div>
            <div class="md-form">
                <div class="text-center">
               <input
                name="email"
                value={this.state.email}
                onChange={this.onChange}

                type="email"
                placeholder="Enter Email Address"
              />
            </div>
            </div>
            <div class="md-form">
                <div class="text-center">
            <input
                name="passwordOne"
                value={this.state.passwordOne}
                onChange={this.onChange}

                type="password"
                placeholder="Enter Password"
              />
              </div>
            </div>
            <div class="md-form">
                <div class="text-center">
              <input
                name="passwordTwo"
                value={this.state.passwordTwo}
                onChange={this.onChange}

                
                type="password"
                placeholder="Enter Password Again"
              />
              </div>
            </div>
            
            <div class="d-flex justify-content-center ">
                <div class="text-center">
                <PhoneInput
                    placeholder="Enter Contact Number"
                    value={ this.state.contactNum }
                    onChange={ contactNum => this.setState({ contactNum }) } />
              </div>
            </div>
            <div class="md-form">
                <div class="text-center">
              <input
                name="address"
                value={this.state.address}
                onChange={this.onChange}

                
                type="text"
                placeholder="Enter Address."
              />
              </div>
            </div>
            <div class="md-form">
                  <div class="text-center">
                  Date of Birth: <input
                  name="dob"
                  value={this.state.dob}
                  onChange={this.onChange}
    

                  type="date"
                  placeholder="Select Date"
                />
                </div>
              </div>
            <div class="md-form">
                <div class="text-center">
        
          Gender:
          <select name="gender" value={this.state.value} onChange={this.onChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

              </div>
            </div>
            

            
            
            <div class="text-center">             
              <button class="btn aqua-gradient" onClick = { () => this.addUser(this.state.email, this.state.passwordOne, this.state.firstName, this.state.lastName,this.state.contactNum,this.state.address, this.state.dob, this.state.gender,this.state.userType)} >Add User</button>
              </div>
             
            </div>
          </div>
          </div>
      </div>
      </div>

      
    );
  }
}
// link to be used in sign in page for sign up


const AddUserForm = withRouter(withFirebase(AddUserFormBase)); // give access to the props of the router and firebse

export default AddUserPage;

export { AddUserForm };
