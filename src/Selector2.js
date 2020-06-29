import React, { Component } from "react";

class Selector2 extends Component {
 
  handleChange = (event) => {
     
    this.props.change({name:this.props.name, value:event.target.value, count:this.props.values.find(x => x.name === event.target.value).count});
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
         return <option key={v.name}  value={v.name} count={v.count} >{v.name} {v.count}</option>
       })}
          
        </select>
      </label>     
    </form>
    )   
  }
}
export default Selector2;
