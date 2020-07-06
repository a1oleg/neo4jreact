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
      //inDirs: [],      
      inValues:[],
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
    this.setState(({ inValues }) => {
      let x = inValues.find(item => item.name === input.name);
      //console.log(x);
      if(typeof x == 'undefined'){
        const newArr = [...inValues, {name:input.name, bics:[]}];
        return {
          inValues: newArr
        }
      }
             
    })       
  };

  removeInDir = (event) => { 
    this.setState(({ inValues }) => {
      const newArr = inValues.filter(item => item.name !== event);
        return {
          inValues: newArr
        }
    })
  }

  addInValue = input => { 
    //console.log(input);
      this.setState(({ inValues }) => {
        let x = inValues.find(item => item.name === input.name);
        //console.log(x);
        if(typeof x == 'undefined'){
          const newArr = [...inValues, {name:input.name, bics:[input.bic]}];
          return {
            inValues: newArr
          }
        }
        else{
          let y = inValues.filter(item => item.name !== input.name);
          x.bics.push(input.bic);

          const newArr = [...y, x];
          return {
            inValues: newArr
          }

        };          
      })        
      //console.log(this.state.inValues);
  };

  removeInValue = input => { 
    
    this.setState(({ inValues }) => {
      const x = inValues.find(item => item.name === input.name);
      const y = inValues.filter(item => item.name !== input.name);

      x.bics =  x.bics.filter(item => item !== input.bic);
      
      const newArr = [...y, x];
        return {
          inValues: newArr
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
    
    //let qStart = 'MATCH (w:Wagon)-[:field]->(:Value{Name:"';   
    let qStart = 'MATCH (d:Dir)-[:value]->(v:Value)<-[:field]-(w:Wagon)\nWHERE d.Name="';   
    let qEnd = '"\nAND v.BIC IN [';

    let qString = this.state.inValues.reduce(function(sum, current) {
      return sum + qStart + current.name +  qEnd + current.bics + ']\n';
    }, 0);    
 
    qString += 'MATCH (w)-[:field]->(vv:Value)<-[:value]-(dd:Dir)\n';
    qString += 'WHERE dd.Name IN $outFields\n';
    qString += 'RETURN w, CASE WHEN vv IS NULL THEN "null" ELSE vv.Name END';
    //qString += 'LIMIT 60';

    console.log(qString.substr(1));
    console.log(this.state.inValues);
    console.log(this.state.outFields);

    const newMap = new Map();
    session
    .run(qString.substr(1), {
      //inValues: this.state.inValues,
      outFields: this.state.outFields
      
    })
    .subscribe({
      onNext: record => {
        let id = record._fields[0].identity.low;
        let field = record._fields[1];
        console.log(record._fields, id, field);
        
        let x = newMap.get(id);  
        if(typeof x !== "undefined"){
          const newArr = [...x, field];
          newMap.set(id, newArr);
        }
        else{
          newMap.set(id, [field]);
        };
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
          
          {this.state.inValues.map(item => {            
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