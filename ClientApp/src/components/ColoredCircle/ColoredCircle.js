import React from "react";
import "./ColoredCircle.css"
export  const ColoredCircle = ({ color }) => {

    const styles = {backgroundColor: color };
  
    return color ? (
      <React.Fragment>
        <span className="colored-circle" style={styles} />
      </React.Fragment>
    ) : null;
  };
  
