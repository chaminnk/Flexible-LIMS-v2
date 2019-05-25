import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';
const ViewPropertiesPage = () => ( // for the use of routing
  <div>
    
    <ViewPropertiesDisplay />
  </div>
);



class ViewPropertiesDisplayBase extends Component {
  constructor(props) {
    super(props);
  
    this.state = { loading: true,fire_loaded1: false, properties:  [] };
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
    firebase.database().ref('properties/').orderByChild('propertyName').once('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
        this.fetchedDatas.push({
                  id: x,
                  Property_Name: child.val().propertyName,
                  Unit_of_Measurement: child.val().unitOfMeasurement,
                  lowValue: child.val().lowValue,
                  highValue: child.val().highValue,
                  propertyType: child.val().propertyType,
                  _key: child.key
                });
                x=x+1;  
      }) 
      this.setState({properties:this.fetchedDatas});
      this.setState({fire_loaded1:true});
      console.log(this.fetchedDatas);
      //this.forceUpdate();
    });

  }
  
  deleteProperty = (key) => {
    this.state.properties[key].remove().then(
        function() {
          // fulfillment
          alert("The Property data has been removed successfully");
      },
      function() {
        // fulfillment
        alert("The Property data has not been removed successfully");
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
 
    const DeletePropertyButton = ({griddleKey}) => (
        <div>
          <button type="button" class="btn btn-danger btn-rounded" onClick = { () => this.deleteProperty(griddleKey)}>Remove</button>
        </div>);
    const CustomColumn = ({value}) => <span style={{ color: '#0000AA' }}>{value}</span>;
    const CustomHeading = ({title}) => <span style={{ color: '#AA0000' }}>{title}</span>;
    return (
      <div>
      {this.state.fire_loaded1 || this.userType === 'admin' || this.userType === 'ldo' ?  // only if the firebase data are loaded or admins and laboratory data operators can view this page
      <div style ={{marginTop: "50px"}} >
        <div class="d-flex justify-content-center">
            <Griddle 
                data={this.state.properties} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
            >
                <RowDefinition>
                <ColumnDefinition id="Property_Name" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                <ColumnDefinition id="Unit_of_Measurement" title="Unit of Measurement" customHeadingComponent={CustomHeading}/>
                <ColumnDefinition id="lowValue" title="Low Value" customHeadingComponent={CustomHeading} />
                <ColumnDefinition id="highValue" title="High Value" customHeadingComponent={CustomHeading} />
                <ColumnDefinition id="propertyType"  title="Property Type" customHeadingComponent={CustomHeading} />
                 <ColumnDefinition id="" customComponent={DeletePropertyButton} />
            </RowDefinition>
            </Griddle>
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



const ViewPropertiesDisplay = withRouter(withFirebase(ViewPropertiesDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewPropertiesPage);

export { ViewPropertiesDisplay };
