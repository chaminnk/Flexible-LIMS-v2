import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase';
import {  withRouter } from 'react-router-dom';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';





const UpdateNumericPropertyPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
       
        

        <UpdateNumericPropertyPageForm/>
      </div>
    )}
  </AuthUserContext.Consumer>

);
class UpdateNumericPropertyPageFormBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
    this.state = ({ 
      propertyKey:'',
      propertyName: '',
      unitOfMeasurement: '',
      lowValue: '',
      highValue:'',
      properties: [],
      properties2:[],
      timeStamp: String(timeStamp),
      loading: true,
      fire_loaded1: false,
      fire_loaded2: false,
      selected: false
    })

  }


  userId1 = firebase.auth().currentUser.uid;
  
  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
      this.userType = snapshot.val().userType;
      this.setState({fire_loaded1: true});
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    firebase.database().ref('properties/').orderByChild('propertyType').on('value', (snapshot) => {
      this.properties = [];
      this.properties2= [];
      var x=0;
      snapshot.forEach((child)=>{
        if(child.val().propertyType==="Numeric"){
            this.properties.push({
                id:x,
                propertyKey: child.key,
                propertyName: child.val().propertyName,
                lowValue: child.val().lowValue,
                highValue: child.val().highValue,
                unitOfMeasurement: child.val().unitOfMeasurement
              })
              x=x+1;     
        }
        this.properties2.push({
            propertyName:child.val().propertyName,
        })
        
      }) 
      this.setState({fire_loaded2:true});

      this.setState({properties:this.properties});
      this.setState({properties2:this.properties2});
    });
    this.setState({ loading: false });
    
  }
  selectProperty = (key) => {
    this.setState({selected:true});
    this.setState({propertyKey:this.state.properties[key].propertyKey});
    this.setState({propertyName: this.state.properties[key].propertyName});
    this.setState({unitOfMeasurement: this.state.properties[key].unitOfMeasurement});
    this.setState({lowValue: this.state.properties[key].lowValue});
    this.setState({highValue: this.state.properties[key].highValue});

  }
  updateProperty = (propertyKey,propertyName, unitOfMeasurement, lowValue, highValue) => {
    // let updates = {};
    //proprty validation
    if(propertyName === '' ){
        alert("Property name field cannot be empty!");
        return;
    }
    else if(unitOfMeasurement === '' ){
        alert("Unit of measurement field cannot be empty!");
        return;
    }
    else if(lowValue === '' ){
        alert("Low value of reference range  field cannot be empty!");
        return;
    }
    else if(highValue === '' ){
        alert("High value of reference range field cannot be empty!");
        return;
    }
    else if (!(/[0-9.]+/.test(lowValue))) { 
        alert("Please enter a numerical low value");
        return;
    }
    else if (!(/[0-9.]+/.test(highValue))) { 
        alert("Please enter a numerical high value");
        return;
    }
    propertyName=propertyName.charAt(0).toUpperCase()+propertyName.slice(1);
    let updates = {};
    firebase.database().ref('/forms').orderByChild("numericProperties").once('value').then(snap => {
      let formKeys = [];

 
      snap.forEach((child)=>{
        console.log(child.val());
          if("numericProperties" in child.val()){
           
            child.val().numericProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().numericProperties.findIndex(x => x.propertyKey === propertyKey) ;
                formKeys.push({formKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      formKeys.forEach(key => {
        updates['forms/'+key.formKey+'/numericProperties/'+key.index+'/propertyName'] = propertyName;
        updates['forms/'+key.formKey+'/numericProperties/'+key.index+'/unitOfMeasurement'] = unitOfMeasurement;
        updates['forms/'+key.formKey+'/numericProperties/'+key.index+'/lowValue'] = lowValue;
        updates['forms/'+key.formKey+'/numericProperties/'+key.index+'/highValue'] = highValue;
      });
      this.updateDatabase(updates);
    
    })
    firebase.database().ref('/testResults').orderByKey().once('value').then(snap => {
      let testKeys = [];

 
      snap.forEach((child)=>{
        
          if("numericProperties" in child.val()){
           
            child.val().numericProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().numericProperties.findIndex(x => x.propertyKey === propertyKey) ;
                testKeys.push({testKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      testKeys.forEach(key => {
        updates['testResults/'+key.testKey+'/numericProperties/'+key.index+'/propertyName'] = propertyName;
        updates['testResults/'+key.testKey+'/numericProperties/'+key.index+'/unitOfMeasurement'] = unitOfMeasurement;
        updates['testResults/'+key.testKey+'/numericProperties/'+key.index+'/lowValue'] = lowValue;
        updates['testResults/'+key.testKey+'/numericProperties/'+key.index+'/highValue'] = highValue;
      });
      this.updateDatabase(updates);
     
    
    })
    updates['/properties/' + propertyKey + '/propertyName'] = propertyName;
      updates['/properties/' + propertyKey + '/unitOfMeasurement'] = unitOfMeasurement;
      updates['/properties/' + propertyKey + '/lowValue'] = lowValue;
      updates['/properties/' + propertyKey + '/highValue'] = highValue;
      updates['/properties/' + propertyKey + '/createdBy'] = firebase.auth().currentUser.email;
      updates['/properties/' + propertyKey + '/createdDate'] =  this.state.timeStamp;



      firebase.database().ref().update(updates,function(error){
        if(error){
          alert(error.message);
        }
        else{
          alert("Property details successfully updated.");
        }
      });

    
   
    
    
    
  }
    
  updateDatabase = (updates) =>{
    firebase.database().ref().update(updates,function(error){
      if(error){
        alert(error.message);
      }
      else{
        return true
      }
    });
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event
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
      

      <div>
      {this.state.fire_loaded1 && this.state.fire_loaded2 ?
      <div>

<div style ={{marginTop: "25px"}} >
    <div style ={{marginTop: "25px"}} class="d-flex justify-content-center">
            <h5><i class="fas fa-hand-pointer"></i> Click on a Property to update</h5>
    
    </div>
    <div class="d-flex justify-content-center">
        <Griddle 
            pageProperties={pageProperties}
            data={this.state.properties} 
            plugins={[plugins.LocalPlugin]}
            styleConfig={styleConfig}
            components={{
            RowEnhancer: OriginalComponent =>
                props => (
                <OriginalComponent
                    {...props}
                    onClick={() => this.selectProperty(props.griddleKey)}
                    />
                ),
            }}
        >
            <RowDefinition> 
            <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
            <ColumnDefinition id="unitOfMeasurement" title="Unit of Measurement" customHeadingComponent={CustomHeading}/>
            <ColumnDefinition id="lowValue" title="Low Value" customHeadingComponent={CustomHeading} />
            <ColumnDefinition id="highValue" title="High Value" customHeadingComponent={CustomHeading} />
            
            
        </RowDefinition>
        </Griddle>
    </div>
</div>
<div>{this.state.selected?
    <div style ={{marginTop: "25px"}} class="d-flex justify-content-center ">
      
         
        
    <div class="card w-25">
      <div class="text-center">
            <h3><i class="far fa-edit"></i> Update Numeric Property</h3>
            <hr class="mt-2 mb-2"></hr>
      </div>
      <div class="md-form">
          <div class="text-center">
        <input
          name="propertyName"
          onChange={this.onChange}
          type="text"
          placeholder="Enter Property Name"
          value={this.state.propertyName}

        />
        </div>
      </div>
      <div class="md-form">
          <div class="text-center">
        <input
          name="unitOfMeasurement"
          value={this.state.unitOfMeasurement}
          onChange={this.onChange}

          //onChange={(lastName) => this.setState({lastName})}
          type="text"
          placeholder="Enter Unit of Measurement"
        />
        </div>
      </div>
      <div class="md-form">
          <div class="text-center">
         <input
          name="lowValue"
          value={this.state.lowValue}
          onChange={this.onChange}

          type="text"
          placeholder="Enter low value of reference range"
        />
      </div>
      </div>
      <div class="md-form">
          <div class="text-center">
          <input
          
              name="highValue"
              value={this.state.highValue}
              onChange={this.onChange}
              type="text"
              placeholder="Enter high value of reference range"
          />
          </div>
          </div>
      

      
      <div class="text-center">                    
        <button class="btn aqua-gradient" onClick = { () => this.updateProperty(this.state.propertyKey,this.state.propertyName, this.state.unitOfMeasurement, this.state.lowValue,this.state.highValue)} >Update Property</button>
        </div>
       
      </div>


</div>
:
<div class = "d-flex justify-content-center">Waiting for selection...</div>}
</div>
      
     
      </div>
      :
      <div style ={{marginTop: "50px"}} class = "d-flex justify-content-center">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      }
      </div>
    );
     
  }
}
const UpdateNumericPropertyPageForm = withRouter(withFirebase(UpdateNumericPropertyPageFormBase)); // give access to the props of the router and firebse
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(UpdateNumericPropertyPage);
export {UpdateNumericPropertyPageForm}