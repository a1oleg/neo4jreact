import React, { Component } from "react";
import Selector2 from "./Selector2";
import Selector from "./Selector";
let neo4j = require('neo4j-driver')

class InDir extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          allValues: [],          
          //choValues: [],  
          choValues:new Set()        
        };        
        this.driver = neo4j.driver(
          'bolt://localhost:7687',
          neo4j.auth.basic('neo4j', 'letmein')
        );
        console.log(this.props) 
        this.getValues();
        
    };
 
    getValues = () => {
        const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
        const values = [];
        session
        .run('MATCH (d:Dir{Name: $nameinput})-[:value]->(v) RETURN v.Name', {
          nameinput: this.props.value
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
    
      pickValue = (input) => {
        this.props.change(input) 
        console.log(input.value);  
        this.setState(({ choValues }) => {             
          const newSet = choValues.add(input);       
            return {
                choValues: newSet
            }
          });        
      };

      delValue = (input) => { 
        console.log(input.value);  
        this.setState(({ choValues }) => {
            const newSet = choValues.delete(input.value);          
            return {
                choValues: newSet
            }
          });
      };

      handleX = (event) => {
        
        this.props.remove(this.props.value);
      }  

  render() {    
    return (
        <tr>
        <td>{this.props.value}
        <input type="submit" value="X" onClick={this.handleX}></input>
        </td>  
        <td><Selector key={this.props.value} prefix={'Добавить значение'} name={this.props.value} values ={this.state.allValues}  change={this.pickValue}/></td>  
        
          {[...this.state.choValues].map(v => {               
              return <td>{v}
              {/* <input type="submit" value="X" onClick={this.delValue}></input> */}
              </td>
              })}
      </tr>

    )
        
        
  }
}

export default InDir;