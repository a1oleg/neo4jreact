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
  
  
  // addDir = input => {
  //   this.setState(({ dirs }) => {
  //     const newArr = [...dirs, input];

  //     return {
  //       dirs: newArr
  //     };
  //   });
  // };

  // pickValue = input => {
    
  // };

  render() {
    console.log(this.props);
    return (
       <dir>
         <div>_RequestHead</div>
        {this.props.allDirs.map(n => {
         return <div>{n}</div>;
       })}
        
        <DirList  />
       </dir>
    );
  }
}

export default RequestHead; // withStyles(styles)(UserList);
