import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase';
import { withAuthorization } from '../Session';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';

const CreateFormPage = () => ( // for the use of routing
  <div>
    
    <CreateFormForm />
  </div>
);



class CreateFormFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = ({ 
      addPropertyLoading: false,
      formName: '',
      numericProperties :[],
      optionProperties: [],
      textProperties: [],
      optionDataDisplay: [],
      selectedNumericProperties : [],
      selectedOptionProperties: [],
      selectedTextProperties: [],
      specimen: '',
      testType :'',

    fire_loaded: false,
    fire_loaded2: false
     })
      //this.handleChange = this.handleChange.bind(this);
  }
  // handleChange(event) {
  //   this.setState({firstName: event.target.firstName});
  // }
  numericDatas= [];
  async componentWillMount() {
     //user authorization
     await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.setState({fire_loaded:true});
        
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    firebase.database().ref('properties/').orderByChild('propertyType').on('value', (snapshot) => {
      this.numericDatas = [];
      this.optionDatas = [];
      this.textDatas = [];
      this.optionDataDisplay = [];
      var x=0;
      var y=0;
      var z=0;
      snapshot.forEach((child)=>{
        if(child.val().propertyType==="Numeric"){
          this.numericDatas.push({
            id: x,
            propertyKey: child.key,
            propertyName: child.val().propertyName,
            unitOfMeasurement: child.val().unitOfMeasurement,
            lowValue: child.val().lowValue,
            highValue: child.val().highValue,
            propertyType: child.val().propertyType,
           
          });
          x=x+1;  
        }
        
        else if(child.val().propertyType==="Option"){
         
          let optionString = '';
          let optionsList = [];
          child.val().options.forEach((option=>{
            optionString = optionString + option.optionValue + ', ';
            optionsList.push(option.optionValue);
          }))
          this.optionDatas.push({
            id:y,
            propertyKey: child.key,
            propertyName:  child.val().propertyName,
            optionsList: optionsList,
            propertyType: child.val().propertyType
          })
          this.optionDataDisplay.push({
            id:y,
            propertyKey: child.key,
            propertyName:  child.val().propertyName,
            options:optionString.slice(0,-2),
            
            propertyType: child.val().propertyType
          })
          y=y+1;
          //console.log(this.optionDatas);
        }
        else if(child.val().propertyType==="Text"){
         
          this.textDatas.push({
            id: z,
            propertyKey: child.key,
            propertyName:  child.val().propertyName,
            propertyType: child.val().propertyType,
           
          });
          z=z+1;
          //console.log(this.optionDatas);
        }
          
         
      })
      
      this.setState({numericProperties:this.state.numericProperties.concat(this.numericDatas)}) 
      this.setState({optionProperties:this.state.optionProperties.concat(this.optionDatas)}) 
      this.setState({optionDataDisplay:this.state.optionDataDisplay.concat(this.optionDataDisplay)}) 
      this.setState({textProperties:this.state.textProperties.concat(this.textDatas)}) 
      this.setState({fire_loaded2:true});
      //this.forceUpdate();
      
    });
    
  }



  onChange = event => {
    this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event
  };

  handleCreateForm = (formName,specimen,testType,numericProperties,optionProperties,textProperties) => {
    
    if (formName === ''){
      alert("Form name field cannot be empty!");
      return;
    }
    else if(numericProperties.length===0 && optionProperties.length===0 && textProperties.length===0){
      alert("Please select a field to continue!");
      return;
    }
    formName=formName.charAt(0).toUpperCase()+formName.slice(1);
    var formsRef = firebase.database().ref("forms");
    
    formsRef.push({
        formName:formName,
        specimen:specimen,
        testType:testType,
        numericProperties: numericProperties,
        optionProperties: optionProperties,
        textProperties:textProperties
    }).then(() => {
      alert("Form successfully created!");
    this.setState({
      formName: '',
      specimen:'',
      testType: '',
      selectedNumericProperties: [],
      selectedOptionProperties: [],
      selectedTextProperties: []
    });
    })
    .catch(error => {
     alert(error.message);
    });   
    
  }


  selectNumericProperty = (key) => {

    var checkBox = document.getElementById("numeric"+key);
    if (checkBox.checked === true){
      this.setState({selectedNumericProperties: this.state.selectedNumericProperties.concat(this.state.numericProperties[key])});
      
    } else {
    
      this.setState({selectedNumericProperties: this.state.selectedNumericProperties.filter(p=> p.id !== key)});
      
    }
   
  }
  selectOptionProperty = (key) => {

    var checkBox = document.getElementById("option"+key);
    if (checkBox.checked === true){
      this.setState({selectedOptionProperties: this.state.selectedOptionProperties.concat(this.state.optionProperties[key])});
      
    } else {
    
      this.setState({selectedOptionProperties: this.state.selectedOptionProperties.filter(p=> p.id !== key)});
      
    }
   
  }
  selectTextProperty = (key) => {

    var checkBox = document.getElementById("text"+key);
    if (checkBox.checked === true){
      this.setState({selectedTextProperties: this.state.selectedTextProperties.concat(this.state.textProperties[key])});
      
    } else {
    
      this.setState({selectedTextProperties: this.state.selectedTextProperties.filter(p=> p.id !== key)});
      
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
    const SelectNumericPropertyCheckBox= ({griddleKey}) => (
      <div>
        <input type="checkbox" id={"numeric"+griddleKey} onClick={ () => this.selectNumericProperty(griddleKey)}/>
      </div>);
    const SelectOptionPropertyCheckBox= ({griddleKey}) => (
      <div>
        <input type="checkbox" id={"option"+griddleKey} onClick={ () => this.selectOptionProperty(griddleKey)}/>
      </div>);
    const SelectTextPropertyCheckBox= ({griddleKey}) => (
      <div>
        <input type="checkbox" id={"text"+griddleKey} onClick={ () => this.selectTextProperty(griddleKey)}/>
      </div>);
    const CustomColumn = ({value}) => <span style={{ color: '#0000AA' }}>{value}</span>;
    const CustomHeading = ({title}) => <span style={{ color: '#AA0000' }}>{title}</span>;
    const pageProperties={

      pageSize: 3,
    }
    return ( 
      <div>
      {this.state.fire_loaded && this.state.fire_loaded2  ?
      <div style ={{marginTop: "50px"}} >
      
        <div class="text-center">
           <h3><i class="far fa-edit"></i> Create Test Form</h3>        
        </div>
        <div class="md-form">
          <div class="text-center">
            <input
                name="formName"
                onChange={this.onChange}
                type="text"
                placeholder="Enter Test Name"
                value={this.state.formName}

            />
          </div>
        </div>
        <div class="md-form">
          <div class="text-center">
            <input
                name="specimen"
                onChange={this.onChange}
                type="text"
                placeholder="Enter Specimen (Optional)"
                value={this.state.specimen}

            />
          </div>
        </div>
        <div class="md-form">
          <div class="text-center">
            <input
                name="testType"
                onChange={this.onChange}
                type="text"
                placeholder="Enter Test Type (Optional)"
                value={this.state.testType}

            />
          </div>
        </div>
        <div style ={{marginTop: "25px"}} >
      
        
        <div  class="d-flex justify-content-center">


</div>
       
        <div style ={{marginTop: "25px"}} class="text-center">
          <h5><i class="fas fa-check"></i> Click on the check boxes to select field properties for the Test Form</h5 >   
        </div>
        
        
        <div  style ={{marginTop: "25px"}} class="d-flex justify-content-center">
            {/* {console.log(this.numericDatas)} */}
            {/* {console.log(this.state.properties)} */}
            <div class="d-flex justify-content-center">
              <Griddle 
                  pageProperties={pageProperties}
                  data={this.state.numericProperties} 
                  plugins={[plugins.LocalPlugin]}
                  styleConfig={styleConfig}
              >
                  <RowDefinition>
                    <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="unitOfMeasurement" title="Unit of Measurement" customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="lowValue" title="Low Value" customHeadingComponent={CustomHeading} />
                    <ColumnDefinition id="highValue"  title="High Value" customHeadingComponent={CustomHeading} />
                    <ColumnDefinition id="propertyType"  title="Property Type" customHeadingComponent={CustomHeading} />
                    <ColumnDefinition id="" customComponent={SelectNumericPropertyCheckBox} />
                </RowDefinition>
              </Griddle>
            </div>
            
        </div>
        <div style ={{marginTop: "25px"}} class="d-flex justify-content-center">
            {/* {console.log(this.optionDatas)}
            {console.log(this.state.properties)} */}
            <div class="d-flex justify-content-center">
              <Griddle 
                  pageProperties={pageProperties}
                  data={this.state.optionDataDisplay} 
                  plugins={[plugins.LocalPlugin]}
                  styleConfig={styleConfig}
              >
                  <RowDefinition>
                    <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="options" title="Options" customHeadingComponent={CustomHeading}/>
                    <ColumnDefinition id="propertyType"  title="Property Type" customHeadingComponent={CustomHeading} />
                    <ColumnDefinition id="" customComponent={SelectOptionPropertyCheckBox} />
                </RowDefinition>
              </Griddle>
            </div>
            
        </div>

        <div style ={{marginTop: "25px"}} class="d-flex justify-content-center">
            {/* {console.log(this.optionDatas)}
            {console.log(this.state.properties)} */}
            <div class="d-flex justify-content-center">
              <Griddle 
                  pageProperties={pageProperties}
                  data={this.state.textProperties} 
                  plugins={[plugins.LocalPlugin]}
                  styleConfig={styleConfig}
              >
                  <RowDefinition>
                    <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
      
                    <ColumnDefinition id="propertyType"  title="Property Type" customHeadingComponent={CustomHeading} />
                    <ColumnDefinition id="" customComponent={SelectTextPropertyCheckBox} />
                </RowDefinition>
              </Griddle>
            </div>
            
        </div>

        {/*~~~~~~~~~~~~~~~~~Selected Numeric Properties~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
        <div style ={{marginTop: "25px"}} class="text-center">
          <h5><i class="far fa-edit"></i> Selected numeric properties that will be used to create the Test Form</h5 >   
        </div>
        <div class="d-flex justify-content-center">
            <Griddle 
                data={this.state.selectedNumericProperties} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
            >
                <RowDefinition>
                <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                
            
            </RowDefinition>
            </Griddle>
        </div>

        {/*~~~~~~~~~~~~~~~~~Selected Option Properties~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
        <div style ={{marginTop: "25px"}} class="text-center">
          <h5><i class="far fa-edit"></i> Selected option properties that will be used to create the Test Form</h5 >   
        </div>
        <div class="d-flex justify-content-center">
            <Griddle 
                data={this.state.selectedOptionProperties} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
            >
                <RowDefinition>
                <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                
            
            </RowDefinition>
            </Griddle>
        </div>

         {/*~~~~~~~~~~~~~~~~~Selected Text Properties~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
        <div style ={{marginTop: "25px"}} class="text-center">
          <h5><i class="far fa-edit"></i> Selected text properties that will be used to create the Test Form</h5 >   
        </div>
        <div class="d-flex justify-content-center">
            <Griddle 
                data={this.state.selectedTextProperties} 
                plugins={[plugins.LocalPlugin]}
                styleConfig={styleConfig}
            >
                <RowDefinition>
                <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
                
            
            </RowDefinition>
            </Griddle>
        </div>
        <div class="text-center">      
          <button class="btn blue-gradient" onClick = { () => this.handleCreateForm(this.state.formName,this.state.specimen,this.state.testType,this.state.selectedNumericProperties,this.state.selectedOptionProperties, this.state.selectedTextProperties)}>Create Form</button>
        </div>    
      </div>  
            
      
      </div>
      :
      <div>
        <div style ={{marginTop: "50px"}} class = "d-flex justify-content-center">
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
      </div>
      }
      </div>
      
      
      
    );
  }
}


const CreateFormForm = withRouter(withFirebase(CreateFormFormBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(CreateFormPage);

export { CreateFormForm };
