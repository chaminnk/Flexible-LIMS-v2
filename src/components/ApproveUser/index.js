import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';

const ApproveUsersPage = () => ( // for the use of routing
  <div>
    
    <ApproveUsersDisplay />
  </div>
);



class ApproveUsersDisplayBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userKey:'', 
        firstName: '',
        lastName: '',
        email: '',
        contactNum: '',
        dob:'',
        gender: '',
        userType: '',
        loading: true,
        fire_loaded1: false,
        fire_loaded2: false,
        users:  [],
        

    };
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
    if (this.userType !== 'admin'  ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    firebase.database().ref('users/').orderByChild('userType').equalTo("unapproved").on('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
        this.fetchedDatas.push({
                  id: x,
                  email: child.val().email,
                  firstName: child.val().firstName,
                  lastName: child.val().lastName,
                  contactNum: child.val().contactNum,
                  dob: child.val().dob,
                  gender: child.val().gender,
                  userType: child.val().userType,
                  userKey: child.key
                });
                x=x+1;  
      }) 
      this.setState({users:this.fetchedDatas});
      this.setState({fire_loaded1:true});
      //this.forceUpdate();
    });
    this.setState({ loading: false });

  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event
  };
  selectUser = (key) => {
   

    

    this.setState({firstName: this.state.users[key].firstName});
    this.setState({lastName: this.state.users[key].lastName});
    this.setState({email: this.state.users[key].email});
    this.setState({contactNum: this.state.users[key].contactNum});
    this.setState({dob: this.state.users[key].dob});
    this.setState({gender: this.state.users[key].gender});
    this.setState({userType: this.state.users[key].userType});
    this.setState({userKey: this.state.users[key].userKey});

    
    
  }
  updateUser = (userKey,email,  firstName,lastName,contactNum,dob, gender, userType) => {
    var updates = {};
    updates['/users/' + userKey + '/userType'] = userType;
    firebase.database().ref().update(updates).then(function(){
      alert("User type successfully updated to "+toString(userType));
    }).catch(function(error){
      alert(error.message);
    });
        // firebase.database().ref("users/" + userKey).set({
        //     userKey: userKey,
        //     firstName: firstName,
        //     lastName:lastName,
        //     email: email,
        //     contactNum: contactNum,
        //     dob:dob,
        //     gender: gender,
        //     userType: userType,
        //   });
          
          
    
    this.setState({signupLoading: false});
    
   
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
    const pageProperties={

      pageSize: 3,
    }  
    return (
      <div style ={{marginTop: "50px"}} >
        {this.state.fire_loaded1 || this.userType === 'admin'  ? // only if the firebase data are loaded or admins can view this page
        <div>
            <div class="d-flex justify-content-center">
                <Griddle 
                    pageProperties={pageProperties}
                    data={this.fetchedDatas} 
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
                    <ColumnDefinition id="firstName" title="First Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="lastName" title="Last Name" customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="email" title="Email" customHeadingComponent={CustomHeading} />
                    <ColumnDefinition id="userType" title="User Type" customHeadingComponent={CustomHeading} />
                    
                </RowDefinition>
                </Griddle>
                
            </div>
            <div  style ={{marginTop: "25px"}} class="d-flex justify-content-center ">
            <div class="card w-50">
                            <div class="md-form">
                            <div class="text-center">
                            Selected User : <input
                            name="email"
                    
                            type="text"
                            placeholder="Select User to auto-fill"
                            value={this.state.email}
                            /> 
                            </div>
                        </div>
                        <div class="md-form">
                            <div class="text-center">
                            Select User Type : <select name="userType" value={this.state.value} onChange={this.onChange}>
                                                    <option value="admin">Administrator</option>
                                                    <option value="ldo">Data Operator</option>
                                                    <option value="patient">Patient</option>
                                            </select>
                            </div>
                        </div>
            </div>
            </div>
            <div class="text-center">
                <button class="btn aqua-gradient" onClick = { () => this.updateUser(this.state.userKey,this.state.email,  this.state.firstName, this.state.lastName,this.state.contactNum,this.state.dob, this.state.gender, this.state.userType)} >Update User</button>
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



const ApproveUsersDisplay = withRouter(withFirebase(ApproveUsersDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ApproveUsersPage);

export { ApproveUsersDisplay };
