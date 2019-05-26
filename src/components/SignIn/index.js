import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';


import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <div>
  
    <SignInForm />
    
   
    
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};




class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  loginUser = (email, password) => {

    // login validation
    if (!(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+/.test(this.state.email))) { 
      alert("Please enter a valid Email adress");
      return;
    }else if(this.state.password.length<6 ){
      alert("Password should have at least 6 characters.");
      return;
    }
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
        alert(this.state.error);
      });

    
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    

   
    return (
      <div style ={{marginTop: "50px"}} >
      <div class="d-flex justify-content-center ">
      <div class="card" style={{width: "18rem"}}>
            <div class="text-center">
                <h3><i class="fas fa-sign-in-alt"></i> Log In</h3>
                
            </div>
           
                <div class="md-form">
                <div class="text-center">
                <input
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="email"
                    placeholder="Enter Email"
                />
                 </div>
                </div>
                <div class="text-center">
                <div class="md-form">
                <input
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Enter Password"
                />
                </div>
                </div>
                <div class="text-center">
                <button class="btn blue-gradient" onClick = { () => this.loginUser(this.state.email, this.state.password)}>Log In</button>
                <PasswordForgetLink />
                </div>     
             
              </div>
         
        </div>
        </div>
      
    );
    }
}







const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);



export default SignInPage;

export { SignInForm };