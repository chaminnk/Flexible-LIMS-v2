import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import Select from 'react-select';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import { withAuthorization } from '../Session';

import * as ROUTES from '../../constants/routes';
const ViewFormsPage = () => ( // for the use of routing
  <div>
    
    <ViewFormsDisplay />
  </div>
);



class ViewFormsDisplayBase extends Component {
  constructor(props) {
    super(props);
  
    this.state = { form:this.props.location.state.form ,formKey: '',formName: '', specimen:'', testType: '', numericProperties:[], optionProperties: [], textProperties:[], loading: true,fire_loaded1: false,cards:[],
    cards2: [], 
    cards3: [],
    };
  }


  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
        this.userType = snapshot.val().userType;
        this.setState({fire_loaded1:true});
        this.forceUpdate();
    });
    if (this.userType === 'patient' || this.userType === 'unapproved' ){
        alert("You don't have permission to view this page");
        this.props.history.push(ROUTES.HOME);
    }
    this.setState({formName: this.state.form.formName})
    this.setState({specimen: this.state.form.specimen})
    this.setState({testType: this.state.form.testType})
    this.setState({formKey: this.state.form.formKey})
    this.setState({numericProperties: this.state.form.numericProperties})
    this.setState({optionProperties: this.state.form.optionProperties})
    this.setState({textProperties: this.state.form.textProperties})
    if(this.state.numericProperties!== undefined){
        
      var cards = [];
      
        for (var i = 0; i < this.state.numericProperties.length; i++) {
          if(this.state.numericProperties[i]!== undefined){
            cards.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
            <div className="card " style={{width: "50em"}}>
            <div className="md-form">
                            <div className="text-center">
                            
                          {this.state.numericProperties[i].propertyName} : <input
                            name={this.state.numericProperties[i].propertyKey}
                    
                            type="text"
                            placeholder={this.state.numericProperties[i].propertyValue}
                            value={this.state.v}
                            onChange={this.onChange2}
    
                          /> {this.state.numericProperties[i].unitOfMeasurement}, Low Value : {this.state.numericProperties[i].lowValue}, High Value : {this.state.numericProperties[i].highValue}
                          </div>
                        </div></div>
            </div>);
        }
      }
      
  
      this.setState({cards:cards})
  }
  if(this.state.optionProperties!== undefined){
    var cards2 = [];
    for (var j = 0; j < this.state.optionProperties.length; j++) {
      if(this.state.optionProperties[j]!== undefined){
        cards2.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
        <div className="card " style={{width: "50em"}}>
        <div className="md-form">
                        <div className="text-center">
                      {this.state.optionProperties[j].propertyName} : 
                      <div className="text-center">
                      <Select
                        name = {this.state.optionProperties[j].propertyKey}
                        
                        options={this.state.optionProperties[j].optionsList.map(t=>({value: t, label: t}))}
                        placeholder={this.state.optionProperties[j].selectedOption}
                        onChange={this.onChange3}
                      />
                      </div>
                      </div>
                    </div></div>
        </div>);
      }
    }
    this.setState({cards2:cards2})
  }
  if(this.state.textProperties !== undefined){
      var cards3 = [];
      for (var k = 0; k < this.state.textProperties.length; k++) {
        if(this.state.textProperties[k]!== undefined){
          cards3.push(<div style ={{marginTop: "25px"}} className="d-flex justify-content-center ">
          <div className="card " style={{width: "50em"}}>
          <div className="md-form">
                          <div className="text-center">
                        {this.state.textProperties[k].propertyName} : <input
                          name={this.state.textProperties[k].propertyKey}
                  
                          type="text"
                          placeholder={this.state.textProperties[k].propertyValue}
                          value={this.state.v}
                          onChange={this.onChange4}

                        /> 
                        </div>
                      </div></div>
          </div>);
        }
      } 
      this.setState({cards3:cards3})
  }
  
  this.setState({loading:false});

}
onChange = event  => {
  this.setState({ [event.target.name]: event.target.value});
  
 
};

onChange2 = event => {
    
  this.state.numericProperties.forEach((obj) => {
      
    if(obj.propertyKey===event.target.name){
      
      obj.propertyValue=event.target.value ;
    }
  })
  
 // this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event

};
onChange3 = (selectedOption,selectedProperty) => {
  
  this.state.optionProperties.forEach((obj) => {
    if(obj.propertyKey===selectedProperty.name){
      obj.selectedOption=selectedOption.value ;
      
    }
  })
  
}
onChange4 = event => {
  this.state.textProperties.forEach((obj) => {
    if(obj.propertyKey===event.target.name){
      obj.propertyValue=event.target.value ;
    }
  })
 
 // this.setState({ [event.target.name]: event.target.value }); // set the value to the corresponding name of the state in an onChange event

}; 
 
  
    

  render() {
    
    return (
      <div>
        {this.state.fire_loaded1 ?
      <div style ={{marginTop: "25px"}} >
        
        
        <div className="text-center">
            <h3><i className="far fa-edit"></i>  {this.state.formName} (Preview)</h3>        
        </div>
        
    
        

        
        
    

    <div style ={{marginTop: "25px"}} >
              
    <div className="d-flex justify-content-center ">
        
            
            
        <div className="card " style={{width: "50em"}}>
            
                <div className="md-form">
                    <div className="text-center">
                        Specimen : {this.state.specimen} 
                    </div>
                </div>
                <div className="md-form">
                    <div className="text-center">
                        Test Type : {this.state.testType} 
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

    </div>  
    :
    <div>
    <div style ={{marginTop: "50px"}} className = "d-flex justify-content-center">
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    </div>
}
</div>
      
      
    );
  }
}



const ViewFormsDisplay = withRouter(withFirebase(ViewFormsDisplayBase));
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(ViewFormsPage);

export { ViewFormsDisplay };
