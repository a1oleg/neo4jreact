import React, { Component } from "react";
import './App.css';
import RequestHead from "./RequestHead";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  render() {
      return (
      
      <main>
        
        <RequestHead />

        
      </main>
      
    );
  }
}

export default App;
