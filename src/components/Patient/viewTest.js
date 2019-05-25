import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

import { withFirebase } from '../Firebase';

import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';

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
      
     })
 
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
    
    <div id="test">
    {/* {this.userType === 'admin' ? */}
        <div class="text-center" style ={{marginTop: "50px"}} >
            <h4><i class="far fa-file-alt"></i> {this.state.test.formName}</h4>
        </div>

        <div style ={{marginTop: "25px"}} >
            <div class="d-flex justify-content-center" >
                <div class="card w-25">
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
                            Date : {this.state.test.timeStamp} 
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
            <div class="d-flex justify-content-center">
              <Griddle 
                    
                    data={this.state.test.result} 
                    plugins={[plugins.LocalPlugin]}
                    styleConfig={styleConfig}
                    
                >
                    <RowDefinition>
                    <ColumnDefinition id="propertyName" title="Test Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="propertyValue" title="Result" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="referenceRange" title="Reference Range" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="unitOfMeasurement" title="Unit Of Measurement" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    
                    
                    
                    
                </RowDefinition>
                </Griddle>
            </div>
                
            </div>
            <div class="text-center">
              <button class="btn purple-gradient" onClick = { () => this.downloadPdf()} >Create Test Result</button>
            </div>
        {console.log(this.state.test)}
    </div>
       
      
    );
  }
}


const ViewTestForm = withRouter(withFirebase(ViewTestFormBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewTestPage);

export { ViewTestForm };
