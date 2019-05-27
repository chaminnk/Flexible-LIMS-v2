import React, { Component } from 'react';


import * as ROUTES from '../../constants/routes';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
  MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
import { AuthUserContext } from '../Session';
import SignOut from '../SignOut';
import PatientNavigation from '../Patient/navigation';
import '../../App.css'
import * as firebase from 'firebase';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);
class NavigationAuthDisplay extends Component {
state = {
  isOpen: false
};

toggleCollapse = () => {
  this.setState({ isOpen: !this.state.isOpen ,fire_loaded:false });
}
async componentWillMount() {
  await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
      this.userType = snapshot.val().userType;
      this.setState({fire_loaded:true});
      this.forceUpdate();
  });
}
render() {
  return (
    <div>
      {this.userType==='unapproved'?
      <div>

      </div>
      :
      <div>
        {this.state.fire_loaded?
        <div>
          <div>
      {this.userType === 'admin' || this.userType === 'ldo' ?
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
        
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                Create 
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem href={ROUTES.ADD_PROPERTY}>Create Property</MDBDropdownItem>
                <MDBDropdownItem href={ROUTES.CREATE_FORM}>Create Form</MDBDropdownItem>
                <MDBDropdownItem href={ROUTES.CREATE_RESULT}>Create Test Result</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>

            
          </MDBNavItem>
          <MDBNavItem>
        
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                View 
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem href={ROUTES.VIEW_PROPERTIES}>View Properties</MDBDropdownItem>
                
                <MDBDropdownItem href={ROUTES.FORM_LIST}>View Forms</MDBDropdownItem>
                <MDBDropdownItem href={ROUTES.PATIENT_LIST}>View Patients</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>

            
          </MDBNavItem>
          <MDBNavItem>
        
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                Update 
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem href={ROUTES.UPDATE_PROPERTY}>Update Property</MDBDropdownItem>
                <MDBDropdownItem href={ROUTES.UPDATE_FORM}>Update Form</MDBDropdownItem>
                <MDBDropdownItem href={ROUTES.PATIENT_LIST}>Update Test Result</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>

            
          </MDBNavItem>
          
          
         
         
          
          {this.userType === 'admin'  ?
          <MDBNavItem>
        
          <MDBDropdown>
            <MDBDropdownToggle nav caret>
              Users 
            </MDBDropdownToggle>
            <MDBDropdownMenu className="dropdown-default" right>
     
              
              <MDBDropdownItem href={ROUTES.APPROVE_USER}>Approve Users</MDBDropdownItem>
              <MDBDropdownItem href={ROUTES.VIEW_USERS}>View All Users</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>

          
        </MDBNavItem>
          
          :
          <MDBNavItem>
            <p></p>
          </MDBNavItem>
          }
          
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
      
      :
      <PatientNavigation />
      }
    </div>
        </div>
        :
        <div></div>}
      </div>
      }
    </div>
    
    
    
    );
  }
}
const NavigationAuth = NavigationAuthDisplay; 

const NavigationNonAuth = () => (
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

export default Navigation;
export {NavigationAuth,NavigationNonAuth};