import React, { Component } from "react";


class Selector extends Component {
 
  handleChange = (event) => {
    //console.log({name: this.props.name, value: event.target.value});
    this.props.change(this.props.values.find(x => x.name === event.target.value));
  }  

  render() {
    //console.log(this.props);
    return (
      //  <div>
      //    <div>_RequestHead</div>

      <form>
      <label >
      {this.props.prefix}
       
        <select onChange={this.handleChange} >
        <option selected>...</option>
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
