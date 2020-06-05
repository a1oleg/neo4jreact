import React, { Component } from "react";
import Selector from "./Selector";

//import { withStyles } from "@material-ui/core/styles";
//import { Paper } from "@material-ui/core";
class DirList extends Component{

  render() {
    
    return (
      <div>

          {this.props.values.forEach(n => {
               
               return <Selector name= {n.name} values = {n.values}/>
            
            })}
      </div>
      

    )
        
        
  }
  
  
  
};

export default DirList; //
