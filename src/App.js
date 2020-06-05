import React, { Component } from "react";
import './App.css';
import RequestHead from "./RequestHead";

var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: new Map(),
      actDirs: [],
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )
    
    this.allDirsfetch('MATCH (x:Dir) RETURN x');

    }
    
      
  };


  allDirsfetch = (query) => {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    //const res = [];
    session
    .run(query)
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {        
        //res.push(record.get('x').properties.description);    
        this.setState(({ allDirs }) => {
          // const newArr = [...allDirs, {
          //   name: record.get('x').properties.description,
          //   values:[]
          // }]
          const newMap = [...allDirs, [record.get('x').properties.description, new Set()]];    
          return {
            allDirs: newMap
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

  valuesDirfetch = (dirName) => {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    
    let newActDir = {
      name: dirName,
      values:[]
    };
    session
    .run('MATCH (d:Dir {description: $nameParam})-[:value]->(v:Value) RETURN v.TXTLG', {
      nameParam: dirName
    })
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {        
        newActDir.values.push(record._fields[0]);    
        this.setState(({ actDirs }) => {
          const newArr = [...actDirs, newActDir];    
          return {
            actDirs: newArr
          };
        });
      },
      onCompleted: () => {  
        //console.log(res)      
        session.close();// returns a Promise                
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
             {this.state.allDirs.map(n => {
         return <div>{n.name}</div>;
       })}

        <RequestHead allDirs={this.state.allDirs} addDir ={this.valuesDirfetch}/> 
      </main>
    );
  }
}

export default App;
