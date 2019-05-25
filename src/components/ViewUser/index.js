import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';

const ViewUsersPage = () => ( // for the use of routing
  <div>
    
    <ViewUsersDisplay />
  </div>
);



class ViewUsersDisplayBase extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true,fire_loaded1: false, fire_loaded2: false,  users:  [] };
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
      this.forceUpdate();
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    firebase.database().ref('users/').orderByChild('firstName').on('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
        this.fetchedDatas.push({
                  id: x,
                  firstName: child.val().firstName,
                  lastName: child.val().lastName,
                  email: child.val().email,
                  userType: child.val().userType,
                  _key: child.key
                });
                x=x+1;  
      }) 
      this.setState({users:this.fetchedDatas});
      this.setState({fire_loaded1:true});
      //this.forceUpdate();
    });
    this.setState({ loading: false });

  }
  deleteProperty = (key) => {
    firebase.database().ref('users/').child(this.state.users[key]._key).remove().then(
        function() {
          // fulfillment
          alert("User data has been removed successfully");
      },
      function() {
        // fulfillment
        alert("User data has not been removed successfully");
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
    // const onDataDeletion= () => {
    //  //this.fetchedDatas = [];
    //   this.fetchedDataRef.child(fetchedData._key).remove().then(
    //     function() {
    //       // fulfillment
    //       alert("The first aid data '"+fetchedData.fetchedDataName+"' has been removed successfully");
    //   },
    //   function() {
    //     // fulfillment
    //     alert("The first aid data '"+fetchedData.fetchedDataName+"' has not been removed successfully");
    // });
    // }
    const DeletePropertyButton = ({griddleKey}) => (
      <div>
        <button type="button" class="btn btn-danger btn-rounded" onClick = { () => this.deleteProperty(griddleKey)}>Remove</button>
      </div>);
    const CustomColumn = ({value}) => <span style={{ color: '#0000AA' }}>{value}</span>;
    const CustomHeading = ({title}) => <span style={{ color: '#AA0000' }}>{title}</span>;
   
    return (
      <div style ={{marginTop: "50px"}} >
        {this.state.fire_loaded1 || this.userType === 'admin' || this.userType === 'ldo' ? // only if the firebase data are loaded or admins and laboratory data operators can view this page
        <div class="d-flex justify-content-center">
            <Griddle 
              
                data={this.fetchedDatas} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
                components={{
                  RowEnhancer: OriginalComponent =>
                    props => (
                      <OriginalComponent
                        {...props}
                        onClick={() => console.log(`Click Row ${props.griddleKey}`)}
                        />
                    ),
                }}
            >
                <RowDefinition>
                <ColumnDefinition id="firstName" title="First Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                <ColumnDefinition id="lastName" title="Last Name" customHeadingComponent={CustomHeading}/>
                <ColumnDefinition id="email" title="Email" customHeadingComponent={CustomHeading} />
                <ColumnDefinition id="userType" title="User Type" customHeadingComponent={CustomHeading} />
                <ColumnDefinition id="" customComponent={DeletePropertyButton} />
            </RowDefinition>
            </Griddle>
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



const ViewUsersDisplay = withRouter(withFirebase(ViewUsersDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewUsersPage);

export { ViewUsersDisplay };
