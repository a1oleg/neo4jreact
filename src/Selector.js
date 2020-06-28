import React, { Component } from "react";

//import { Paper } from "@material-ui/core";
class Selector extends Component {
 
  handleChange = (event) => {
    //console.log(event.target.name);
    //console.log(event.target.value);
    
    //console.log(event.target.count);
    
    
    this.props.change(this.props.values.find(x => x.name === event.target.value));
  }  

  render() {
    //console.log(this.props);
    return (
      //  <div>
      //    <div>_RequestHead</div>

      <form>
      <label >
        {this.props.name}
       
        <select onChange={this.handleChange} defaultValue={'...'} >
        {/* <option selected>...</option> */}
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
