import React from "react";

//import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const ValueSelector = (  {props} ) => {
  
  console.log(props.name);
  return (
    // <Paper>
      <form>
      <label>
      {props.name}
       
        <select onChange={this.handleChange}>
        {props.values.map(n => {
         return <option value={n}>{n}</option>
       })}
          
        </select>
      </label>
      {/* <input type="submit" value="Отправить" /> */}
    </form>
      //  </Paper>
    
  
  );
};

export default ValueSelector; 
