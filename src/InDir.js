import React, { Component } from "react";
import Selector from "./Selector";
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
        .run('MATCH (d:Dir{Name: $nameinput})-[:value]->(v) RETURN v', {
          nameinput: this.props.name
        })
        .subscribe({     
          onNext: record => {            
            //console.log(record._fields[0].identity.low);
            
            values.push({name:record._fields[0].properties.Name, bic:record._fields[0].properties.BIC});  
                  
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
    
      pickValue = (xxx) => {
        console.log(xxx);
        //let x = this.state.allValues.find(item => item.name === event.target.value);
        
        this.props.change({name:this.props.name, value:xxx.name, bic:xxx.bic.low});
        
        this.setState(({ choValues }) => {             
          const newArr = [...choValues, xxx.name];       
            return {
                choValues: newArr
            }
          });   
          //console.log(this.state.choValues);     
      };

      delValue = (event) => {         
        //let x = event.target.name; 
        let x = this.state.allValues.find(item => item.name === event.target.name);

        this.props.removeVal({name:this.props.name, bic:x.bic});
        this.setState(({ choValues }) => {            
            const newArr = choValues.filter(item => item !== x.name);         
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
        <td><Selector name= {this.props.name} values={this.state.allValues} change ={this.pickValue}/></td>
        
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