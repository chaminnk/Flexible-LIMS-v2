import React, { Component } from 'react';


import * as ROUTES from '../../constants/routes';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
  MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
import { AuthUserContext } from '../Session';
import SignOut from '../SignOut';
import '../../App.css'


const PatientNavigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <PatientNavigationAuth /> : <PatientNavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);
class PatientNavigationAuthDisplay extends Component {
state = {
  isOpen: false
};

toggleCollapse = () => {
  this.setState({ isOpen: !this.state.isOpen });
}
render() {
  return (
    <MDBNavbar color="default-color" dark expand="md">
      <MDBNavbarBrand>
        <strong className="white-text">Flexible LIMS</strong>
      </MDBNavbarBrand>
      <MDBNavbarToggler onClick={this.toggleCollapse} />
      <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
        <MDBNavbarNav left>
          <MDBNavItem active>
            <MDBNavLink to={ROUTES.HOME}>Home</MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to={ROUTES.VIEW_PATIENT_RESULTS}>My Test Results</MDBNavLink>
          </MDBNavItem>
         
          
          
          
        </MDBNavbarNav>
        <MDBNavbarNav right>
          <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <MDBIcon icon="user" />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem href={ROUTES.ACCOUNT}>Settings</MDBDropdownItem>
                <MDBDropdownItem href="#!"><SignOut></SignOut></MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
      </MDBCollapse>
    </MDBNavbar>
    
    );
  }
}
const PatientNavigationAuth = PatientNavigationAuthDisplay; 

const PatientNavigationNonAuth = () => (
  <MDBNavbar color="default-color" dark expand="md">
  <MDBNavbarBrand>
    <strong className="white-text">Flexible LIMS</strong>
  </MDBNavbarBrand>
    <MDBNavbarNav right>
      <MDBNavItem active>
        <MDBNavLink to={ROUTES.SIGN_IN}>Sign In</MDBNavLink>
      </MDBNavItem>
      <MDBNavItem>
        <MDBNavLink to={ROUTES.ADD_USER}>Add User</MDBNavLink>
      </MDBNavItem>
    </MDBNavbarNav>
</MDBNavbar>
  
      
);

export default PatientNavigation;
export {PatientNavigationAuth,PatientNavigationNonAuth};