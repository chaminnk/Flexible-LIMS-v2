import React, { Component } from 'react';
import Select from 'react-select';

import {  withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';


const CreateResultPage = () => ( // for the use of routing
  <div>
    
    <CreateResultDisplay />
  </div>
);



class CreateResultDisplayBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
  
    this.state = { firstName:'', lastName: '', email: '', age:'',gender: '', timeStamp: String(timeStamp), referredBy: '', formName:'', testFormKey: '',propertyName: '', unitOfMeasurement: '', referenceRange:'', propertyValue: '', selectedOption: '', loading: true,fire_loaded:false,fire_loaded1: false, fire_loaded2: false, fire_loaded3:false,fire_loaded4:false, users:[], forms:  [], properties: [], properties2: [], optionProperties: [], optionProperties2:[], textProperties: [], textProperties2:[], cards:[],cards2: [], cards3: []};
     
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
  userId1 = firebase.auth().currentUser.uid;

  fetchedDatas= [];
  fetchedDatas2= [];
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
    firebase.database().ref('users/').orderByChild('firstName').on('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
        if(child.val().userType==="patient"){
          this.fetchedDatas.push({
            id: x,
            firstName: child.val().firstName,
            lastName: child.val().lastName,
            email: child.val().email,
            gender: child.val().gender,
            dob: child.val().dob,
            userKey: child.key
          });
          x=x+1;
        }
          
      }) 
      this.setState({users:this.fetchedDatas});
      this.setState({fire_loaded1:true});
      //this.forceUpdate();
    });
    firebase.database().ref('forms/').orderByChild('formName').on('value', (snapshot) => {
      this.fetchedDatas2 = [];
      
      var y=0;
    
      snapshot.forEach((child)=>{
        this.fetchedDatas2.push({
          formId: y,
          testFormKey: child.key,
          formName: child.val().formName,
          specimen: child.val().specimen,
          testType: child.val().testType,
          numericProperties : child.val().numericProperties,
          optionProperties :child.val().optionProperties,
          textProperties :child.val().textProperties
      
        });
        y=y+1;
        
      }) 
      
      this.setState({forms:this.fetchedDatas2});
      this.setState({fire_loaded2:true});
  
    });
    this.setState({ loading: false });

  }
  selectUser = (key) => {
    this.setState({firstName: this.state.users[key].firstName});
    this.setState({lastName: this.state.users[key].lastName});
    this.setState({email: this.state.users[key].email});
    this.setState({userKey: this.state.users[key].userKey});
    this.setState({gender: this.state.users[key].gender});
    var today = new Date();
    var birthDate = new Date(this.state.users[key].dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    this.setState({age: age});

  

  }
  selectForm = (key) => {
    this.setState({formName: this.state.forms[key].formName})
    this.setState({specimen: this.state.forms[key].specimen})
    this.setState({testType: this.state.forms[key].testType})
    this.setState({testFormKey: this.state.forms[key].testFormKey})
    this.properties = [];
    this.properties2 = [];
    this.optionProperties = [];
    this.optionProperties2= [];
    this.textProperties = [];
    this.textProperties2 =[];
    //this.setState({propert ies:this.properties});
    //this.setState({properties2:this.properties2});

    if(this.state.forms[key].numericProperties !== undefined){
          this.state.forms[key].numericProperties.forEach((obj)=>{
          
          
            var z=0;
              
                
                this.properties.push({
                  id: z,
                  propertyName: obj.propertyName,
                  unitOfMeasurement: obj.unitOfMeasurement,
                  lowValue: obj.lowValue,
                  highValue: obj.highValue,
                  propertyKey: obj.propertyKey
                });
                this.properties2.push({
                  propertyKey: obj.propertyKey,
                  propertyName: obj.propertyName,
                  unitOfMeasurement: obj.unitOfMeasurement,
                  lowValue:obj.lowValue,
                  highValue: obj.highValue,
                  propertyValue: ''
                });
                
                z=z+1;  
                
          
              
              this.setState({fire_loaded3:true});
              // this.forceUpdate();
          
        
      })
      this.setState({properties: this.properties});
      this.setState({properties2: this.properties2});
      
      var cards = [];
      for (var i = 0; i < this.state.properties.length; i++) {
        
        cards.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
        <div className="card w-50">
        <div className="md-form">
                        <div className="text-center">
                      {this.state.properties[i].propertyName} : <input
                        name={this.state.properties[i].propertyKey}
                
                        type="text"
                        placeholder="Enter Value"
                        value={this.state.v}
                        onChange={this.onChange2}

                      /> {this.state.properties[i].unitOfMeasurement}, Low Value : {this.state.properties[i].lowValue}, High Value : {this.state.properties[i].highValue}
                      </div>
                    </div></div>
        </div>);
      }

    }
    if(this.state.forms[key].optionProperties !== undefined){
          this.state.forms[key].optionProperties.forEach((obj)=>{
              
              
            var z=0;
              
                
                this.optionProperties.push({
                  id: z,
                  propertyName: obj.propertyName,
                  optionsList: obj.optionsList,

                  propertyKey: obj.propertyKey
                });
                this.optionProperties2.push({
                  propertyKey: obj.propertyKey,
                  propertyName: obj.propertyName,
                  optionsList: obj.optionsList,
                  selectedOption: '',
                  
                  
                });
                
                z=z+1;  
                
          
              
              //this.setState({fire_loaded3:true});
              // this.forceUpdate();
          
        
      })
      this.setState({optionProperties: this.optionProperties});
      this.setState({optionProperties2: this.optionProperties2});
      
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
                        placeholder={this.state.optionProperties[j].optionsList[0]}
                        onChange={this.onChange3}
                      />
                      </div>
                      </div>
                    </div></div>
        </div>);
      }
    }
   
    if(this.state.forms[key].textProperties !== undefined){
      this.state.forms[key].textProperties.forEach((obj)=>{
      
      
        var z=0;
          
            
            this.textProperties.push({
              id: z,
              propertyName: obj.propertyName,
              
              propertyKey: obj.propertyKey
            });
            this.textProperties2.push({
              propertyKey: obj.propertyKey,
              propertyName: obj.propertyName,
              
              propertyValue: ''
            });
           
            z=z+1;  
              
      
          
          this.setState({fire_loaded4:true});
          // this.forceUpdate();
      
    
      })
      this.setState({textProperties: this.textProperties});
      this.setState({textProperties2: this.textProperties2});
     
      var cards3 = [];
      for (var k = 0; k < this.state.textProperties.length; k++) {
        
        cards3.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
        <div className="card w-50">
        <div className="md-form">
                        <div className="text-center">
                      {this.state.textProperties[k].propertyName} : <input
                        name={this.state.textProperties[k].propertyKey}
                
                        type="text"
                        placeholder="Enter Value"
                        value={this.state.v}
                        onChange={this.onChange4}

                      /> 
                      </div>
                    </div></div>
        </div>);
      }

    }
    this.setState({cards:cards});
    this.setState({cards2:cards2});
    this.setState({cards3:cards3});
  }
  onChange = event  => {
    this.setState({ [event.target.name]: event.target.value});
    
   
  };
  
  onChange2 = event => {
    this.state.properties2.forEach((obj) => {
      if(obj.propertyKey===event.target.name){
        obj.propertyValue=event.target.value ;
      }
    })
   // this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event

  };
  onChange3 = (selectedOption,selectedProperty) => {
    
    this.state.optionProperties2.forEach((obj) => {
      if(obj.propertyKey===selectedProperty.name){
        obj.selectedOption=selectedOption.value ;
        
      }
    })

  }
  onChange4 = event => {
    this.state.textProperties2.forEach((obj) => {
      if(obj.propertyKey===event.target.name){
        obj.propertyValue=event.target.value ;
      }
    })
   // this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event

  };
  createTest = () => {

  
    var resultsRef = firebase.database().ref("testResults");

    resultsRef.push({
      userKey:this.state.userKey,
      firstName:this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      gender: this.state.gender,
      age: this.state.age,
      createdDate: this.state.timeStamp,
      testFormKey: this.state.testFormKey,
      formName: this.state.formName,
      specimen: this.state.specimen,
      testType: this.state.testType,
      numericProperties : this.state.properties2,
      optionProperties: this.state.optionProperties2,
      textProperties :this.state.textProperties2,
      referredBy: this.state.referredBy,
      createdBy : firebase.auth().currentUser.email
    });
    alert("Test Result created succesfully")
    
  };
    

  render() {
    const styleConfig = {
        icons: {
          TableHeadingCell: {
            sortDescendingIcon: '▼',
            sortAscendingIcon: '▲',
          },
        },
        classNames: {
          Row: 'row-class',
          Table: 'table-striped, table',
        },
        styles: {
          Filter: { fontSize: 18 },
          
        },
      };

    
    const CustomColumn = ({value}) => <span style={{ color: '#0000AA' }}>{value}</span>;
    const CustomHeading = ({title}) => <span style={{ color: '#AA0000' }}>{title}</span>;
    const pageProperties={

      pageSize: 3,
    }
    

    return (

      /* ~~~~~~~~~~~~~~~~PATIENT SELECTION~~~~~~~~~~~~~~~~~~~~~~ */  

      
        

    <div>
    {this.state.fire_loaded && this.state.fire_loaded1 && this.state.fire_loaded2 ?
      <div style ={{marginTop: "25px"}} >
        
        
            <div className="text-center">
              <h3><i className="far fa-edit"></i> Create Test Result</h3>        
            </div>
            <div style ={{marginTop: "25px"}} className="text-center">
                    <h5><i className="fas fa-hand-pointer"></i> Click on a Patient to select a Patient</h5>
          
            </div>
         
          
   
            
            <div style={{cursor: "pointer"}} className="d-flex justify-content-center">
                <Griddle 
                    pageProperties={pageProperties}
                    data={this.state.users} 
                    plugins={[plugins.LocalPlugin]}
                    styleConfig={styleConfig}
                    components={{
                    RowEnhancer: OriginalComponent =>
                        props => (
                        <OriginalComponent
                            {...props}
                            onClick={() => this.selectUser(props.griddleKey)}
                            />
                        ),
                    }}
                >
                    <RowDefinition>
                    <ColumnDefinition id="firstName" title="First Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="lastName" title="Last Name" customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="email" title="Email" customHeadingComponent={CustomHeading} />
                    
                    
                </RowDefinition>
                </Griddle>
            </div>
        

        <div style ={{marginTop: "25px"}} >
          <div className="d-flex justify-content-center ">
        
          
          
            <div className="card w-50">
              <div className="text-center">
              
                    <h5><i className="fas fa-user-plus"></i>  Patient Details</h5>
                    <hr className="mt-2 mb-2"></hr>
              </div>
              <div className="md-form">
                  <div className="text-center">
                First Name : <input
                  name="firstName"
          
                  type="text"
                  placeholder="Select Patient to auto-fill"
                  value={this.state.firstName}

                />
                </div>
              </div>
              <div className="md-form">
                  <div className="text-center">
                  Last Name : <input
                  name="lastName"
                  value={this.state.lastName}
    

                  type="text"
                  placeholder="Select Patient to auto-fill"
                />
                </div>
              </div>
            <div className="md-form">
                  <div className="text-center">
                  Email : <input
                  name="email"
                  value={this.state.email}


                  type="email"
                  placeholder="Select Patient to auto-fill"
                />
              </div>
            </div>
            <div className="md-form">
                  <div className="text-center">
                  Gender : <input
                  name="gender"
                  value={this.state.gender}
          

                  type="text"
                  placeholder="Select Patient to auto-fill"
                />
              </div>
            </div>
            <div className="md-form">
                  <div className="text-center">
                  Age: <input
                  name="age"
                  value={this.state.age}
                
    

                  type="text"
                  placeholder="Select Patient to auto-fill"
                />
                </div>
              </div>
              <div className="md-form">
                  <div className="text-center">
                  Time stamp: <input
                  name="timeStamp"
                  value={this.state.timeStamp}
                    
                    

                  type="text"
                  placeholder="Date"
                />
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
          <div className="d-flex justify-content-center">
            <div className="text-center">
                    <h5><i className="fas fa-hand-pointer"></i> Double click on a Form to select Test Form</h5>
                    <hr className="mt-2 mb-2"></hr>
            </div>
          </div>
          
          </div>
            
          { /* ~~~~~~~~~~~~~~~~FORM SELECTION~~~~~~~~~~~~~~~~~~~~~~ */  }


            <div style ={{marginTop: "25px"}}>
            <div style={{cursor: "pointer"}} className="d-flex justify-content-center">
              <Griddle
                    pageProperties={pageProperties}
                    data={this.state.forms} 
                    plugins={[plugins.LocalPlugin]}
                    styleConfig={styleConfig}
                    components={{
                    RowEnhancer: OriginalComponent =>
                        props => (
                        <OriginalComponent
                            {...props}
                            onClick={() => this.selectForm(props.griddleKey)}
                            />
                        ),
                    }}
                >
                    <RowDefinition>
                    <ColumnDefinition id="formName" title="Form Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    
                    
                    
                    
                </RowDefinition>
                </Griddle>
            </div>
                
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
                Specimen : <input
                  name="specimen"
          
                  type="text"
                  placeholder="Select Form to auto-fill"
                  value={this.state.specimen}

                />
                </div>
              </div>
              <div className="md-form">
                  <div className="text-center">
                  Test Type : <input
                  name="testType"
                  value={this.state.testType}
    

                  type="text"
                  placeholder="Select Form to auto-fill"
                />
                </div>
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
              <button className="btn purple-gradient" onClick = { () => this.createTest()} >Create Test Result</button>
            </div>
        </div>

      </div>  
      :
      <div>
        <div style ={{marginTop: "50px"}} className= "d-flex justify-content-center">
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



const CreateResultDisplay = withRouter(withFirebase(CreateResultDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(CreateResultPage);

export { CreateResultDisplay };
