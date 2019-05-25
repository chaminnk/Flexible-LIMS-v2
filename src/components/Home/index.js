import React,  { Component } from 'react';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import {  withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import './col.css';
const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Welcome!</h1>
        <HomeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);
class HomeFormBase extends Component {
  constructor(props) {
    super(props);

    
  }


  render() {
   


    return (
      

  




      <div id="content">
      <div class="container">
              
      
          <div class="col-md-9">
  
      
  
              
              <div class="row">
                  <div class="col-md4 col-md-6 center-responsive">
                      <div class="component">
                          Create Property
                          <div class="text" >
                             
                      
                          </div>
                      </div>
                  </div>
                  <div class="col-md4 col-md-6 center-responsive">
                      <div class="product">
                          
                          <div class="text" >
                            
                              <p class="buttons">
                                  <a href="toys.php" class="btn btn-primary"><i class="fa fa-shopping-cart">View Catalog</i></a>
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>

      
      
    );
  }
}
const HomeForm = withRouter(withFirebase(HomeFormBase));
const condition = authUser => !!authUser;
const divStyle = {
  margin: '40px',
  border: '5px solid pink'
};
export default withAuthorization(condition)(HomePage);
