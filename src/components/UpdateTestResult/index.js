import React, { Component } from 'react';
import Select from 'react-select';

import {  withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';



const UpdateTestPage = () => ( // for the use of routing
  <div>
    
    <UpdateTestDisplay />
  </div>
);



class UpdateTestDisplayBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
  
    this.state = { 
         test:this.props.location.state.test,
         timeStamp: String(timeStamp), 
         referredBy: this.props.location.state.test.referredBy, 
         formName:this.props.location.state.test.formName,
         specimen: this.props.location.state.test.specimen,
         testType: this.props.location.state.test.testType,
         testResultKey: this.props.location.state.test.testResultKey, 
         age: this.props.location.state.test.age,
         email : this.props.location.state.test.email,  
         firstName: this.props.location.state.test.firstName,
         gender: this.props.location.state.test.gender,
         lastName:this.props.location.state.test.lastName,
         testFormKey: this.props.location.state.test.testFormKey,
         userKey:this.props.location.state.test.userKey,
         loading: true,
         fire_loaded: false,
         fire_loaded1: false, 
         fire_loaded2: false, 
         fire_loaded3:false,
         fire_loaded4:false, 
         numericProperties: this.props.location.state.test.numericProperties,
         optionProperties: this.props.location.state.test.optionProperties,
         textProperties: this.props.location.state.test.textProperties, 
         cards:[],
         cards2: [], 
         cards3: []
        };
     
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
  userId1 = firebase.auth().currentUser.uid;



  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.setState({fire_loaded:true});
        
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    
    if(this.state.numericProperties!== undefined){
        
        var cards = [];
        for (var i = 0; i < this.state.numericProperties.length; i++) {
            
          cards.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
          <div className="card w-50">
          <div className="md-form">
                          <div className="text-center">
                          
                        {this.state.numericProperties[i].propertyName} : <input
                          name={this.state.numericProperties[i].propertyKey}
                  
                          type="text"
                          placeholder={this.state.numericProperties[i].propertyValue}
                          value={this.state.v}
                          onChange={this.onChange2}
  
                        /> {this.state.numericProperties[i].unitOfMeasurement}, Low Value : {this.state.numericProperties[i].lowValue}, High Value : {this.state.numericProperties[i].highValue}
                        </div>
                      </div></div>
          </div>);
        }
    
        this.setState({cards:cards})
    }
    if(this.state.optionProperties!== undefined){
      var cards2 = [];
      for (var j = 0; j < this.state.optionProperties.length; j++) {
        
        cards2.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
        <div className="card w-50">
        <div className="md-form">
                        <div className="text-center">
                      {this.state.optionProperties[j].propertyName} : 
                      <div className="text-center">
                      <Select
                        name = {this.state.optionProperties[j].propertyKey}
                        
                        options={this.state.optionProperties[j].optionsList.map(t=>({value: t, label: t}))}
                        placeholder={this.state.optionProperties[j].selectedOption}
                        onChange={this.onChange3}
                      />
                      </div>
                      </div>
                    </div></div>
        </div>);
      }
      this.setState({cards2:cards2})
    }
    if(this.state.textProperties !== undefined){
        var cards3 = [];
        for (var k = 0; k < this.state.textProperties.length; k++) {
          
          cards3.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
          <div className="card w-50">
          <div className="md-form">
                          <div className="text-center">
                        {this.state.textProperties[k].propertyName} : <input
                          name={this.state.textProperties[k].propertyKey}
                  
                          type="text"
                          placeholder={this.state.textProperties[k].propertyValue}
                          value={this.state.v}
                          onChange={this.onChange4}
  
                        /> 
                        </div>
                      </div></div>
          </div>);
        } 
        this.setState({cards3:cards3})
    }
    
    this.setState({loading:false});

  }


  onChange = event  => {
    this.setState({ [event.target.name]: event.target.value});
    
   
  };
  
  onChange2 = event => {
      
    this.state.numericProperties.forEach((obj) => {
        
      if(obj.propertyKey===event.target.name){
        
        obj.propertyValue=event.target.value ;
      }
    })
    
   // this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event

  };
  onChange3 = (selectedOption,selectedProperty) => {
    
    this.state.optionProperties.forEach((obj) => {
      if(obj.propertyKey===selectedProperty.name){
        obj.selectedOption=selectedOption.value ;
        
      }
    })
    
  }
  onChange4 = event => {
    this.state.textProperties.forEach((obj) => {
      if(obj.propertyKey===event.target.name){
        obj.propertyValue=event.target.value ;
      }
    })
   
   // this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event

  };
  deleteProperty = (key) => {
    firebase.database().ref('testResults/').child(key).remove().then(
        function() {
          // fulfillment
          
          alert("Test data has been removed successfully");
          
      },
      function() {
        // fulfillment
        alert("Test data has not been removed successfully");
    });
  }
  updateTest = (testResultKey,referredBy,numericProperties,optionProperties,textProperties,age,email,firstName,formName,gender,lastName,specimen,testFormKey,testType,userKey) => {
    let updates = {};
    updates['/testResults/' + testResultKey + '/referredBy'] = referredBy;
    if(numericProperties !== undefined){
      updates['/testResults/' + testResultKey + '/numericProperties'] = numericProperties;
    }
    if(optionProperties!==undefined){
      updates['/testResults/' + testResultKey + '/optionProperties'] = optionProperties;
    }
    if(textProperties!==undefined){
      updates['/testResults/' + testResultKey + '/textProperties'] = textProperties;
    }
    updates['/testResults/' + testResultKey + '/createdBy'] = firebase.auth().currentUser.email;
    updates['/testResults/' + testResultKey + '/createdDate'] =  this.state.timeStamp;
    updates['/testResults/' + testResultKey + '/age'] = age;
    updates['/testResults/' + testResultKey + '/email'] = email;
    updates['/testResults/' + testResultKey + '/firstName'] = firstName;
    updates['/testResults/' + testResultKey + '/formName'] = formName;
    updates['/testResults/' + testResultKey + '/gender'] = gender;
    updates['/testResults/' + testResultKey + '/lastName'] = lastName;
    updates['/testResults/' + testResultKey + '/specimen'] = specimen;
    updates['/testResults/' + testResultKey + '/testFormKey'] = testFormKey;
    updates['/testResults/' + testResultKey + '/testType'] = testType;
    updates['/testResults/' + testResultKey + '/userKey'] = userKey;
    firebase.database().ref().update(updates,function(error){
        if(error){
          alert(error.message);
        }
        else{
          alert("Test result details successfully updated.");
        }
      });
    
  };
    

  render() {
   

    
   
    

    return (

        /* ~~~~~~~~~~~~~~~~PATIENT SELECTION~~~~~~~~~~~~~~~~~~~~~~ */  

        
        

    <div>
    {this.state.fire_loaded && !this.state.loading ?
        <div style ={{marginTop: "25px"}} >
        
        
            <div className="text-center">
                <h3><i className="far fa-edit"></i> Update Test Result</h3>
                <h4>Press 'Update' after accidental removals to recover data</h4>        
            </div>
            
        
            
    
            
            
        

        <div style ={{marginTop: "25px"}} >
            <div className="d-flex justify-content-center ">
        
            
            
            <div className="card w-50">
                <div className="text-center">
                
                    <h5><i className="far fa-edit"></i>  {this.state.formName}</h5>
                    <hr className="mt-2 mb-2"></hr>
                </div>
                <div className="md-form">
                        <div className="text-center">
                            Patient name : {this.state.test.firstName} {this.state.test.lastName}
                        </div>
                    </div>
                    <div className="md-form">
                        <div className="text-center">
                            Email : {this.state.test.email} 
                        </div>
                    </div>
                    <div className="md-form">
                        <div className="text-center">
                            Specimen : {this.state.specimen} 
                        </div>
                    </div>
                    <div className="md-form">
                        <div className="text-center">
                            Test Type : {this.state.testType} 
                        </div>
                    </div>
            
                <div className="md-form">
                    <div className="text-center">
                    Referred by: <input
                    name="referredBy"
                    
                    onChange={this.onChange}
                    value={this.state.referredBy} 

                    type="text"
                    placeholder="Enter Referred by"
                />
                </div>
                </div>
            
            </div>
            </div>        
            
            
           
            
            <div style ={{marginTop: "25px"}}>
                {this.state.cards}
                {this.state.cards2} 
                {this.state.cards3}
            </div>
           
            <div style ={{marginTop: "25px"}} className="text-center">
                <button className="btn purple-gradient" onClick = { () => this.updateTest(this.state.testResultKey,this.state.referredBy,this.state.numericProperties,this.state.optionProperties,this.state.textProperties,this.state.age,this.state.email,this.state.firstName,this.state.formName,this.state.gender,this.state.lastName,this.state.specimen,this.state.testFormKey,this.state.testType,this.state.userKey)} >Update Test Result</button>
            </div>
            <div style ={{marginTop: "25px"} } className="text-center">
              <button type="button" className="btn btn-danger btn-rounded" onClick = { () => this.deleteProperty(this.state.testResultKey)}>Remove</button>
            </div>
        </div>

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
        
    );
  }
}



const UpdateTestDisplay = withRouter(withFirebase(UpdateTestDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(UpdateTestPage);

export { UpdateTestDisplay };
