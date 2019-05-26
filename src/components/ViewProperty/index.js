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
  
    this.state = { loading: true,fire_loaded1: false,   dataTypes:  [{ propertyDataType: "Numeric" },{ propertyDataType: "Option" }, { propertyDataType: "Text" }] };
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
    this.setState({ fire_loaded1: true });
    

  }
  selectDataType(key){
    
    let dataType = this.state.dataTypes[key]
    if(dataType.propertyDataType==='Numeric'){
        this.props.history.push({
            pathname: '/view-numeric-properties',
            
        })
    }
    else if(dataType.propertyDataType==='Option'){
        this.props.history.push({
            pathname: '/view-option-properties',
           
        })
    }
    else if(dataType.propertyDataType==='Text'){
      this.props.history.push({
          pathname: '/view-text-properties',
          
      })
  }
    
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
      {this.state.fire_loaded1  ?  // only if the firebase data are loaded or admins and laboratory data operators can view this page
      <div style ={{marginTop: "50px"}} >
        <div class="d-flex justify-content-center">
          
            <Griddle 
                data={this.state.dataTypes} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
                components={{
                  RowEnhancer: OriginalComponent =>
                      props => (
                      <OriginalComponent
                          {...props}
                          onClick={() => this.selectDataType(props.griddleKey)}
                          />
                      ),
                  }}
            >
              <RowDefinition>
                  <ColumnDefinition id="propertyDataType" title="Property Data Type" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
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
