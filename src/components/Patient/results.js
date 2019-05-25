import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';

import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';


import * as ROUTES from '../../constants/routes';

const ViewResultsPage = () => ( // for the use of routing
  <div>
    
    <ViewResultsDisplay />
  </div>
);



class ViewResultsDisplayBase extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true,fire_loaded1: false, fire_loaded2: false,  tests:  [] };
      //this.handleChange = this.handleChange.bind(this);
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
  

   async componentWillMount() {
     this.userId = firebase.auth().currentUser.uid;

     firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
      this.userType = snapshot.val().userType;

    });
    if (this.userType === 'admin' || this.userType === 'ldo' || this.userType === 'unapproved'){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    
    this.setState({ loading: false });
    this.fetchedDatas = [];
     firebase.database().ref('testResults/').orderByChild('userKey').equalTo(this.userId).once('value', (snapshot) => {
   
        
        
        var x=0;
        snapshot.forEach((child)=>{
          
            this.fetchedDatas.push({
              id: x,
              age: child.val().age,
              email: child.val().email,
              firstName: child.val().firstName,
              formName: child.val().formName,
              gender: child.val().gender,
              lastName: child.val().lastName,
              referredBy: child.val().referredBy,
              result: child.val().result,
              testFormKey: child.val().testFormKey,
              timeStamp: child.val().timeStamp,
              userKey: child.val().userKey 
            });
            x=x+1;
            //this.forceUpdate();
            this.setState({tests:this.fetchedDatas});
             
        
          
          
          this.forceUpdate();
        }) 
       
        
        //console.log(this.state.results);
        
        this.setState({fire_loaded1:true});
        //this.setState({tests: this.fetchedDatas2})
        //console.log(this.state.tests);
       // this.forceUpdate();
        
      
      // this.fetchedDatas.forEach((obj) => {
      //   firebase.database().ref('forms/').orderByKey().equalTo(obj.testFormKey).on('value', (snapshot) => {
      //     snapshot.forEach((child)=>{
                
      //       this.fetchedDatas2.push({
            
      //         formName: child.val().formName,
      //         testFormKey: child.key
      //       });
  
      //     }) 
  
      //   });
       
      // })
      // this.setState({tests:this.fetchedDatas2});
      });
      
      
    

  }
  selectTest(key){
    let test = this.state.tests[key]
    this.props.history.push({
      pathname: '/view-test',
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
    if(this.state.tests.length===0) {
      
      return (
        <div class = "d-flex justify-content-center">
          <div class="spinner-grow text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    else{
      
      return (
     
        <div style ={{marginTop: "50px"}} >
    
          {this.state.fire_loaded1 || this.userType === 'admin' || this.userType === 'ldo' ? // only if the firebase data are loaded or admins and laboratory data operators can view this page
          <div class="d-flex justify-content-center">
          
  
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
                    <ColumnDefinition id="formName" title="Test Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="timeStamp" title="Date and time" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    
                </RowDefinition>
            </Griddle>
          </div>
          :
          <div class = "d-flex justify-content-center">
          <div class="spinner-grow text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
          }
        </div>  
  
        
        
      );
    }
    
    
  }
  
}



const ViewResultsDisplay = withRouter(withFirebase(ViewResultsDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewResultsPage);

export { ViewResultsDisplay };
