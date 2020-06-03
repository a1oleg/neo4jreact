import React, { Component } from "react";
import './App.css';
import RequestHead from "./RequestHead";

var neo4j = require('neo4j-driver')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDirs: [],
      actDirs: [],
      results: [],

    };
    
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'letmein')
    )

    const res = this.fetch('MATCH (x:Dir) RETURN x');

    this.setState(({ allDirs }) => {
          const newArr = [...allDirs, res.map(x => x.properties.description)];
    
          return {
            allDirs: newArr
          };
        }
      );

  }

  
  fetch = (query, params) => {
    //const { mapCenter, startDate, endDate } = this.state;
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    const res = [];
    session
    .run(query, params)
    .subscribe({
      //onKeys: keys => {
        //console.log(keys)
      //},
      onNext: record => {
        //console.log(this.state.allDirs);
        res.push(record.get('x'));
        // this.setState(({ allDirs }) => {
        //   const newArr = [...allDirs, record.get('x').properties.description];
    
        //   return {
        //     allDirs: newArr
        //   };
        // });
      },
      onCompleted: () => {        
        session.close();// returns a Promise
        console.log(res.map(x => x.properties.description));
        return res;
      },
      onError: error => {
        console.log(error)
      }
    })

    // addDir = input => {
    //   this.setState(({ actDirs }) => {
    //     const newArr = [...actDirs, input];
  
    //     return {
    //       actDirs: newArr
    //     };
    //   });
    // };


  }
  
  render() {
      return (
      
      <main>        
        <RequestHead addDir={this.addDir} allDirs={this.state.allDirs}/>
        {/* <ResponseBody /> */}
        
      </main>
      
    );
  }
}

export default App;
