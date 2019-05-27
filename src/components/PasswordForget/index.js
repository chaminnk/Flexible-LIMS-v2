import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';
import {AccountNavBar} from '../AccountNavBar';

const PasswordForgetPage = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <AccountNavBar />
        
        : <p></p>
      }
    </AuthUserContext.Consumer>
    
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  sendEmail = (email) => {
    if (!(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+/.test(email))) { 
      alert("Please enter a valid Email adress");
      return;
    }
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        alert("Password change email has been sent to your email account");
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        alert(error.message);
      });

   
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
   

    

    return (
      <div style ={{marginTop: "50px"}} >
      <div className="d-flex justify-content-center ">
      <div className="card" style={{width: "40rem"}}>
            <div className="text-center">
                <h3><i className="fas fa-user-plus"></i> Update Password via Email</h3>
                
            </div>
            <div className="md-form">
                <div className="text-center">
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Enter Email Address"
        />
             </div>
           </div>
           
        <div className="text-center">
          <button className="btn blue-gradient" onClick = { () => this.sendEmail(this.state.email)}>Send Email</button>
          
          </div> 
        {/* <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form> */}
      </div>
         
    </div>
    </div>
     
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
