import React, { Component,useState } from "react";
import XLSX from "xlsx";
import './App.css';
import InDir from "./InDir";
import Selector from "./Selector";

let neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [],
      inDirs: [],
      //inDirs: new Map(),
      //choDirs: new Map(),
      choValues:new Set(),
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
    this.setState(({ inDirs }) => {
      const newArr = [...inDirs, input.value]; 
      
        return {
          inDirs: newArr
        }
      })
      console.log(this.state.inDirs) 
  };

  addValue = input => {
    console.log(input)
    this.setState(({ choValues }) => {             
      const newSet = choValues.add(input);  
      //console.log(newSet)     ;
        return {
            choValues: newSet
        }
      });        
      console.log(this.state.choValues)
    
    
  };

  xfetch = () => {    
    
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
        
    // по обратному порядку каунта добавлять в запрос    
    
    let qString = 'MATCH (x:Value)<-[:field]-(w:Wagon)\n WHERE x.Name IN $inValues\n';
    
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
      inValues: [...this.state.choValues],
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
    
    this.setState(({ outFields }) => {
      const newArr = [...outFields, input.name];   

        return {
          outFields: newArr
        }
    })
    //console.log(this.state.outFields)
  };  

  removeInDir = (event) => { 
    //let x =  event.target.getAttribute('foo');
    this.setState(({ inDirs }) => {
      const newArr = inDirs.filter(item => item !== event);
        return {
          inDirs: newArr
        }
    })
  }
  
  removeOutField = (event) => {    
    let x =  event.target.getAttribute('foo');
    this.setState(({ outFields }) => {
      const newArr = outFields.filter(item => item !== x);
        return {
          outFields: newArr
        }
    })
  }
  
  exportTable = (type, fn, dl) => {
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
        <br></br>
        <table border="1"> 
          <tbody >
          {this.state.inDirs.map(item => {            
            return <InDir name={item} remove ={this.removeInDir}  change ={this.addValue}/>
            }) 
          }
          <tr>
                  <td><Selector prefix= {'Добавить справочник'} values={this.state.allDirs} change ={this.addDir}/></td>  
                 
          </tr>
          </tbody>
        </table>

               
        <br></br>
        <table border="1" >
          <thead>
            <td>_id</td>            
            {this.state.outFields.map(n => {               
              return <td>{n}
              <input type="submit" foo={n} value="X" onClick={this.removeOutField}></input>
              </td>       
            })}

          <td><Selector name= {'Добавить поле вывода'} values={this.state.allDirs} change ={this.addOutField}/> </td>
          </thead>    

          <tbody >
          <tr>
            <td>...</td> <td>...</td>
            {this.state.outFields.map(n => {               
                return <td>...</td>    
              })}
          </tr>   

          {[...this.state.results].map(item => {
            
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
        <button onClick={this.xfetch}>    Запрос   </button>
        <br></br>
        <input type="submit" value="Выгрузить в Excel" onClick={this.exportTable}></input>
        
      </main>
    );
  }
}

export default App;