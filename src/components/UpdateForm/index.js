import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';

const UpdateFormPage = () => ( // for the use of routing
  <div>
    
    <UpdateFormDisplay />
  </div>
);



class UpdateFormDisplayBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
    this.state = { timeStamp: String(timeStamp), loading: true,fire_loaded1: false,selected:false, fire_loaded2: false,  forms:  [], formName:'', formKey: '' , specimen:'',testType: '', numericProperties:[],optionProperties:[],textProperties:[]};
      //this.handleChange = this.handleChange.bind(this);
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
  userId1 = firebase.auth().currentUser.uid;

  fetchedDatas= [];
  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
      this.userType = snapshot.val().userType;
      this.setState({fire_loaded1: true});
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    firebase.database().ref('forms/').orderByChild('formName').on('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
        
        this.fetchedDatas.push({
                  id: x,
                  formName: child.val().formName,
                  specimen: child.val().specimen,
                  testType: child.val().testType,
                  numericProperties: child.val().numericProperties,
                  optionProperties: child.val().optionProperties,
                  textProperties: child.val().textProperties,
                  createdBy: child.val().createdBy,
                  createdDate: child.val().createdDate,
                  formKey: child.key
                });
                x=x+1;  
        
      }) 
      this.setState({forms:this.fetchedDatas});
      this.setState({fire_loaded2:true});
      //this.forceUpdate();
    });
    this.setState({ loading: false });

  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event
  };
  deleteProperty = (key) => {
    firebase.database().ref('forms/').child(key).remove().then(
        function() {
          // fulfillment
          alert("Form data has been removed successfully");
          this.setState({forms:[]});
          this.setState({selected: false});
      },
      function() {
        // fulfillment
        alert("Form data has not been removed successfully");
    });
  }
  selectProperty = (key) => {
    this.setState({selected:true});
    this.setState({formKey:this.state.forms[key].formKey});
    this.setState({formName: this.state.forms[key].formName});
    this.setState({specimen: this.state.forms[key].specimen});
    this.setState({testType: this.state.forms[key].testType});
    this.setState({numericProperties: this.state.forms[key].numericProperties});
    this.setState({optionProperties: this.state.forms[key].optionProperties});
    this.setState({textProperties: this.state.forms[key].textProperties});
   

  }  
  updateProperty = (formKey,formName,specimen,testType,numericProperties,optionProperties,textProperties) => {

    //proprty validation
    if(formName === '' ){
        alert("Form name field cannot be empty!");
        return;
    }
    
    
    formName=formName.charAt(0).toUpperCase()+formName.slice(1);
    let updates = {};
    
    firebase.database().ref('/testResults').orderByKey().once('value').then(snap => {
      let testKeys = [];

 
      snap.forEach((child)=>{
        
          if(child.val().testFormKey===formKey){
            testKeys.push({testKey:child.key});
            
           
          }
        
      })

      
      
      testKeys.forEach(key => {
        updates['testResults/'+key.testKey+'/formName'] = formName;
        updates['testResults/'+key.testKey+'/specimen'] = specimen;
        updates['testResults/'+key.testKey+'/testType'] = testType;
        
      });
      this.updateDatabase(updates);
     
    
    })
    updates['/forms/' + formKey + '/formName'] = formName;
    updates['/forms/'+formKey+'/specimen'] = specimen;  
    updates['/forms/'+formKey+'/testType'] = testType;
    if(numericProperties !== undefined){
      updates['/forms/'+formKey+'/numericProperties'] = numericProperties; 
    } 
    if(optionProperties!==undefined){
      updates['/forms/'+formKey+'/optionProperties'] = optionProperties;
    }
    if(textProperties!==undefined){
      updates['/forms/'+formKey+'/textProperties'] = textProperties; 
    }
    
    
    updates['/forms/' + formKey + '/createdBy'] = firebase.auth().currentUser.email;
    updates['/forms/' + formKey + '/createdDate'] =  this.state.timeStamp;



      firebase.database().ref().update(updates,function(error){
        if(error){
          alert(error.message);
        }
        else{
          alert("Form details successfully updated.");
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
    <div style ={{marginTop: "25px"}} className="d-flex justify-content-center">
            <h5><i className="fas fa-hand-pointer"></i> Click on a Form to update </h5>
            
    
    </div>
    
    <div className="d-flex justify-content-center">
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
                      onClick={() => this.selectProperty(props.griddleKey)}
                      />
                  ),
              }}
          >
              <RowDefinition>
              <ColumnDefinition id="formName" title="First Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
              <ColumnDefinition id="createdBy" title="Last Name" customHeadingComponent={CustomHeading}/>
              <ColumnDefinition id="createdDate" title="Email" customHeadingComponent={CustomHeading} />
              
          </RowDefinition>
          </Griddle>
    </div>
</div>
<div>{this.state.selected?
    <div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
      
         
        
    <div className="card  " style={{width: "50em"}}>
      <div className="text-center">
            <h3><i className="far fa-edit"></i> Update Form</h3>
            <h4>Press 'Update' after accidental removals to recover data</h4>
            <hr className="mt-2 mb-2"></hr>
      </div>
      <div className="md-form">
          <div className="text-center">
        <input
          name="formName"
          onChange={this.onChange}
          type="text"
          placeholder="Enter Form Name"
          value={this.state.formName}

        />
        </div>
      </div>
      <div className="md-form">
          <div className="text-center">
        <input 
          name="specimen"
          onChange={this.onChange}
          type="text"
          placeholder="Enter specimen Name"
          value={this.state.specimen}

        />
        </div>
      </div>
      <div className="md-form">
          <div className="text-center">
        <input 
          name="testType"
          onChange={this.onChange}
          type="text"
          placeholder="Enter test type"
          value={this.state.testType}

        />
        </div>
      </div>

      
      <div style ={{marginTop: "50px"}} className="text-center">                    
        <button className="btn aqua-gradient" onClick = { () => this.updateProperty(this.state.formKey,this.state.formName,this.state.specimen,this.state.testType,this.state.numericProperties,this.state.optionProperties,this.state.textProperties)} >Update Form</button>
        </div>
        <div style ={{marginTop: "50px"}} className="text-center">                    
      <button type="button" className="btn btn-danger btn-rounded" onClick = { () => this.deleteProperty(this.state.formKey)}>Remove Form</button>
        </div>
       
      </div>



</div>
:
<div className= "d-flex justify-content-center">Waiting for selection...</div>}
</div>
      
     
      </div>
      :
      <div style ={{marginTop: "50px"}} className= "d-flex justify-content-center">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
      </div>

      
      
    );
  }
}



const UpdateFormDisplay = withRouter(withFirebase(UpdateFormDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(UpdateFormPage);

export { UpdateFormDisplay };
