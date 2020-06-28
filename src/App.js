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
      //inDirs: [],
      inDirs: new Map(),
      choDirs: [],
      
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
    console.log(param);
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = this.state.inDirs;
    session
    .run('MATCH (:Dir{Name: $nameParam})-[:value]->(v)<-[r:field]-(:Wagon) RETURN v.Name, count(r)', {
      nameParam: param.name
    })
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        console.log(record);
        let x = res.get(record._fields[0]);  
        if(typeof x !== "undefined"){
          const newArr = [...x, record._fields[1]];

          res.set(record._fields[0], newArr);
        }
        else{
          res.set(record._fields[0], [record._fields[1]]);
        }
      },
      onCompleted: () => {  
        session.close();
          this.setState(({ inDirs }) => {
          //const newArr = [...inDirs, {name: param.value, values: res}];   
    
            return {
              inDirs: res
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
        
    // по обратному порядку каунта добавлять в запрос    
    
    let qString = 'MATCH (x:Value)<-[:field]-(w:Wagon)\n WHERE x.Name IN $inFields\n';
    
    qString += 'MATCH (d:Dir)-[:value]->(v:Value)<-[:field]-(w)\n';
    qString += 'WHERE d.Name IN $outFields\n';
    qString += 'RETURN w, v.Name ';
    //qString += 'LIMIT 6';

    console.log(qString);

    const res = new Map();
    session
    .run(qString, {
      outFields: this.state.outFields
      ,inFields: this.state.choDirs.map(n => n.name)
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
        console.log(this.state.results);
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
        {[...this.state.inDirs].map(item => {               
          return <Selector key={item[0]} name= {'Выбрать значение для ' + item[0]} values = {item[1]}  change ={this.addValue}/>//change ={this.addDir}       
        })}
        <br></br>
        <Selector name= {'Добавить справочник'} values={this.state.allDirs} change ={this.addDir}/>
        <br></br> 
        <button onClick={this.xfetch}>    Запрос   </button>
        <br></br>
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

          <tbody id="data-table">

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