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
  
                options: child.val().options,
                
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
      this.setState({fire_loaded1:true});

      this.setState({properties:this.properties});
      this.setState({propertyDisplay:this.propertyDisplay});
    });
    this.setState({ loading: false });
    
  }
  selectProperty = (key) => {
    this.setState({selected:true});
    this.setState({propertyKey:this.state.properties[key].propertyKey});
    this.setState({propertyName: this.state.properties[key].propertyName});
    this.setState({options: this.state.properties[key].options});
   

  }
  updateProperty = (propertyKey,propertyName, options) => {
    let updates = {};
    //proprty validation
    if(propertyName === '' ){
        alert("Property name field cannot be empty!");
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

    firebase.database().ref('/forms').orderByChild("optionProperties").once('value').then(snap => {
      let formKeys = [];
  
      snap.forEach((child)=>{
        
          if("optionProperties" in child.val()){
           
            child.val().optionProperties.forEach((c)=>{
              if(c.propertyKey===propertyKey){
                let index = child.val().numericProperties.findIndex(x => x.propertyKey === propertyKey) ;
                formKeys.push({formKey:child.key, index: index});
                
              }
            })
            
             
          }
        
      })

      
      let updates = {};
      formKeys.forEach(key => {
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/propertyName'] = propertyName;
        updates['forms/'+key.formKey+'/optionProperties/'+key.index+'/options'] = options;
        
      });
      updates['/properties/' + propertyKey + '/propertyName'] = propertyName;
      updates['/properties/' + propertyKey + '/options'] = options;
      
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
     
    
    })
    
    

    
    

    
    
    
    
    
  }
    
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

    console.log(this.state.options);
    return (
      

      <div>
      {this.state.fire_loaded && this.state.fire_loaded1 ?
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
            <ColumnDefinition id="optionsString" title="Options" customHeadingComponent={CustomHeading}/>
            
            
            
        </RowDefinition>
        </Griddle>
    </div>
</div>
<div>{this.state.selected?
    <div style ={{marginTop: "25px"}} class="d-flex justify-content-center ">
      
         
        
    <div class="card w-25">
      <div class="text-center">
            <h3><i class="fas fa-user-plus"></i> Update Numeric Property</h3>
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
                                class="btn btn-outline-danger waves-effect"
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
        <button class="btn aqua-gradient" onClick = { () => this.updateProperty(this.state.propertyKey,this.state.propertyName, this.state.options)} >Update Property</button>
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
const UpdateOptionPropertyPageForm = withRouter(withFirebase(UpdateOptionPropertyPageFormBase)); // give access to the props of the router and firebse
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(UpdateOptionPropertyPage);
export {UpdateOptionPropertyPageForm}