import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';


import { withAuthorization } from '../Session';

const ViewTestPage = () => ( // for the use of routing
  <div>
    
    <ViewTestForm />
  </div>
);



class ViewTestFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = ({ 
      test:this.props.location.state.test,
      viewTestLoading: false,
      fire_loaded:false,
      cards:[],
      cards2: [], 
      cards3: []
     })
 
  }
  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.setState({fire_loaded:true});
        
    });
    if (this.userType !== 'patient'  ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    
    if(this.state.test.numericProperties!== undefined){
        
        var cards = [];
        for (var i = 0; i < this.state.test.numericProperties.length; i++) {
            
          cards.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
          <div className="card w-50">
          <div className="md-form">
                          <div className="text-center">
                          
                        {this.state.test.numericProperties[i].propertyName} : {this.state.test.numericProperties[i].propertyValue} {this.state.test.numericProperties[i].unitOfMeasurement}, Low Value : {this.state.test.numericProperties[i].lowValue}, High Value : {this.state.test.numericProperties[i].highValue}
                        </div>
                      </div></div>
          </div>);
        }
    
        this.setState({cards:cards})
    }
    if(this.state.test.optionProperties!== undefined){
      var cards2 = [];
      for (var j = 0; j < this.state.test.optionProperties.length; j++) {
        
        cards2.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
        <div className="card w-50">
        <div className="md-form">
                        <div className="text-center">
                      {this.state.test.optionProperties[j].propertyName} : {this.state.test.optionProperties[j].selectedOption} 
                      
                      </div>
                    </div></div>
        </div>);
      }
      this.setState({cards2:cards2})
    }
    if(this.state.test.textProperties !== undefined){
        var cards3 = [];
        for (var k = 0; k < this.state.test.textProperties.length; k++) {
          
          cards3.push(<div style ={{marginTop: "25px"}} class="d-flex justify-content-center ">
          <div class="card w-50">
          <div class="md-form">
                          <div class="text-center">
                        {this.state.test.textProperties[k].propertyName} : {this.state.test.textProperties[k].propertyValue}
                        </div>
                      </div></div>
          </div>);
        } 
        this.setState({cards3:cards3})
    }
    
    this.setState({loading:false});

  }
//   downloadPdf = () => {

//     html2canvas(document.querySelector("#test")).then(canvas => {
//        ///document.body.appendChild(canvas);  // if you want see your screenshot in body.
//        const imgData = canvas.toDataURL('image/png');
//        const pdf = new jsPDF({
//         orientation: 'landscape'
       
//       });
//        pdf.addImage(imgData, 'PNG',210,297);
//        pdf.save("download.pdf"); 
//    });

// }
  
 



  render() {
    

    return (
    
    <div id="test">
    {/* {this.userType === 'admin' ? */}
        <div class="text-center" style ={{marginTop: "50px"}} >
            <h4><i class="far fa-file-alt"></i> {this.state.test.formName}</h4>
        </div>

        <div style ={{marginTop: "25px"}} >
            <div class="d-flex justify-content-center" >
                <div class="card w-50" style={{width: "50em"}}>
                    <div class="md-form">
                        <div class="text-center">
                            Patient name : {this.state.test.firstName} {this.state.test.lastName}
                        </div>
                    </div>
                    <div class="md-form">
                        <div class="text-center">
                            Email : {this.state.test.email} 
                        </div>
                    </div>
                    <div class="md-form">
                        <div class="text-center">
                            Age : {this.state.test.age} 
                        </div>
                    </div>
                    <div class="md-form">
                        <div class="text-center">
                            Gender : {this.state.test.gender} 
                        </div>
                    </div>
                    <div class="md-form">
                        <div class="text-center">
                            Date : {this.state.test.createdDate} 
                        </div>
                    </div>
                    <div class="md-form">
                        <div class="text-center">
                            Referred by : {this.state.test.referredBy} 
                        </div>
                    </div>
                </div>

    
            </div>
 


        </div>
        <div style ={{marginTop: "25px"}}>
            {this.state.cards}
            {this.state.cards2} 
            {this.state.cards3}
        </div>
            
    </div>
       
      
    );
  }
}


const ViewTestForm = withRouter(withFirebase(ViewTestFormBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewTestPage);

export { ViewTestForm };
