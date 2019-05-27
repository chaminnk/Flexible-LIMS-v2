import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import * as ROUTES from '../../constants/routes';

const TestListPage = () => ( // for the use of routing
  <div>
    
    <TestListDisplay />
  </div>
);



class TestListDisplayBase extends Component {
  constructor(props) {
    super(props);
    const timeStamp = new Date();
    this.state = { user:this.props.location.state.user, loading: true,fire_loaded1: false, fire_loaded2: false, timeStamp: String(timeStamp), tests:  [] };
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
    firebase.database().ref('testResults/').orderByChild('userKey').equalTo(this.state.user.userKey).on('value', (snapshot) => {
      this.fetchedDatas = [];
      var x=0;
      snapshot.forEach((child)=>{
            this.fetchedDatas.push({
                
                
                id: x,
                testResultKey: child.key,
                age: child.val().age,
                createdBy: child.val().createdBy,
                createdDate: child.val().createdDate,
                email: child.val().email,
                firstName: child.val().firstName,
                formName: child.val().formName,
                gender: child.val().gender,
                lastName: child.val().lastName,
                numericProperties: child.val().numericProperties,
                optionProperties: child.val().optionProperties,
                referredBy: child.val().referredBy,
                specimen: child.val().specimen,
                testFormKey: child.val().testFormKey,
                testType: child.val().testType,
                textProperties: child.val().textProperties,
                
                userKey: child.val().userKey 
              });
                x=x+1;  
        
      }) 
      this.setState({tests:this.fetchedDatas});
      this.setState({fire_loaded2:true});
      //this.forceUpdate();
    });
    this.setState({ loading: false });

  }
  selectTest(key){
      let test = this.state.tests[key];
      this.props.history.push({
        pathname: '/update-test-result',
        state: { test: test }
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
        <div class="text-center">
             <h5><i class="fas fa-hand-pointer"></i> Click on a test to update test result</h5>

        </div>
        <div style={{cursor: "pointer" ,marginTop: "25px"}} className="d-flex justify-content-center">
            <Griddle 
              
                data={this.state.tests} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
                components={{
                  RowEnhancer: OriginalComponent =>
                    props => (
                      <OriginalComponent
                        {...props}
                        onClick={() => this.selectTest(props.griddleKey)}
                        />
                    ),
                }}
            >
                <RowDefinition>
                <ColumnDefinition id="formName" title="Form Name" customHeadingComponent={CustomHeading} />
                <ColumnDefinition id="createdBy" title="Created User" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                <ColumnDefinition id="createdDate" title="Created Date" customHeadingComponent={CustomHeading}/>
                
                
                
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



const TestListDisplay = withRouter(withFirebase(TestListDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(TestListPage);

export { TestListDisplay };
