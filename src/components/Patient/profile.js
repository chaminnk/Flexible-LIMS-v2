import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';

import { withAuthorization } from '../Session';
import * as firebase from 'firebase';
import {  withRouter } from 'react-router-dom';
import {AccountNavBar} from '../AccountNavBar';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <AccountNavBar/>
        <h1>Account: {authUser.email}</h1>

        <AccountPageForm/>
      </div>
    )}
  </AuthUserContext.Consumer>

);
class AccountPageFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = ({ 
      firstName: '',
      lastName: '',
      email: '',
      userType: '',
      loading: true,
      fire_loaded1: false,

    })

  }


  userId1 = firebase.auth().currentUser.uid;
  userDetails = [];
  async componentWillMount() {
    firebase.database().ref('users/').orderByChild('userId').equalTo(this.userId1).on('value', (snapshot) => {
      this.userDetails = [];
      snapshot.forEach((child)=>{
        this.setState({
          firstName: child.val().firstName,
          lastName: child.val().lastName,
          email: child.val().email,
          userType: child.val().userType
        })
      }) 
      this.setState({fire_loaded1:true});
    });
    this.setState({ loading: false });
  }
  
  updateUser = (email, firstName, lastName) => {
    
    email=email.trim(); //remove unnecessary white spaces

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
    }


    firstName=firstName.charAt(0).toUpperCase()+firstName.slice(1);
    lastName=lastName.charAt(0).toUpperCase()+lastName.slice(1);
    this.setState({signupLoading: true});
    var user = firebase.auth().currentUser;
    
    user.updateEmail(email).then(function() {
      // Update successful.
    }).catch(function(error) {
      alert(error.message);
    });
    var userId = firebase.auth().currentUser.uid;
    var updates = {};
    updates['/users/' + userId + '/email'] = email;
    updates['/users/' + userId + '/firstName'] = firstName;
    updates['/users/' + userId + '/lastName'] = lastName;
    firebase.database().ref().update(updates);
    alert("User details successfully updated.");
  }
    

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event
  };

  render() {
   


    return (
      

      <div>
      {this.state.fire_loaded1 ?
      <div>

      
      <div class="d-flex justify-content-center ">
      
         
        
          <div class="card w-50">
            <div class="text-center">
                  <h3><i class="fas fa-user-plus"></i> Update Profile</h3>
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

                //onChange={(lastName) => this.setState({lastName})}
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
            
            


            
            <div class="text-center">
              <button class="btn aqua-gradient" onClick = { () => this.updateUser(this.state.email, this.state.firstName, this.state.lastName)} >Update Profile</button>
              </div>
             
            </div>
   
   
      </div>
     
      </div>
      :
      <div><p>Loading information. If this is taking too long please check your internet connection</p></div>
      }
      </div>
    );
     
  }
}
const AccountPageForm = withRouter(withFirebase(AccountPageFormBase)); // give access to the props of the router and firebse
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
export {AccountPageForm}