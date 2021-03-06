import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase';
import {  withRouter } from 'react-router-dom';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';





const UpdateOptionPropertyPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
       
        

        <UpdateOptionPropertyPageForm/>
      </div>
    )}
  </AuthUserContext.Consumer>

);
class UpdateOptionPropertyPageFormBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
    this.state = ({ 
      propertyKey:'',
      propertyName: '',
      options:[],
      properties: [],
      propertyDisplay:[],
      timeStamp: String(timeStamp),
      loading: true,
      fire_loaded: false,
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
      this.propertyDisplay=[];
      var x=0;
      snapshot.forEach((child)=>{
        if(child.val().propertyType==="Option"){
          let optionString = '';
          child.val().options.forEach((option=>{
            optionString = optionString + option.optionValue + ', ';
          }))
            this.properties.push({
                id:x,
                propertyKey: child.key,
                propertyName: child.val().propertyName,
  
                
                
              })
              this.propertyDisplay.push({
                id:x,
                propertyKey: child.key,
                propertyName: child.val().propertyName,
                optionsString: optionString.slice(0,-2),

                
              })
              
              x=x+1;     
        }
        
        
      }) 
      

      this.setState({properties:this.properties});
      this.setState({propertyDisplay:this.propertyDisplay});
      this.setState({fire_loaded1:true});
    });
    this.setState({ loading: false });
    
  }
  selectProperty = (key) => {
    this.setState({selected:true});
    this.setState({propertyKey:this.state.properties[key].propertyKey});
    this.setState({propertyName: this.state.properties[key].propertyName});
    
   

  }
  updateProperty = (propertyKey,propertyName) => {

    //proprty validation
    if(propertyName === '' ){
        alert("Property name field cannot be empty!");
        return;
    }
    
    
    propertyName=propertyName.charAt(0).toUpperCase()+propertyName.slice(1);
    let updates = {};
    firebase.database().ref('/forms').orderByChild("optionProperties").once('value').then(snap => {
      let formKeys = [];

 
      snap.forEach((child)=>{

          if("optionProperties" in child.val()){
           
            child.val().optionProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().optionProperties.findIndex(x => x.propertyKey === propertyKey) ;
                formKeys.push({formKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      formKeys.forEach(key => {
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/propertyName'] = propertyName;
        
      });
      this.updateDatabase(updates);
    
    })
    firebase.database().ref('/testResults').orderByKey().once('value').then(snap => {
      let testKeys = [];

 
      snap.forEach((child)=>{
        
          if("optionProperties" in child.val()){
           
            child.val().optionProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().optionProperties.findIndex(x => x.propertyKey === propertyKey) ;
                testKeys.push({testKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      testKeys.forEach(key => {
        updates['testResults/'+key.testKey+'/optionProperties/'+key.index+'/propertyName'] = propertyName;
        
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
    firebase.database().ref('/forms').orderByChild("optionProperties").once('value').then(snap => {
      let formKeys = [];

 
      snap.forEach((child)=>{
        
          if("optionProperties" in child.val()){
           
            child.val().optionProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().optionProperties.findIndex(x => x.propertyKey === propertyKey) ;
                formKeys.push({formKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      
      formKeys.forEach(key => {
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/propertyName'] = null;
        
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/id'] = null;
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/optionsList'] = null;
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/propertyType'] = null;
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/propertyKey'] = null;
      });
      this.updateDatabase(updates);
    
    })
    updates['/properties/' + propertyKey + '/propertyName'] = null;
    updates['/properties/' + propertyKey + '/options'] = null;
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
            data={this.state.propertyDisplay} 
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
            <ColumnDefinition id="optionsString" title="Options" customHeadingComponent={CustomHeading}/>
            
            
            
        </RowDefinition>
        </Griddle>
    </div>
</div>
<div>{this.state.selected?
    <div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
      
         
        
    <div className="card  " style={{width: "50em"}}>
      <div className="text-center">
            <h3><i className="far fa-edit"></i> Update Option Property</h3>
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
      

      
      <div style ={{marginTop: "25px"}} className="text-center">                    
        <button className="btn aqua-gradient" onClick = { () => this.updateProperty(this.state.propertyKey,this.state.propertyName)} >Update Property</button>
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
<div className = "d-flex justify-content-center">Waiting for selection...</div>}
</div>
      
     
      </div>
      :
      <div style ={{marginTop: "50px"}} className = "d-flex justify-content-center">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
      </div>
    );
     
  }
}
const UpdateOptionPropertyPageForm = withRouter(withFirebase(UpdateOptionPropertyPageFormBase)); // give access to the props of the router and firebse
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(UpdateOptionPropertyPage);
export {UpdateOptionPropertyPageForm}