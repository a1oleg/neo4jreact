import React, { Component } from "react";
import './App.css';
import RequestHead from "./RequestHead";
var neo4j = require('neo4j-driver')

var driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'letmein')
)

var session = driver.session({ defaultAccessMode: neo4j.session.READ })

session
  .run('MATCH (w:Wagon) RETURN w limit 5', {
    nameParam: 'Alice'
  })
  .subscribe({
    onKeys: keys => {
      console.log(keys)
    },
    onNext: record => {
      console.log(record.get('w'))
    },
    onCompleted: () => {
      session.close() // returns a Promise
    },
    onError: error => {
      console.log(error)
    }
  })

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  render() {
      return (
      
      <main>
        
        <RequestHead />

        
      </main>
      
    );
  }
}

export default App;
