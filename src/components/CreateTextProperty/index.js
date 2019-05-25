import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase';
import { withAuthorization } from '../Session';

const CreateTextPropertyPage = () => ( // for the use of routing
  <div>
    
    <CreateTextPropertyForm />
  </div>
);



class CreateTextPropertyFormBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
    this.state = ({ 
      propertyName: '',
      userType:'',
      properties: [],
      timeStamp: String(timeStamp), 
      addPropertyLoading: false,
      fire_loaded:false,
      fire_loaded2:false
      
     })
      //this.handleChange = this.handleChange.bind(this);
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
  async componentWillMount() {
      //user authorization
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.setState({fire_loaded:true});
         this.forceUpdate();
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }

    firebase.database().ref('properties/').orderByChild('propertyName').on('value', (snapshot) => {
        this.fetchedDatas = [];
        
        snapshot.forEach((child)=>{
          
            this.fetchedDatas.push({
              propertyName:  child.val().propertyName,
            });
     
          
            
        }) 
        this.setState({properties:this.fetchedDatas});
        this.setState({fire_loaded2:true});
        //this.forceUpdate();
      });
  }
  
  addProperty = (propertyName) => {
    //proprty validation
    if(propertyName === '' ){

        alert("Property name field cannot be empty!");
        return;
    }
    
    
    else if(this.isNotUnique()){
        
        alert("The property name you entered already exists!");
       return;
        
    }
    propertyName=propertyName.charAt(0).toUpperCase()+propertyName.slice(1);

        
        this.setState({addPropertyLoading: true});
    var propertiesRef = firebase.database().ref("properties");
    propertiesRef.push({
        propertyName: propertyName,
        propertyType: "Text" ,
        createdBy: firebase.auth().currentUser.email,
        createdDate:  this.state.timeStamp     
    }).then(() => {
        alert("Text property successfully added!");
        this.setState({addPropertyLoading: false, propertyName:''}); 
        return true;
      })
      .catch(error => {
       alert(error.message);
      });    
     
    
    
    
   
    //   .then(authUser => {
    //     this.setState({ ...INITIAL_STATE });
        
    //   })
    //   .catch(error => {
    //     this.setState({ error });
    //   });

    //event.preventDefault();
  };
  isNotUnique = () => {
    for ( var i =0;  i<this.state.properties.length; i++){
        if(this.state.properties[i].propertyName===this.state.propertyName){
            return true;
  
        }
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event
  };
  render() {
    
 
   
    return (
    
    <div >
        {this.state.fire_loaded === true && this.state.fire_loaded2 === true ?
        
        


      <div style ={{marginTop: "50px"}} className="d-flex justify-content-center ">
          <div className="card w-25" >
            <div className="text-center">
                <h3><i className="far fa-edit"></i>Create Text Property</h3>
                
            </div>
           
                <div className="md-form">
                <div className="text-center">
                <input
                    name="propertyName"
                    value={this.state.propertyName}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Enter Property Name"
                />
                 </div>
                </div>
                
                
                <div className="text-center">
                <button className="btn peach-gradient" onClick = { () => this.addProperty(this.state.propertyName)}>Create Property</button>
                <button className="btn blue-gradient" onClick = { () => this.props.history.push(ROUTES.VIEW_PROPERTIES)}>View Properties</button>
                </div>     
         
              </div>
         
        </div>
        :
        <div>
            <div style ={{marginTop: "50px"}} class = "d-flex justify-content-center">
                <div class="spinner-border text-success" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        }

        </div>
       
      
    );
  }
}


const CreateTextPropertyForm = withRouter(withFirebase(CreateTextPropertyFormBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(CreateTextPropertyPage);

export { CreateTextPropertyForm };
