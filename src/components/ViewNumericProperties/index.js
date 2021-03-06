import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';
const ViewNumericPropertiesPage = () => ( // for the use of routing
  <div>
    
    <ViewNumericPropertiesDisplay />
  </div>
);



class ViewNumericPropertiesDisplayBase extends Component {
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
    firebase.database().ref('properties/').orderByChild('propertyType').equalTo("Numeric").once('value', (snapshot) => {
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
      
      //this.forceUpdate();
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
    return (
      <div>
      {this.state.fire_loaded1 || this.userType === 'admin' || this.userType === 'ldo' ?  // only if the firebase data are loaded or admins and laboratory data operators can view this page
      <div style ={{marginTop: "50px"}} >
        <div className ="d-flex justify-content-center">
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
                
            </RowDefinition>
            </Griddle>
        </div>
      </div>  
      :
      <div style ={{marginTop: "50px"}} className = "d-flex justify-content-center">
          <div className ="spinner-border text-success" role="status">
            <span className ="sr-only">Loading...</span>
          </div>
        </div>
      }
      </div>
      
      
    );
  }
}



const ViewNumericPropertiesDisplay = withRouter(withFirebase(ViewNumericPropertiesDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewNumericPropertiesPage);

export { ViewNumericPropertiesDisplay };
