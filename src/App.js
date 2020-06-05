import React, { Component } from "react";
import './App.css';
import DirSelector from "./DirSelector";
import ValueSelector from "./ValueSelector";

var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [{
        name: 'bar',
        values: []
      }],
      actDirs: ['blabla'],
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )
    
    this.xfetch('MATCH (x:Dir) RETURN x'); 

  }

  xfetch = (query) => {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    //const res = [];
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
          const newArr = [...allDirs,{
            name: record.get('x').properties.description,
            values: []
          } ];
    
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
    console.log(input)
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run('MATCH (d:Dir {description: $nameParam})-[:value]->(v:Value) RETURN v.TXTLG', {
      nameParam: input
    })
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        res.push(record._fields[0]); 
         

      },
      onCompleted: () => {  
        
        this.setState(({ actDirs }) => {
          const newArr = [...actDirs, {
            name: input,
            values: res
          } ];
    
          return {
            actDirs: newArr
          };
        });
        console.log(this.state.actDirs);
        session.close();// returns a Promise        
        
      },
      onError: error => {
        console.log(error)
      }
    }); 
    
  };

  render() {      
      return (      
      <main> 
             {this.state.actDirs.forEach(n => {
               
          return <ValueSelector name= {n.name} values = {n.values}  />
       
       })}

        <DirSelector allDirs={this.state.allDirs} addDir ={this.addDir}/> 
      </main>
    );
  }
}

export default App;
