import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';
const ViewFormsPage = () => ( // for the use of routing
  <div>
    
    <ViewFormsDisplay />
  </div>
);



class ViewFormsDisplayBase extends Component {
  constructor(props) {
    super(props);
  
    this.state = { loading: true,fire_loaded1: false,formName:'', forms:  [], properties : [] };
  }

  
  fetchedDatas= [];
  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.forceUpdate();
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
                  fields: child.val().fields,
                  _key: child.key
                });
                x=x+1;  
      }) 
      this.setState({forms:this.fetchedDatas});
      this.setState({fire_loaded1:true});
      this.forceUpdate();
    });
    
  }
  
  deleteform = (key) => {
    firebase.database().ref('forms/').child(this.state.forms[key]._key).remove().then(
        function() {
          // fulfillment
          alert("Form data has been removed successfully");
          this.setState({properties:[]})
      },
      function() {
        // fulfillment
        alert("Form data has not been removed successfully");
    });
  }
  selectForm = (key) => {
    this.setState({formName: this.state.forms[key].formName})
    this.properties = [];
    this.state.forms[key].fields.forEach((obj)=>{
        firebase.database().ref('properties/').orderByKey().equalTo(obj.propertyKey).on('value', (snapshot) => {
            var y=0;
            snapshot.forEach((child)=>{
              this.properties.push({
                        id: y,
                        Property_Name: child.val().propertyName,
                        Unit_of_Measurement: child.val().unitOfMeasurement,
                        Reference_Range: child.val().referenceRange,
                        _key: child.key
                      });
                      y=y+1;  
            }) 
            
            this.setState({fire_loaded1:true});
            this.forceUpdate();
          });
        
    })
    this.setState({properties: this.properties});
    console.log(this.properties);
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
 
    const DeleteformButton = ({griddleKey}) => (
        <div>
          <button type="button" class="btn btn-danger btn-rounded" onClick = { () => this.deleteform(griddleKey)}>Remove</button>
        </div>);
    const CustomColumn = ({value}) => <span style={{ color: '#0000AA' }}>{value}</span>;
    const CustomHeading = ({title}) => <span style={{ color: '#AA0000' }}>{title}</span>;
    return (
      <div>
      {this.state.fire_loaded1 || this.userType === 'admin' || this.userType === 'ldo' ?  // only if the firebase data are loaded or admins and laboratory data operators can view this page
      <div style ={{marginTop: "50px"}} >
        
        
            <div class="text-center">
                    <h5><i class="fas fa-hand-pointer"></i> Click a Form to view Properties</h5>
                 
            </div>
         
          <div style ={{marginTop: "50px"}} class="d-flex justify-content-center">
      
            <Griddle 
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

                 <ColumnDefinition id="" customComponent={DeleteformButton} />
            </RowDefinition>
            </Griddle>
            </div>
                    
        
      </div>  
      :
      <div class = "d-flex justify-content-center">
          <div class="spinner-grow text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      }
      {this.state.fire_loaded1 || this.userType === 'admin' || this.userType === 'ldo' ?  // only if the firebase data are loaded or admins and laboratory data operators can view this page
      <div style ={{marginTop: "50px"}} >
         <div class="d-flex justify-content-center ">
         <div class="md-form">
                  <div class="text-center">
                  <h3>Form Name : {this.state.formName}</h3>
                
                </div>
              </div>
         </div>
        <div class="d-flex justify-content-center">
            <Griddle 
                data={this.state.properties} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
                
            >
                <RowDefinition>
                    <ColumnDefinition id="Property_Name" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="Unit_of_Measurement" title="Unit of Measurement" customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="Reference_Range" title="Reference Range" customHeadingComponent={CustomHeading} />
                </RowDefinition>
            </Griddle>
            
         
        </div>
      </div>  
      :
      <div><p>Loading information. If this is taking too long please check your internet connection</p></div>
      }
      </div>
      
      
    );
  }
}



const ViewFormsDisplay = withRouter(withFirebase(ViewFormsDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewFormsPage);

export { ViewFormsDisplay };
