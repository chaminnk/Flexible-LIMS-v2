import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase';
import {  withRouter } from 'react-router-dom';
import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';





const ViewOptionPropertiesPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
       
        

        <ViewOptionPropertiesPageForm/>
      </div>
    )}
  </AuthUserContext.Consumer>

);
class ViewOptionPropertiesPageFormBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = ({ 

   
      propertyDisplay:[],
    
      loading: true,
      fire_loaded: false,
      fire_loaded1: false,
      selected: false
    })

  }


  
  async componentWillMount() {
    await firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',(snapshot) => {
      this.userType = snapshot.val().userType;
      this.setState({fire_loaded:true});
       this.forceUpdate();
  });
  if (this.userType === 'patient' || this.userType === 'unapproved'){
      alert("You don't have permission to view this page");
      this.props.history.push(ROUTES.HOME);
  }
    firebase.database().ref('properties/').orderByChild('propertyType').on('value', (snapshot) => {
      
      this.propertyDisplay=[];
      var x=0;
      snapshot.forEach((child)=>{
        if(child.val().propertyType==="Option"){
          let optionString = '';
          child.val().options.forEach((option=>{
            optionString = optionString + option.optionValue + ', ';
          }))

              this.propertyDisplay.push({
                id:x,
                propertyKey: child.key,
                propertyName: child.val().propertyName,
                optionsString: optionString.slice(0,-2),
                propertyType: child.val().propertyType
                
              })
              
              x=x+1;     
        }
        
        
      }) 
      this.setState({fire_loaded1:true});

      
      this.setState({propertyDisplay:this.propertyDisplay});
    });
    this.setState({ loading: false });
    
  

 
    
    

    
    

    
    
    
    
    
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
      {this.state.fire_loaded && this.state.fire_loaded1 ?
      <div>

<div style ={{marginTop: "25px"}} >
>
    <div className ="d-flex justify-content-center">
        <Griddle 
            
            data={this.state.propertyDisplay} 
            plugins={[plugins.LocalPlugin]}
            styleConfig={styleConfig}
            
        >
            <RowDefinition> 
            <ColumnDefinition id="propertyName" title="Property Name" customComponent={CustomColumn} customHeadingComponent={CustomHeading}/>
            <ColumnDefinition id="optionsString" title="Options" customHeadingComponent={CustomHeading}/>
            <ColumnDefinition id="propertyType"  title="Property Type" customHeadingComponent={CustomHeading} />
            
            
            
        </RowDefinition>
        </Griddle>
    </div>
</div>

      
     
      </div>
      :
      <div style ={{marginTop: "50px"}} className = "d-flex justify-content-center">
          <div className ="spinner-border text-success" role="status">
            <span className ="sr-only">Loading...</span>
          </div>
        </div>
      }
      </div>
    );
     
  }
}
const ViewOptionPropertiesPageForm = withRouter(withFirebase(ViewOptionPropertiesPageFormBase)); // give access to the props of the router and firebse
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(ViewOptionPropertiesPage);
export {ViewOptionPropertiesPageForm}