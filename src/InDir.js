import React, { Component } from "react";
let neo4j = require('neo4j-driver')

class InDir extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          allValues: [],          
          choValues: [],  
          //choValues:new Set()        
        };        
        this.driver = neo4j.driver(
          'bolt://localhost:7687', neo4j.auth.basic('neo4j', 'letmein')
        );        
        this.getValues();        
    };
 
    getValues = () => {
        const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
        const values = [];
        session
        .run('MATCH (d:Dir{Name: $nameinput})-[:value]->(v) RETURN v.Name', {
          nameinput: this.props.name
        })
        .subscribe({     
          onNext: record => {
            values.push({name:record._fields[0]});  
            //console.log(record._fields[0])      
          },
          onCompleted: () => {          
            this.setState({ allValues: values})
            //console.log(this.state)
            session.close();// returns a Promise  
          },
          onError: error => {
            console.log(error)
          }
        });    
      };
    
      pickValue = (event) => {
        let x = event.target.value
        this.props.change({name:event.target.name, value:event.target.value}) 
        
        this.setState(({ choValues }) => {             
          const newArr = [...choValues, x];       
            return {
                choValues: newArr
            }
          });   
          //console.log(this.state.choValues);     
      };

      delValue = (event) => {         
        let x = event.target.name;  
        this.props.removeVal({name:this.props.name, value:x});
        this.setState(({ choValues }) => {            
            const newArr = choValues.filter(item => item !== x);         
            return {
                choValues: newArr
            }
          });
      };

      handleXdir = (event) => {        
        this.props.removeDir(this.props.name);
      }  

  render() {    
    return (
        <tr>
        <td>{this.props.name}
        <input type="submit" value="X" onClick={this.handleXdir}></input>
        </td>  
        <td>
          <form>
          <label >
          {this.props.prefix}     
            <select onChange={this.pickValue} name ={this.props.name} >
            <option selected>...</option>
            {this.state.allValues.map(v => {
            return <option key={v.name} value={v.name} count={v.count} >{v.name} {v.count}</option>
          })}
            
          </select>
          </label>     
          </form>
      
        </td>  
        
          {this.state.choValues.map(v => {               
              return <td>{v}
              <input type="submit" value="X" name = {v}  onClick={this.delValue}></input>
              </td>
              })}
      </tr>

    )
        
        
  }
}

export default InDir;