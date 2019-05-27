import React,  { Component } from 'react';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import {  withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';


const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div className="text-center" style ={{marginTop: "25px"}}>
        <h1>Welcome to Flexible-LIMS</h1>
        <HomeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);
class HomeFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {fire_loaded1: false}
    
  }

  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
      this.userType = snapshot.val().userType;
      this.setState({fire_loaded1:true});
      this.forceUpdate();
    });
    if ( this.userType === 'unapproved' ){
        alert("You don't have permission to view this page. Please notify the system admin to approve you as a user");
        firebase.auth().signOut();
    }
  }
  render() {
   


    return (
        <div>
            {this.userType === 'unapproved'?
            <div style ={{marginTop: "50px"}}>
            <h3>Please notify the system admin to approve you as a user!</h3>
            
            </div>
            :
            <div>
                <div>
        {this.state.fire_loaded1?
        <div>
        {this.userType === 'admin' || this.userType === 'ldo' ?
        <div id="content" style={{marginLeft:"242px" , marginRight: "120px", marginTop: "25px"}}>
        {/* <div class="container" style={{maxWidth: "1555px" , marginLeft:"120px" , marginRight: "120px", marginTop: "25px"}}> */}
                
        
         
    
        
    
                
                <div class="row">
                    <div class="col-sm-4 center-responsive">
                        
                          <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>Create Property</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn purple-gradient" onClick = { () => this.props.history.push(ROUTES.ADD_PROPERTY)}>Create Property</button>
                              </div>  
                        </div>
                    </div>
                    <div class="col-sm-4 center-responsive">
                    <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>Create Form</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn purple-gradient" onClick = { () => this.props.history.push(ROUTES.CREATE_FORM)}>Create Form</button>
                              </div>  
                        </div>
                    </div>
                    <div class="col-sm-4 center-responsive">
                    <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>Create Test</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn purple-gradient" onClick = { () => this.props.history.push(ROUTES.CREATE_RESULT)}>Create Test</button>
                              </div>  
                        </div>
                    </div>
                </div>
                
  
  
                <div class="row" style ={{marginTop: "100px"}}>
                    <div class="col-sm-4 center-responsive">
                        
                          <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>View Properties</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn aqua-gradient" onClick = { () => this.props.history.push(ROUTES.VIEW_PROPERTIES)}>View Properties</button>
                              </div>  
                        </div>
                    </div>
                    <div class="col-sm-4 center-responsive">
                    <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>View Forms</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn aqua-gradient" onClick = { () => this.props.history.push(ROUTES.FORM_LIST)}>View Forms</button>
                              </div>  
                        </div>
                    </div>
                    <div class="col-sm-4 center-responsive">
                    <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>View Tests</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn aqua-gradient" onClick = { () => this.props.history.push(ROUTES.PATIENT_LIST)}>View Tests</button>
                              </div>  
                        </div>
                    </div>
                </div>
  
                <div class="row" style ={{marginTop: "100px"}}>
                    <div class="col-sm-4 center-responsive">
                        
                          <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>Update Property</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn peach-gradient" onClick = { () => this.props.history.push(ROUTES.UPDATE_PROPERTY)}>Update Property</button>
                              </div>  
                        </div>
                    </div>
                    <div class="col-sm-4 center-responsive">
                    <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>Update Form</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn peach-gradient" onClick = { () => this.props.history.push(ROUTES.UPDATE_FORM)}>Update Form</button>
                              </div>  
                        </div>
                    </div>
                    <div class="col-sm-4 center-responsive">
                    <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>Update Test</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn peach-gradient" onClick = { () => this.props.history.push(ROUTES.PATIENT_LIST)}>Update Test</button>
                              </div>  
                        </div>
                    </div>
                </div>
    
        {/* </div> */}
    </div>
    :
    <div id="content">
        <div class="container" style={{maxWidth: "2000px" , marginLeft:"120px" , marginRight: "120px", marginTop: "25px"}}>
                
        
         
    
        
    
                
                <div class="row">
                    <div class="col-sm-4 center-responsive">
                        
                          <div class="card " style={{width: "18rem"}}>
                              <div className="text-center">
                                  <h3>My Test Results</h3>
                                  
                              </div>
                              <p></p>
                              <div class="text-center">  
                                  <button class="btn purple-gradient" onClick = { () => this.props.history.push(ROUTES.VIEW_PATIENT_RESULTS)}>View My Test Results</button>
                              </div>  
                        </div>
                    </div>
                    
                </div>
    
        </div>
    </div>
    }
    </div>
    :
    <div>
        <div style ={{marginTop: "50px"}} className = "d-flex justify-content-center">
                <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    }
    </div>                     
            </div>
            }
        </div>
    
        
  




      

      
      
    );
  }
}
const HomeForm = withRouter(withFirebase(HomeFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
