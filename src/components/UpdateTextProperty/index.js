import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase';
import {  withRouter } from 'react-router-dom';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';





const UpdateTextPropertyPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
       
        

        <UpdateTextPropertyPageForm/>
      </div>
    )}
  </AuthUserContext.Consumer>

);
class UpdateTextPropertyPageFormBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
    this.state = ({ 
      propertyKey:'',
      propertyName: '',
      properties: [],
      properties2:[],
      timeStamp: String(timeStamp),
      loading: true,
      fire_loaded:false,
      fire_loaded1: false,
      selected: false
    })

  }


  
  
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
    firebase.database().ref('properties/').orderByChild('propertyType').on('value', (snapshot) => {
      this.properties = [];
      this.properties2= [];
      var x=0;
      snapshot.forEach((child)=>{
        if(child.val().propertyType==="Text"){
            this.properties.push({
                id:x,
                propertyKey: child.key,
                propertyName: child.val().propertyName
                
              })
              x=x+1;     
        }
        this.properties2.push({
            propertyName:child.val().propertyName,
        })
        
      }) 
      this.setState({fire_loaded1:true});

      this.setState({properties:this.properties});
      this.setState({properties2:this.properties2});
    });
    this.setState({ loading: false });
    
  }
  selectProperty = (key) => {
    this.setState({selected:true});
    this.setState({propertyKey:this.state.properties[key].propertyKey});
    this.setState({propertyName: this.state.properties[key].propertyName});
  }
  updateProperty = (propertyKey,propertyName) => {
    // let updates = {};
    //proprty validation
    if(propertyName === '' ){
        alert("Property name field cannot be empty!");
        return;
    }
    propertyName=propertyName.charAt(0).toUpperCase()+propertyName.slice(1);

    
    let updates = {};
    firebase.database().ref('/forms').orderByChild("textProperties").once('value').then(snap => {
      let formKeys = [];

 
      snap.forEach((child)=>{
        
          if("textProperties" in child.val()){
           
            child.val().textProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().textProperties.findIndex(x => x.propertyKey === propertyKey) ;
                formKeys.push({formKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      formKeys.forEach(key => {
        updates['forms/'+key.formKey+'/textProperties/'+key.index+'/propertyName'] = propertyName;
        
      });
      this.updateDatabase(updates);
    
    })
    firebase.database().ref('/testResults').orderByKey().once('value').then(snap => {
      let testKeys = [];

 
      snap.forEach((child)=>{
        
          if("textProperties" in child.val()){
           
            child.val().textProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().textProperties.findIndex(x => x.propertyKey === propertyKey) ;
                testKeys.push({testKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      testKeys.forEach(key => {
        updates['testResults/'+key.testKey+'/textProperties/'+key.index+'/propertyName'] = propertyName;
        
      });
      this.updateDatabase(updates);
     
    
    })
      updates['/properties/' + propertyKey + '/propertyName'] = propertyName;
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
  deleteProperty = (propertyKey) => {
    let updates = {};
    firebase.database().ref('/forms').orderByChild("textProperties").once('value').then(snap => {
      let formKeys = [];

 
      snap.forEach((child)=>{
        
          if("textProperties" in child.val()){
           
            child.val().textProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().textProperties.findIndex(x => x.propertyKey === propertyKey) ;
                formKeys.push({formKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      formKeys.forEach(key => {
        updates['forms/'+key.formKey+'/textProperties/'+key.index+'/propertyName'] = null;
        
        updates['forms/'+key.formKey+'/textProperties/'+key.index+'/id'] = null;
        updates['forms/'+key.formKey+'/textProperties/'+key.index+'/propertyType'] = null;
        updates['forms/'+key.formKey+'/textProperties/'+key.index+'/propertyKey'] = null;
      });
      this.updateDatabase(updates);
    
    })
    updates['/properties/' + propertyKey + '/propertyName'] = null;
    
    updates['/properties/' + propertyKey + '/createdBy'] = null;
    updates['/properties/' + propertyKey + '/createdDate'] = null;
    updates['/properties/' + propertyKey + '/propertyType'] = null;
    firebase.database().ref().update(updates,function(error){
      if(error){
        alert(error.message);
      }
      else{
        alert("Property details successfully deleted.");
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
      {this.state.fire_loaded && this.state.fire_loaded1 ?
      <div>

<div style ={{marginTop: "25px"}} >
    <div style ={{marginTop: "25px"}} className="d-flex justify-content-center">
            <h5><i className="fas fa-hand-pointer"></i> Click on a Property to update</h5>
    
    </div>
    <div className="d-flex justify-content-center">
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
            
            
            
        </RowDefinition>
        </Griddle>
    </div>
</div>
<div>{this.state.selected?
    <div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
      
         
        
    <div className="card w-25">
      <div className="text-center">
            <h3><i className="far fa-edit"></i> Update Text Property</h3>
            <hr className="mt-2 mb-2"></hr>
      </div>
      <div className="md-form">
          <div className="text-center">
        <input
          name="propertyName"
          onChange={this.onChange}
          type="text"
          placeholder="Enter Property Name"
          value={this.state.propertyName}

        />
        </div>
      </div>
      
      

      
      <div className="text-center">                    
        <button className="btn aqua-gradient" onClick = { () => this.updateProperty(this.state.propertyKey,this.state.propertyName, this.state.unitOfMeasurement, this.state.lowValue,this.state.highValue)} >Update Property</button>
        </div>
        <div>
          {this.userType==='admin'?
          <div style ={{marginTop: "50px"}} className="text-center">                    
          <button type="button" className="btn btn-danger btn-rounded" onClick = { () => this.deleteProperty(this.state.propertyKey)}>Remove Property</button>
            </div>
            :
            <div></div>
            }
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
const UpdateTextPropertyPageForm = withRouter(withFirebase(UpdateTextPropertyPageFormBase)); // give access to the props of the router and firebse
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(UpdateTextPropertyPage);
export {UpdateTextPropertyPageForm}