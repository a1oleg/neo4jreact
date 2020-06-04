import React, { Component } from "react";
import './App.css';
import RequestHead from "./RequestHead";

var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: ['blabla'],
      actDirs: [],
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )
    
    this.fetchAllDirs();  

  }

  fetchAllDirs = () => {
    const res = this.xfetch('MATCH (x:Dir) RETURN x');
    this.setState(({ allDirs }) => {
          const newArr = [...allDirs, res.map(x => x.properties.description)];
    
          return {
            allDirs: newArr
          };
        });  
      
  }


  xfetch = (query, params) => {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run(query, params)
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        //console.log(this.state.allDirs);
        res.push(record.get('x'));        
      },
      onCompleted: () => {        
        session.close();// returns a Promise
        this.setState(({ allDirs }) => {
          const newArr = [...allDirs, res.map(x => x.properties.description)];
    
          return {
            allDirs: newArr
          };
        });
      },
      onError: error => {
        console.log(error)
      }
    });    
  }
  
  // addDir = input => {
  //   this.setState(({ actDirs }) => {
  //     const newArr = [...actDirs, input];

  //     return {
  //       actDirs: newArr
  //     };
  //   });
  // };

  render() {      
      return (      
      <main> 
        {this.state.allDirs.map(n => {
         return <div>{n}</div>;
       })}       
        <RequestHead allDirs={this.state.allDirs} /> 
      </main>
    );
  }
}

export default App;
