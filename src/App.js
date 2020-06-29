import React, { Component,useState } from "react";
import XLSX from "xlsx";
import './App.css';
import Selector from "./Selector";
import Selector2 from "./Selector2";
var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [],
      
      inDirs: new Map(),
      choDirs: new Map(),
      
      outFields: [],
      
      results: new Map()
    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    );
    
    this.getDirs();
    
  };

  getDirs = () => {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run('MATCH (d{Name: $nameinput})-[:value]->(v) RETURN v.Name', {
      nameinput: 'Мать справочников'
    })
    .subscribe({     
      onNext: record => {
        res.push({name:record._fields[0]});  
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

  addDir = (input) => {
    //console.log(input);
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    let res = this.state.inDirs;

    session
    .run('MATCH (:Dir{Name: $nameinput})-[:value]->(v)<-[r:field]-(:Wagon) RETURN v.Name, count(r)', {
      nameinput: input.name
    })
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        //console.log(record);

        let x = res.get(input.name);  
        if(typeof x !== "undefined"){
          const newArr = [...x, {name: record._fields[0], count: record._fields[1].low}];

          res.set(input.name, newArr);
        }
        else{
          res.set(input.name, [{name: record._fields[0], count: record._fields[1].low}]);
        }
      },
      onCompleted: () => {  
        session.close();
          this.setState(({ inDirs }) => {
          //const newArr = [...inDirs, {name: input.value, values: res}];   
    
            return {
              inDirs: res
            }
        })
        //console.log(this.state.inDirs)
      },
      onError: error => {
        console.log(error)
      }
    });    
  };

  addValue = input => {
    //console.log(input)
    let newMap = this.state.choDirs;

    let x = newMap.get(input.name); 
    if(typeof x !== "undefined"){
      const newArr = [...x, input.value];

      newMap.set(input.name, newArr);
    }
    else{
      newMap.set(input.name, [input.value]);
    }

    this.setState(() => {  
      return {
        choDirs: newMap
      }        
    })
    console.log(this.state.choDirs);
    console.log([...this.state.choDirs.get("Виды работ")]);
  };

  xfetch = () => {    
    
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
        
    // по обратному порядку каунта добавлять в запрос    
    
    let qString = 'MATCH (x:Value)<-[:field]-(w:Wagon)\n WHERE x.Name IN $inFields\n';
    
    qString += 'MATCH (d:Dir)-[:value]->(v:Value)<-[:field]-(w)\n';
    qString += 'WHERE d.Name IN $outFields\n';
    qString += 'RETURN w, v.Name ';
    //qString += 'LIMIT 6';

    // console.log([...this.state.choDirs].map(n => n[1]).reduce(function(previousValue, currentValue, index, array) {
    //   return [...previousValue, ...currentValue];
    // }));   


    console.log(qString);

    const res = new Map();
    session
    .run(qString, {
      inFields: [...this.state.choDirs].map(n => n[1]).reduce(function(previousValue, currentValue, index, array) {
        return [...previousValue, ...currentValue];
      }),
      outFields: this.state.outFields
      
    })
    .subscribe({
      onNext: record => {       
        let x = res.get(record._fields[0].identity.low);  
        if(typeof x !== "undefined"){
          const newArr = [...x, record._fields[1]];

          res.set(record._fields[0].identity.low, newArr);
        }
        else{
          res.set(record._fields[0].identity.low, [record._fields[1]]);
        } 
      },
      onCompleted: () => {  
        session.close();// returns a Promise
        
        this.setState(({ results }) => {
            return {
              results: res
            }
        });   
        //console.log(res);
        //console.log([...this.state.results]);
      },
      onError: error => {
        console.log(error)
      }
    });    
  }

  addOutField = input => {
    //console.log(input)
    this.setState(({ outFields }) => {
      const newArr = [...outFields, input.name];   

        return {
          outFields: newArr
        }
    })
    //console.log(this.state.outFields)
  };

  
  doit = (type, fn, dl) => {
    console.log('item');
	var elt = document.getElementById('data-table');
	var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
	return dl ?
		XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'base64'}) :
		XLSX.writeFile(wb, fn || ('SheetJSTableExport.' + 'xlsx'));
}


  render() {      
      return (      
      <main>
        
        <Selector name= {'Добавить справочник'} values={this.state.allDirs} change ={this.addDir}/>
        <br></br>
        <table border="1"> 
          <tbody >
          {[...this.state.inDirs].map(item => {            
            return <tr>
                  <td>{item[0]}</td>  
                  <td><Selector2 key={item[0]} prefix={'Добавить значение'} name={item[0]} values ={item[1]}  change={this.addValue}/></td>  
                  
                    {/* {this.state.choDirs.get(item[0]).map(v => {               
                        return <td>{v}</td>
                        })} */}
                </tr>
            }) 
          }
          </tbody>
        </table>

        
        
        <br></br>
        <table border="1" >
          <thead>
            <td>_id</td>
            
            {this.state.outFields.map(n => {               
              return <td>{n}</td>       
            })}

            <td><Selector name= {'Добавить поле вывода'} values={this.state.allDirs} change ={this.addOutField}/> </td>  
            <tr>
            <td>...</td>
            <td>...</td>
            {this.state.outFields.map(n => {               
                return <td>...</td>    
              })}
          </tr>            
          </thead>          
        </table>

        <br></br>
        <button onClick={this.xfetch}>    Запрос   </button>
        <br></br>

        <table border="1" id="data-table">
          <thead>
          <td>_id</td>   
          {this.state.outFields.map(n => {               
                return <td>{n}</td>    
              })}    
                      
          </thead>

          <tbody >

          {[...this.state.results].map(item => {
            //console.log(item)
            return <tr>
                  <td>{item[0]}</td>  
                    {item[1].map(v => {               
                      return <td>{v}</td>
                      })}
                </tr> 

            }) 
          }
          </tbody>
        </table>
        <br></br>
        <input type="submit" value="Export to XLSX!" onClick={this.doit} ></input>
        {/* onclick={this.doit('xlsx')} */}
      </main>
    );
  }
}

export default App;