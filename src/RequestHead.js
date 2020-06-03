import React, { Component } from "react";
import DirSelector from "./DirSelector";
import DirList from "./DirList";
import { Paper } from "@material-ui/core";

var neo4j = require('neo4j-driver')

var driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'letmein')
)

var session = driver.session({ defaultAccessMode: neo4j.session.READ })

var xd = [];
session
  .run('MATCH (d:Dir) RETURN d', {
    nameParam: 'Alice'
  })
  .subscribe({
    //onKeys: keys => {
      //console.log(keys)
    //},
    onNext: record => {
      //console.log(record.get('d').properties.description);
      xd.push(record.get('d').properties.description);
      console.log(xd);
    },
    onCompleted: () => {
      session.close() // returns a Promise
    },
    onError: error => {
      console.log(error)
    }
  })

class RequestHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dirs: xd
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
    this.setState(({ dirs }) => {
      const newArr = [...dirs, input];

      return {
        dirs: newArr
      };
    });
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
