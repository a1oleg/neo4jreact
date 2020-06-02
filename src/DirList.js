import React from "react";
import ValueSelector from "./ValueSelector";

//import { withStyles } from "@material-ui/core/styles";
// import { Paper } from "@material-ui/core";

const DirList = ({ dirs, pickValue }) => {
  //console.log(dirs);

  //  const pickValue = event => {
  //   pickValue(event.target.value.pop());
  //   console.log(event.target.value.pop());

  //  };

  return (
    <div>
      {/* <div>{dirs[0]}</div> */}
      {dirs.map(n => {
        return <ValueSelector key={n} pickValue={pickValue} dirDesc={n} />;
      })}
    </div>
  );
};

export default DirList; //
