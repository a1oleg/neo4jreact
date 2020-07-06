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
    
      pickValue = (event) => {
        //let x = event.target.value;
        let x = this.state.allValues.find(item => item.name === event.target.value);

        //let bic2 = event.target.getAttribute('bic');
        this.props.change({name:event.target.name, value:x.name, bic:x.bic});
        
        this.setState(({ choValues }) => {             
          const newArr = [...choValues, x.name];       
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
        <td>
          <form>
          <label >
          {this.props.prefix}     
            <select onChange={this.pickValue} name ={this.props.name} >
            <option selected>...</option>
            {this.state.allValues.map(v => {
            return <option key={v.bic} value={v.name} bic={v.bic} >{v.name}</option>
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