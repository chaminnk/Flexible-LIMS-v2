import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase';
import { withAuthorization } from '../Session';

const CreateOptonPropertyPage = () => ( // for the use of routing
  <div>
    
    <CreateOptonPropertyForm />
  </div>
);



class CreateOptonPropertyFormBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
    this.state = ({ 
      propertyName: '',
      timeStamp: String(timeStamp), 
      options: [],
      properties:[]
      
     })
      //this.handleChange = this.handleChange.bind(this);
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.setState({fire_loaded:true});
         this.forceUpdate();
    });
    if (this.userType === 'patient' || this.userType === 'unapproved'){
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
  addProperty = (propertyName, options) => {
    
    if(this.state.propertyName === '' ){
        alert("Property name field cannot be empty!");
        return;
    }
    else if(this.isNotUnique()){
        
        alert("The property name you entered already exists!");
       return;
        
    }
    else if(options.length === 0 ){
        alert("You must add an option to create the property!");
        return;
    }
    else if( options.length>0){
        var c=0;
        options.forEach((option)=>{
            if(option.optionValue===''){
                c=c+1;
            }
        })
        if(c!==0){
            alert("Attention! "+c+" options are empty. Remove them to continue");
            return;
        }
    }
  
    propertyName=propertyName.charAt(0).toUpperCase()+propertyName.slice(1);

    this.setState({addPropertyLoading: true});
    var propertiesRef = firebase.database().ref("properties/");
    propertiesRef.push({
        propertyName: propertyName,
        options: options,
        propertyType: "Option",
        createdBy: firebase.auth().currentUser.email,
        createdDate:  this.state.timeStamp      
    }).then(() => {
        alert("Option property successfully added!");
        this.setState({addPropertyLoading: false, propertyName:'',  options:[]}); 
      })
      .catch(error => {
       alert(error.message);
      });
    
  
  };
  handleFormoptionValueChange = idx => e => {
    const newoptionValues = this.state.options.map((option, sidx) => {
      if (idx !== sidx) return option;
      return { ...option, optionValue: e.target.value };
    });

    this.setState({ options: newoptionValues });
  };

  handleAddOption = () => {
    this.setState({
      options: this.state.options.concat([{ optionValue: "" }])
    });
  };
  handleRemoveOption = idx => () => {
    this.setState({
      options: this.state.options.filter((s, sidx) => idx !== sidx)
    });
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
        


      <div style ={{marginTop: "50px"}} class="d-flex justify-content-center ">
          <div class="card" style={{width: "18rem"}}>
            <div class="text-center">
                <h3><i class="far fa-edit"></i>Create Option Property</h3>
                
            </div>
           
                <div class="md-form">
                <div class="text-center">
                <input
                    name="propertyName"
                    value={this.state.propertyName}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Enter Property Name"
                />
                 </div>
                </div>

                <div class="md-form">
                <div class="text-center">
                {this.state.options.map((option,idx)=>{
                    return(
                        <div>
                            <input
                                type="text"
                                placeholder={`Option #${idx + 1} value`}
                                value={option.optionValue}
                                onChange= {this.handleFormoptionValueChange(idx)} 
                            />
                            <button
                                type="button"
                                onClick={this.handleRemoveOption(idx)}
                                class= 'btn btn-outline-danger waves-effect'
                                >
                                Remove
                            </button>
                        </div>
                    )
                })
                }
                
                 </div>
                </div>
                <div class="text-center">
                <button class="btn blue-btn btn-outline-success waves-effect" onClick = { this.handleAddOption}>Add Option</button>
               
                
                </div>   
                
               
                <div style ={{marginTop: "50px"}} class="text-center">
                
                <button class="btn peach-gradient" onClick = { () => this.addProperty(this.state.propertyName, this.state.options)}>Create Property</button>
                
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


const CreateOptonPropertyForm = withRouter(withFirebase(CreateOptonPropertyFormBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(CreateOptonPropertyPage);

export { CreateOptonPropertyForm };
