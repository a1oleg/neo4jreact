import React , { useState } from "react";

function MapComponent(){
    const [myMap, setMyMap] = useState(new Map());
    const updateMap = (k,v) => {
      setMyMap(new Map(myMap.set(k,v)));
    }
    return(
      <ul>
        {[...myMap.keys()].map(k => (
          <li key={k}>myMap.get(k)</li>
        ))}
      </ul>
    );
  }

  
export default MapComponent;