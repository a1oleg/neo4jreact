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
    
      pickValue = (input) => { 
        console.log(input.value);  
        this.setState(({ choValues }) => {
          //const newArr = [...choValues, input.value];     
          const newSet = choValues.add(input.value);       
            return {
                choValues: newSet
            }
          });
        
        //   this.setState(({ allValues }) => {
        //     const newArr = allValues.filter(item => item !== input.value);
        //       return {
        //         allValues: newArr
        //       }
        //   })
      };

      delValue = (input) => { 
        console.log(input.value);  
        this.setState(({ choValues }) => {
            const newSet = choValues.delete(input.value);          
            return {
                choValues: newSet
            }
          });
        
        //   this.setState(({ choValues }) => {
        //     const newArr = choValues.filter(item => item !== input.value);
        //       return {
        //         choValues: newArr
        //       }
        //   })
      };

      handleX = (event) => {
        
        this.props.remove(this.props.name);
      }  

  render() {    
    return (
        <tr>
        <td>{this.props.name}
        <input type="submit" value="X" onClick={this.handleX}></input>
        </td>  
        <td><Selector2 key={this.props.name} prefix={'Добавить значение'} name={this.props.name} values ={this.state.allValues}  change={this.pickValue}/></td>  
        
          {[...this.state.choValues].map(v => {               
              return <td>{v}
              <input type="submit" value="X" onClick={this.delValue}></input>
              </td>
              })}
      </tr>

    )
        
        
  }
}

export default InDir;