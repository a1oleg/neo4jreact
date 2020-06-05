import React, { Component } from "react";
import DirSelector from "./DirSelector";
import DirList from "./DirList";
//import { Paper } from "@material-ui/core";
class RequestHead extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     dirs: []
  //   };
    
  // }
  handleChange = (event) => {
    //console.log(event.target.value);
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
        Добавить справочник:
       
        <select onChange={this.handleChange}>
        {this.props.allDirs.keys(n => {
         return <option value={n}>{n}</option>
       })}
          
        </select>
      </label>
      {/* <input type="submit" value="Отправить" /> */}
    </form>

    )
        
        
  }
}

export default RequestHead; // withStyles(styles)(UserList);
