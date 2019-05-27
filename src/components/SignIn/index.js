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
      <div className="d-flex justify-content-center ">
      <div className="card" style={{width: "18rem"}}>
            <div className="text-center">
                <h3><i className="fas fa-sign-in-alt"></i> Log In</h3>
                
            </div>
           
                <div className="md-form">
                <div className="text-center">
                <input
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="email"
                    placeholder="Enter Email"
                />
                 </div>
                </div>
                <div className="text-center">
                <div className="md-form">
                <input
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Enter Password"
                />
                </div>
                </div>
                <div className="text-center">
                <button id = "login_button" className="btn blue-gradient" onClick = { () => this.loginUser(this.state.email, this.state.password)}>Log In</button>
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