import React, { Component } from "react";
import './App.css';
import Selector from "./Selector";
import DirList from "./DirList";
var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs:[],// [{name:'Мать справочников', values:[]}],
      // actDirs: [],//
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )
    this.xfetch('Мать справочников'); 
  }

  xfetch = (param) => {
    //console.log(input)
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
        // console.log(record._fields[0]);
        // this.setState({ [this.state.allDirs]: [this.state.allDirs.filter(function(item) { 
        //     return item.name === param
        // })[0].values.push(record._fields[0])] });
      },
      onCompleted: () => {    
        this.setState({ [this.state.allDirs]: [this.state.allDirs.push({name:param, values:res} )]});
        console.log(this.state.allDirs);
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
             {this.state.allDirs.filter(function(item) { 
                return item.values.length > 0 && item.name !== 'Мать справочников'
            })
             .map(n => {               
          return <Selector name= {n.name} values = {n.values}  change ={this.addValue}/>//change ={this.addDir}       
       })}        
        
        {
        this.state.allDirs.filter(function(item) { 
                return item.name == 'Мать справочников'
            }) > 0 ? 
            <Selector name= {'Справочники'} values={this.state.allDirs.filter(function(item) { 
                  return item.name == 'Мать справочников'
              })[0].values} change ={this.xfetch}/>
            : <span>ждёмс...</span>
            }
         
      </main>
    );
  }
}

export default App;
