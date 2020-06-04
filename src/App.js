import React, { Component } from "react";
import './App.css';
import RequestHead from "./RequestHead";

var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [],
      actDirs: ['blabla'],
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )
    
    this.fetchAllDirs();  

  }

  fetchAllDirs = () => {
    this.xfetch('MATCH (x:Dir) RETURN x');    
      
  };


  xfetch = (query) => {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run(query)
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        //console.log(this.state.allDirs);
        //res.push(record.get('x').properties.description);    
        this.setState(({ allDirs }) => {
          const newArr = [...allDirs, record.get('x').properties.description];
    
          return {
            allDirs: newArr
          };
        });

      },
      onCompleted: () => {        
        session.close();// returns a Promise
        //return res;
        
        
      },
      onError: error => {
        console.log(error)
      }
    });    
  }
  
  addDir = input => {
    this.setState(({ actDirs }) => {
      const newArr = [...actDirs, input];

      return {
        actDirs: newArr
      };
    });
  };

  render() {      
      return (      
      <main> 
             {this.state.actDirs.map(n => {
         return <div>{n}</div>;
       })}

        <RequestHead allDirs={this.state.allDirs} addDir ={this.addDir}/> 
      </main>
    );
  }
}

export default App;
