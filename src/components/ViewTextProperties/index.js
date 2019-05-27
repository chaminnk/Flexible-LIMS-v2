import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';
const ViewTextPropertiesPage = () => ( // for the use of routing
  <div>
    
    <ViewTextPropertiesDisplay />
  </div>
);



class ViewTextPropertiesDisplayBase extends Component {
  constructor(props) {
    super(props);
  
    this.state = { loading: true,fire_loaded1: false,fire_loaded2:false, properties:  [] };
  }

  
  fetchedDatas= [];
  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.forceUpdate();
        this.setState({fire_loaded1: true});
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    firebase.database().ref('properties/').orderByChild('propertyType').equalTo("Text").once('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
        this.fetchedDatas.push({
                  id: x,
                  Property_Name: child.val().propertyName,
                  
                  propertyType: child.val().propertyType,
                  _key: child.key
                });
                x=x+1;  
      }) 
      this.setState({properties:this.fetchedDatas});
      this.setState({fire_loaded2:true});
    
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
      {this.state.fire_loaded1 && this.state.fire_loaded2   ?  // only if the firebase data are loaded or admins and laboratory data operators can view this page
      <div style ={{marginTop: "50px"}} >
        <div className ="d-flex justify-content-center">
            <Griddle 
                data={this.state.properties} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
            >
                <RowDefinition>
                <ColumnDefinition id="Property_Name" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                
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



const ViewTextPropertiesDisplay = withRouter(withFirebase(ViewTextPropertiesDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewTextPropertiesPage);

export { ViewTextPropertiesDisplay };
