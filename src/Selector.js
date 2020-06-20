import React, { Component } from "react";

//import { Paper } from "@material-ui/core";
class Selector extends Component {
 
  handleChange = (event) => {
    console.log(event.target.name);
    console.log(event.target.value);
    
    console.log(event.target.count);
    console.log(event.target);
    this.props.change(event.target);
  }  

  render() {
    //console.log(this.props);
    return (
      //  <div>
      //    <div>_RequestHead</div>

      <form>
      <label >
        {this.props.name}
       
        <select onChange={this.handleChange} value={this.props.value} name={this.props.name} count={this.props.count}>
        {this.props.values.map(v => {
         return <option key={v.name} value={v.name} count={v.count} >{v.name} {v.count}</option>
       })}
          
        </select>
      </label>
      {/* <input type="submit" value="Отправить" /> */}
    </form>

    )
        
        
  }
}

export default Selector;
