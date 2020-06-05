import React, { Component } from "react";

//import { Paper } from "@material-ui/core";
class Selector extends Component {
 
  handleChange = (event) => {
    console.log(event.target.value);
    //console.log(this.props);
    this.props.change(event.target.value);
  }  
  

  render() {
    //console.log(this.props);
    return (
      //  <div>
      //    <div>_RequestHead</div>

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

    )
        
        
  }
}

export default Selector; // withStyles(styles)(UserList);
