import React, { Component } from "react";
import DirSelector from "./DirSelector";
import DirList from "./DirList";
import { Paper } from "@material-ui/core";



class RequestHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dirs: []
    };
  }
  

  addDir = input => {
    this.setState(({ dirs }) => {
      const newArr = [...dirs, input];

      return {
        dirs: newArr
      };
    });
  };

  pickValue = input => {
    
  };

  render() {
    return (
       <Paper>
        <DirSelector addDir={this.addDir} />
        <DirList dirs={this.state.dirs} pickValue={this.pickValue} />
       </Paper>
    );
  }
}

export default RequestHead; // withStyles(styles)(UserList);
