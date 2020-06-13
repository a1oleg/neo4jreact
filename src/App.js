import React, { Component } from "react";
import './App.css';
import Selector from "./Selector";
var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [], //[{name: 'Мать справочников',values: []}],
      actDirs: [],
      choDirs: [],
      
      outFields: [],
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )
   
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run('MATCH (d{Name: $nameParam})-[:value]->(v) RETURN v.Name', {
      nameParam: 'Мать справочников'
    })
    .subscribe({     
      onNext: record => {
        res.push(record._fields[0]);  
        //console.log(record._fields[0])      
      },
      onCompleted: () => {          
        this.setState({ allDirs: res})
        //console.log(this.state)
        session.close();// returns a Promise  
      },
      onError: error => {
        console.log(error)
      }
    });    
  };

  

  addDir = (param) => {
    //console.log(param)
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run('MATCH (d{Name: $nameParam})-[:value]->(v) RETURN v.Name', {
      nameParam: param.value
    })
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        res.push(record._fields[0]);
        
      },
      onCompleted: () => {  
        session.close();// returns a Promise
          this.setState(({ actDirs }) => {
          const newArr = [...actDirs, {name: param.value, values: res}];   
    
            return {
              actDirs: newArr
            }
        })
          
      },
      onError: error => {
        console.log(error)
      }
    });    
  };

  addValue = input => {
    console.log(input)
    this.setState(({ choDirs }) => {
      const newArr = [...choDirs, {name: input.name, value: input.value}];   

        return {
          choDirs: newArr
        }
    })

  };

  xfetch = () => {
    console.log('param')
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    
    //let query = 
    
    session
    .run('MATCH (:Value{Name: $name0})<-[:field]-(w:Wagon)-[:field]->(:Value{Name: $name1}) RETURN w', {
      name0: this.state.choDirs[0].value, name1: this.state.choDirs[1].value
      //name0: 'Деповской ремонт', name1: 'прочие'
    })
    .subscribe({      
      onNext: record => {
        res.push(record._fields[0]);        
      },
      onCompleted: () => {  
        session.close();// returns a Promise
        console.log(res)
        //   this.setState(({ actDirs }) => {
        //   const newArr = [...actDirs, {name: param.value, values: res}];   
    
        //     return {
        //       actDirs: newArr
        //     }
        // })
          
      },
      onError: error => {
        console.log(error)
      }
    });    
  };

  addOutField = input => {
    //console.log(input)
    this.setState(({ outFields }) => {
      const newArr = [...outFields, input.value];   

        return {
          outFields: newArr
        }
    })
    console.log(this.state.outFields)
  };

  render() {      
      return (      
      <main> 
             {this.state.actDirs.map(n => {               
          return <Selector name= {n.name} values = {n.values}  change ={this.addValue}/>//change ={this.addDir}       
       })}
        
        <Selector name= {'Ввод'} values={this.state.allDirs} change ={this.addDir}/> 
        <button onClick={this.xfetch}>
          Запрос
        </button>


        <Selector name= {'Вывод'} values={this.state.allDirs} change ={this.addOutField}/> 
      </main>
    );
  }
}

export default App;
