import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';

const PatientListPage = () => ( // for the use of routing
  <div>
    
    <PatientListDisplay />
  </div>
);



class PatientListDisplayBase extends Component {
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
      this.setState({fire_loaded1: true});
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    firebase.database().ref('users/').orderByChild('firstName').on('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
        if(child.val().userType==="patient"){
        this.fetchedDatas.push({
                  id: x,
                  firstName: child.val().firstName,
                  lastName: child.val().lastName,
                  email: child.val().email,
                  userType: child.val().userType,
                  userKey: child.key
                });
                x=x+1;  
        }
      }) 
      this.setState({users:this.fetchedDatas});
      this.setState({fire_loaded2:true});
      //this.forceUpdate();
    });
    this.setState({ loading: false });

  }
  selectUser(key){
      let user = this.state.users[key];
      this.props.history.push({
        pathname: '/view-test-list',
        state: { user: user }
      })
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
      <div style ={{marginTop: "50px"}} >
        {this.state.fire_loaded1 && this.state.fire_loaded2 ? // only if the firebase data are loaded and admins or laboratory data operators can view this page
        <div>
        <div className="text-center">
             <h5><i className="fas fa-hand-pointer"></i> Click on a patient to update test result</h5>

        </div>
        <div style={{cursor: "pointer" ,marginTop: "25px"}} className="d-flex justify-content-center">
            <Griddle 
              
                data={this.state.users} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
                components={{
                  RowEnhancer: OriginalComponent =>
                    props => (
                      <OriginalComponent
                        {...props}
                        onClick={() => this.selectUser(props.griddleKey)}
                        />
                    ),
                }}
            >
                <RowDefinition>
                <ColumnDefinition id="email" title="Email" customHeadingComponent={CustomHeading} />
                <ColumnDefinition id="firstName" title="First Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                <ColumnDefinition id="lastName" title="Last Name" customHeadingComponent={CustomHeading}/>
                
                
                
            </RowDefinition>
            </Griddle>
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



const PatientListDisplay = withRouter(withFirebase(PatientListDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(PatientListPage);

export { PatientListDisplay };
