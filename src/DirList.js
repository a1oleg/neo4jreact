import React from "react";
import ValueSelector from "./ValueSelector";

//import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const DirList = ( props ) => {
  

  return (
    <Paper>
      <form>
      <label>
      {this.props.name}
       
        <select onChange={this.handleChange}>
        {this.props.values.map(n => {
         return <option value={n}>{n}</option>
       })}
          
        </select>
      </label>
      {/* <input type="submit" value="Отправить" /> */}
    </form>
       </Paper>
    
    // <div>
    //   <div>{dirs[0]}</div>
    //   {dirs.map(n => {
    //     return <ValueSelector key={n} pickValue={pickValue} dirDesc={n} />;
    //   })}
    // </div>
  );
};

export default DirList; //
