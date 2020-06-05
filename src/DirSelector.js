import React, { Component } from "react";

//import { Paper } from "@material-ui/core";
class DirSelector extends Component {
 
  handleChange = (event) => {
    console.log(event.target.value);
    //console.log(this.props);
    this.props.addDir(event.target.value);
  }  
  

  render() {
    //console.log(this.props);
    return (
      //  <div>
      //    <div>_RequestHead</div>

      <form>
      <label>
        Выберите ваш любимый вкус:
       
        <select onChange={this.handleChange}>
        {this.props.allDirs.map(n => {
         return <option value={n.name}>{n.name}</option>
       })}
          
        </select>
      </label>
      {/* <input type="submit" value="Отправить" /> */}
    </form>

    )
        
        
  }
}

export default DirSelector; // withStyles(styles)(UserList);
