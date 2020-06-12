import React, { Component } from "react";
import './App.css';
import Selector from "./Selector";
import DirList from "./DirList";
var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [], //[{name: 'Мать справочников',values: []}],
      actDirs: [],
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )
    this.xfetch('Мать справочников', 'allDirs'); 
  }

  xfetch = (param, target) => {

    //this.setState({ allDirs: [...allDirs, {name: param, values: []} ] });
    
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run('MATCH (d{Name: $nameParam})-[:value]->(v) RETURN v.Name', {
      nameParam: param
    })
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        res.push(record._fields[0]);
        //this.setState({ target: [...target, record._fields[0] ] })
      },
      onCompleted: () => {  
        console.log(this.state)
         this.setState({ target: res})
        session.close();// returns a Promise  
      },
      onError: error => {
        console.log(error)
      }
    });    
  };

  addValue = input => {
    console.log(input)

  };

  render() {      
      return (      
      <main> 
             {this.state.actDirs.map(n => {               
          return <Selector name= {n.name} values = {n.values}  change ={this.addValue}/>//change ={this.addDir}       
       })}
        
        <Selector name= {'Справочники'} values={this.state.allDirs.map(x => x.values)} change ={this.xfetch}/> 
      </main>
    );
  }
}

export default App;
