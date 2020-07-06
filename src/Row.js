import React from 'react';

export default function Row(props) {
  
  const newMap = new Map();
  props.values.map(v => { 
    newMap.set(v.split('@')[0], v.split('@')[1])
 
 })
//   const handleChange = (event) => {
//     setAge(event.target.value);
//   };

  return (
    <tr>
                  <td>{props.id}</td>  

                    {props.header.map(h => { 
                        

                      return <td>{newMap.get(h)}</td>
                     
                     })}
                </tr> 
  );
}