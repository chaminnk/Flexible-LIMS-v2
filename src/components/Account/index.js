import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as firebase from 'firebase';
import {  withRouter } from 'react-router-dom';
import 'react-phone-number-input/style.css';

import PhoneInput from 'react-phone-number-input';
import {AccountNavBar} from '../AccountNavBar';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <AccountNavBar/>
        

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
      contactNum: '',
      address:'',
      dob:'',
      today:'',
      gender: '',
      loading: true,
      fire_loaded1: false,

    })

  }


  userId1 = firebase.auth().currentUser.uid;
  userDetails = [];
  async componentWillMount() {
    firebase.database().ref('users/').orderByKey().equalTo(this.userId1).once('value', (snapshot) => {
      this.userDetails = [];
      snapshot.forEach((child)=>{
        this.setState({
          firstName: child.val().firstName,
          lastName: child.val().lastName,
          email: child.val().email,
          contactNum: child.val().contactNum,
          address: child.val().address,
          dob: child.val().dob,
          gender: child.val().gender
        })
      }) 
      this.setState({fire_loaded1:true});
    });
    this.setState({ loading: false });
    console.log(this.state.firstName);
  }
  
  updateUser = (email, firstName, lastName, contactNum, address, gender, dob) => {
    
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
    
    
    firebase.database().ref('/testResults').orderByChild("userKey").equalTo(userId).once('value').then(snap => {
      let testKeys = Object.keys(snap.val());
      console.log(testKeys);
      let updates = {};
      testKeys.forEach(key => {
        updates['testResults/'+key+'/email'] = email;
        updates['testResults/'+key+'/firstName'] = firstName;
        updates['testResults/'+key+'/lastName'] = lastName;
        updates['testResults/'+key+'/gender'] = gender;
      });
      updates['/users/' + userId + '/email'] = email;
      updates['/users/' + userId + '/firstName'] = firstName;
      updates['/users/' + userId + '/lastName'] = lastName;
      updates['/users/' + userId + '/contactNum'] = contactNum;
      updates['/users/' + userId + '/address'] = address;
      updates['/users/' + userId + '/gender'] = gender;
      updates['/users/' + userId + '/dob'] = dob;
     
      firebase.database().ref().update(updates,function(error){
        if(error){
          alert(error.message);
        }
        else{
          alert("User details successfully updated.");
        }
      });
    })

    // ,(snapshot) =>{
      
    //   snapshot.forEach((child)=>{
        
    //     updates['/testResults/' + child.key]= {
    //       email: email,
    //       firstName: firstName,
    //       lastName: lastName,
    //       gender: gender
    //      };
    //     // = email;
    //     // updates['/testResults/' + child.key + '/firstName'] = firstName;
    //     // updates['/testResults/' + child.key + '/lastName'] = lastName;
    //     // updates['/testResults/' + child.key  + '/gender'] = gender;
    //   })
    // })

    // updates['/users/' + userId + '/email'] = email;
    //   updates['/users/' + userId + '/firstName'] = firstName;
    //   updates['/users/' + userId + '/lastName'] = lastName;
    //   updates['/users/' + userId + '/contactNum'] = contactNum;
    //   updates['/users/' + userId + '/address'] = address;
    //   updates['/users/' + userId + '/gender'] = gender;
    //   updates['/users/' + userId + '/dob'] = dob;
     
    //   firebase.database().ref().update(updates,function(error){
    //     if(error){
    //       alert(error.message);
    //     }
    //     else{
    //       alert("User details successfully updated.");
    //     }
    //   });
    
    
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
      
         
        
      <div class="card" style={{width: "50em"}}>
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
              <button class="btn aqua-gradient" onClick = { () => this.updateUser(this.state.email, this.state.firstName, this.state.lastName,this.state.contactNum,this.state.address,this.state.gender,this.state.dob)} >Update Profile</button>
              </div>
             
            </div>
   
   
      </div>
     
      </div>
      :
      <div style ={{marginTop: "50px"}} class = "d-flex justify-content-center">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      }
      </div>
    );
     
  }
}
const AccountPageForm = withRouter(withFirebase(AccountPageFormBase)); // give access to the props of the router and firebse
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
export {AccountPageForm}