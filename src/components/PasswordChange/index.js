import React, { Component } from 'react';


import { AuthUserContext } from '../Session';
import {AccountNavBar} from '../AccountNavBar';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};
const PasswordChangeForm = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <AccountNavBar />
        
        : <p></p>
      }
    </AuthUserContext.Consumer>

      <PasswordChangeFormBase />

  </div>
);
class PasswordChangeFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default (PasswordChangeForm);
export {PasswordChangeFormBase};