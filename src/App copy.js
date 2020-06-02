import React, { Component } from "react";

import RequestHead from "./RequestHead";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  render() {
    //const { classes } = this.props;

    return (
      // <React.Fragment>
      // <div className={classes.root}>
      <main>
        {/* <MultipleSelect/> */}
        <RequestHead />

        {/* <div className={classes.appBarSpacer} /> */}
      </main>
      // </div>
      // </React.Fragment>
    );
  }
}

export default App;
