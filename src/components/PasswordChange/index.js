import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { AuthUserContext } from '../Session';
import {AccountNavBar} from '../AccountNavBar';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',

};
const PasswordChangeFormPage = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <AccountNavBar />
        
        : <p></p>
      }
    </AuthUserContext.Consumer>

      <PasswordChangeForm />

  </div>
);
class PasswordChangeFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  resetPassword = (passwordOne,passwordTwo) => {
    if(passwordOne.length<6 ){
      alert("Password one should have at least 6 characters.");
      return;
    }
    else if(passwordTwo.length<6 ){
      alert("Password two should have at least 6 characters.");
      return;
    }
    else if(passwordOne!==passwordTwo ){
      alert("Passwords do not match.");
      return;
    }
    

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        alert("Password successfully updated");
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
      <div className="card" style={{width: "18rem"}}>
            <div className="text-center">
                <h3><i className="fas fa-user-plus"></i> Update Password</h3>
                
            </div>
            <div className="md-form">
                <div className="text-center">
        <input
          name="passwordOne"
          value={this.state.passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
             </div>
           </div>
           <div className="text-center">
                <div className="md-form">
        <input
          name="passwordTwo"
          value={this.state.passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        </div>
              </div>
        <div className="text-center">
          <button className="btn blue-gradient" onClick = { () => this.resetPassword(this.state.passwordOne,this.state.passwordTwo)}>Reset Password</button>
          
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
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(PasswordChangeFormPage)
const PasswordChangeForm = withFirebase(PasswordChangeFormBase);

export {PasswordChangeForm};