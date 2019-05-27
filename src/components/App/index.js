import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; // router component

import Navigation from '../Navigation';

import AddUserPage from '../AddUser';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AddPropertyPage from '../AddProperty';
import ViewPropertiesPage from '../ViewProperty';
import ViewNumericPropertiesPage from '../ViewNumericProperties';
import ViewOptionPropertiesPage from '../ViewOptionProperties';
import ViewTextPropertiesPage from '../ViewTextProperties';
import ViewUsersPage from '../ViewUser';
import FormListPage from '../ViewForms/formList';
import ViewFormsPage from '../ViewForms';
import PasswordChangeForm from '../PasswordChange';
import CreateFormPage from '../CreateForm';
import CreateResultPage from '../Create Result';
import ApproveUsersPage from '../ApproveUser';
import ViewResultsPage from '../Patient/results';
import ViewTestPage from '../Patient/viewTest';
import CreateNumericPropertyPage from '../CreateNumericProperty';
import CreateOptionPropertyPage from '../CreateOptionProperty';
import CreateTextPropertyPage from '../CreateTextProperty';
import UpdatePropertyPage from '../UpdateProperty';
import UpdateNumericPropertyPage from '../UpdateNumericProperty';
import UpdateOptionPropertyPage from '../UpdateOptionProperty';
import UpdateTextPropertyPage from '../UpdateTextProperty';
import UpdateFormPage from '../UpdateForm';
import PatientListPage from '../UpdateTestResult/patientList';
import TestListPage from '../UpdateTestResult/testList';
import UpdateTestPage from '../UpdateTestResult/index';
import PatientAccountPage from '../Patient/profile';

import * as ROUTES from '../../constants/routes';


import { withAuthentication } from '../Session';




class App extends Component {
  render(){
    return(
      <Router>
        {/* <body  style={{backgroundImage: 'url(' + require('../../assets/13971.jpg') + ')'}} > */}
        <div >
          
          <Navigation />
       
          
        
          <Route exact path={ROUTES.ADD_USER} component={AddUserPage} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route exact path={ROUTES.ADD_PROPERTY} component={AddPropertyPage} />
          <Route exact path={ROUTES.VIEW_PROPERTIES} component={ViewPropertiesPage} />
          <Route exact path={ROUTES.VIEW_NUMERIC_PROPERTIES} component={ViewNumericPropertiesPage} />
          <Route exact path={ROUTES.VIEW_TEXT_PROPERTIES} component={ViewTextPropertiesPage} />
          <Route exact path={ROUTES.VIEW_OPTION_PROPERTIES} component={ViewOptionPropertiesPage} />
          <Route exact path={ROUTES.VIEW_USERS} component={ViewUsersPage} />
          <Route exact path={ROUTES.VIEW_FORMS} component={ViewFormsPage} />
          <Route exact path={ROUTES.PASSWORD_UPDATE} component={PasswordChangeForm} />
          <Route exact path={ROUTES.CREATE_FORM} component={CreateFormPage} />
          <Route exact path={ROUTES.CREATE_RESULT} component={CreateResultPage} />
          <Route exact path={ROUTES.APPROVE_USER} component={ApproveUsersPage} />
          <Route exact path={ROUTES.VIEW_PATIENT_RESULTS} component={ViewResultsPage} />
          <Route exact path={ROUTES.VIEW_TEST} component={ViewTestPage} />
          <Route exact path={ROUTES.CREATE_NUMERIC_PROPERTY} component={CreateNumericPropertyPage} />
          <Route exact path={ROUTES.CREATE_OPTION_PROPERTY} component={CreateOptionPropertyPage} />
          <Route exact path={ROUTES.CREATE_TEXT_PROPERTY} component={CreateTextPropertyPage} />
          <Route exact path={ROUTES.UPDATE_PROPERTY} component={UpdatePropertyPage} />
          <Route exact path={ROUTES.UPDATE_NUMERIC_PROPERTY} component={UpdateNumericPropertyPage} />
          <Route exact path={ROUTES.UPDATE_OPTION_PROPERTY} component={UpdateOptionPropertyPage} />
          <Route exact path={ROUTES.UPDATE_TEXT_PROPERTY} component={UpdateTextPropertyPage} />
          <Route exact path={ROUTES.UPDATE_FORM} component={UpdateFormPage} />
          <Route exact path={ROUTES.PATIENT_LIST} component={PatientListPage} />
          <Route exact path={ROUTES.TEST_LIST} component={TestListPage} />
          <Route exact path={ROUTES.UPDATE_TEST} component={UpdateTestPage} />
          <Route exact path={ROUTES.FORM_LIST} component={FormListPage} />
          <Route exact path={ROUTES.PATIENT_ACCOUNT_PAGE} component={PatientAccountPage} />
          

        </div>
        

      </Router>

    );
  }
  
}

export default withAuthentication(App);
