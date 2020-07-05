import React, { Component} from "react";
import XLSX from "xlsx";
import './App.css';
import InDir from "./InDir";
import Selector from "./Selector";
// import Example from "./Example";

let neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [],
      inDirs: [],      
      choValues:[],
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

  addInDir = input => {    
    
    this.setState(({ inDirs }) => {
      const newArr = [...inDirs, {name:input.name}]; 
      
        return {
          inDirs: newArr
        }
      })
  };

  removeInDir = (event) => { 
    this.setState(({ inDirs }) => {
      const newArr = inDirs.filter(item => item.name !== event);
        return {
          inDirs: newArr
        }
    })
  }

  addInValue = input => { 
      this.setState(({ choValues }) => {

        
        const newArr = [...choValues, input.value]; 
        
          return {
            choValues: newArr
          }
        })        
      
  };

  removeInValue = input => { 
    console.log(input);
    this.setState(({ choValues }) => {
      const newArr = choValues.filter(item => item !== input);
        return {
          choValues: newArr
        }
    })
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

  removeOutField = (event) => {    
    let x =  event.target.getAttribute('foo');
    this.setState(({ outFields }) => {
      const newArr = outFields.filter(item => item !== x);
        return {
          outFields: newArr
        }
    })
  }
  
  xfetch = () => {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    
    let qStart = 'MATCH (w:Wagon)-[:field]->(:Value{Name:"';    
    
    let qString = this.state.choValues.map(n => n).reduce(function(sum, current) {
      return sum + qStart + current + '"})\n';
    }, 0);    
 
    qString += 'MATCH (w)-[:field]->(v:Value)<-[:value]-(d:Dir)\n';
    qString += 'WHERE d.Name IN $outFields\n';
    qString += 'RETURN w, v.Name ';
    //qString += 'LIMIT 60';

    console.log(qString.substr(1));
    console.log(this.state.choValues);
    console.log(this.state.outFields);

    const newMap = new Map();
    session
    .run(qString.substr(1), {
      //inValues: this.state.choValues,
      outFields: this.state.outFields
      
    })
    .subscribe({
      onNext: record => {
        let id = record._fields[0].identity.low;
        let field = record._fields[1];
        
        let x = newMap.get(id);  
        if(typeof x !== "undefined"){
          const newArr = [...x, field];

          newMap.set(id, newArr);
        }
        else{
          newMap.set(id, [field]);
        } 
      },
      onCompleted: () => {  
        session.close();// returns a Promise
        
        this.setState(({ results }) => {
            return {
              results: newMap
            }
        });   
        //console.log(newMap);
        //console.log([...this.state.results]);
      },
      onError: error => {
        console.log(error)
      }
    });    
  }  
  
  exportTable = (type, fn, dl) => {    
	var elt = document.getElementById('data-table');
	var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
	return dl ?
		XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'base64'}) :
		XLSX.writeFile(wb, fn || ('SheetJSTableExport.' + 'xlsx'));
  }


  render() {      
      return (      
      <main>   
            {/* <MultipleSelect names={this.state.allDirs.map(d => d.name)}/> */}
            {/* <Example/> */}
        <br></br>
        <table border="1"> 
          <tbody >
          {this.state.inDirs.map(item => {            
            return <InDir name={item.name} removeDir ={this.removeInDir} removeVal ={this.removeInValue}  change ={this.addInValue}/>
            }) 
          }
          <tr>
                  <td><Selector name= {'Добавить справочник'} values={this.state.allDirs} change ={this.addInDir}/></td>  
                 
          </tr>
          </tbody>
        </table>

               
        <br></br>
        <table border="1" >
          <thead>
            
          <tr>
            <td>_id</td>            
            {this.state.outFields.map(n => {               
              return <td>{n}
              <input type="submit" foo={n} value="X" onClick={this.removeOutField}></input>
              </td>       
            })}

          <td><Selector name= {'Добавить поле вывода'} values={this.state.allDirs} change ={this.addOutField}/> </td>
          </tr> 
          </thead>    

          <tbody id="data-table">
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