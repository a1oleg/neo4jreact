import React, { Component,useState } from "react";
import XLSX from "xlsx";
import './App.css';
import Selector from "./Selector";
import MapComponent from "./MapComponent";
var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [], //[{name: 'Мать справочников',values: []}],
      actDirs: [],
      choDirs: [],
      
      outFields: [],
      //results: [],
      myMap: new Map()
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
    .run('MATCH (d{Name: $nameParam})-[:value]->(v) RETURN v.Name', {
      nameParam: 'Мать справочников'
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

  addDir = (param) => {
    //console.log(param)
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run('MATCH (:Dir{Name: $nameParam})-[:value]->(v)<-[r:field]-(:Wagon) RETURN v.Name, count(r)', {
      nameParam: param.name
    })
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        res.push({name:record._fields[0], count:record._fields[1].low});
        //console.log(record._fields[1].low)
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
    //console.log(input)

    
    this.setState(({ choDirs }) => {
      const newArr = [...choDirs, input];   

        return {
          choDirs: newArr
        }
    })
    //console.log(this.state.choDirs);
  };

  xfetch = () => {    
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = new Map();
    
    // //по обратному порядку каунта добавлять в запрос
    // let sorted = this.state.choDirs.sort(function (a, b) {
    //   if (a.name > b.count) {
    //     return 1;
    //   }
    //   if (a.name < b.count) {
    //     return -1;
    //   }
    //   // a должно быть равным b
    //   return 0;
    // });
    
    let qStart = 'MATCH (:Value{Name:"';
    
    let qEnd = '"})<-[:field]-(w:Wagon)\n';

    let qStart2 = 'MATCH (x:Value)<-[:field]-(w:Wagon)\n';
    let qEnd2 = 'WHERE x.Name IN $inFields\n';


    // let qString = this.state.choDirs.map(n => n.name).reduce(function(sum, current) {
    //   return sum + qStart + current + qEnd;
    // }, 0);    

    let qString = qStart2 + qEnd2

    qString += 'MATCH (d:Dir)-[:value]->(v:Value)<-[:field]-(w)\n';
    qString += 'WHERE d.Name IN $outFields\n';
    qString += 'RETURN w, v.Name ';
    qString += 'LIMIT 6';

    console.log(qString);

    session
    .run(qString, {
      outFields: this.state.outFields
      ,inFields: this.state.choDirs.map(n => n.name)
    })
    .subscribe({

      onNext: record => {   
        //console.log({_id: record._fields[0].identity.low, foo:record._fields[1] });     
        //res.push({_id: record._fields[0].identity.low, foo:record._fields[1] });
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
        
        this.setState(({ myMap }) => {
            return {
              myMap: res
            }
        });   
        //console.log(res);
        console.log(this.state.myMap);
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
        {this.state.actDirs.map(n => {               
          return <Selector key={n.value} name= {n.name} values = {n.values}  change ={this.addValue}/>//change ={this.addDir}       
        })}
        
        <Selector name= {'Ввод'} values={this.state.allDirs} change ={this.addDir}/> 
        <button onClick={this.xfetch}>
          Запрос
        </button>

        <table border="1" id="data-table">
          <tr>
            <th>_id</th>
            
            {this.state.outFields.map(n => {               
              return <th>{n}</th>       
            })}

            <th><Selector name= {'Добавить'} values={this.state.allDirs} change ={this.addOutField}/> </th>  
            
          </tr>
          <tr>
            <td>...</td>
            <td>...</td>
            {this.state.outFields.map(n => {               
                return <td>...</td>    
              })}
          </tr>

          {[...this.state.myMap].map(item => {
            console.log(item)
            return <tr>
                  <td>{item[0]}</td>  
                    {item[1].map(v => {               
                      return <td>{v}</td>
                      })}
                </tr> 

            })
  

          }
        </table>
        <input type="submit" value="Export to XLSX!" onclick={this.doit} ></input>
        {/* onclick={this.doit('xlsx')} */}
      </main>
    );
  }
}

export default App;