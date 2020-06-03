import React from "react";

// import {
//   Input,
//   InputLabel,
//   MenuItem,
//   FormControl,
//   Select,
//   Paper
// } from "@material-ui/core";



function ValueSelector({ pickValue, dirDesc }) {
  // const { loading, data, error } = useQuery(GET_VALUES, {
  //   variables: { desc: dirDesc }
  //});
  //console.log(data);

  // const handleChange = event => {
  //   pickValue(event.target.value.pop());
  //   console.log(event.target.value.pop());
  // };
   return (
    <div>_ValueSelector</div>
  //   <Paper>
  //     <div>{dirDesc}</div>
  //     {data && !loading && !error && (
  //       <FormControl>
  //         <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
  //         <Select
  //           labelId="demo-mutiple-name-label"
  //           id="demo-mutiple-name"
  //           multiple
  //           value={data.Values}
  //           onChange={handleChange}
  //           input={<Input />}
  //           // MenuProps={MenuProps}
  //         >
  //           {data.Values.map(n => (
  //             <MenuItem key={n} value={n}>
  //               {n}
  //             </MenuItem>
  //           ))}
  //         </Select>
  //       </FormControl>
  //     )}
  //   </Paper>
   );
}

export default ValueSelector; // withStyles(styles)(UserList);
