import React from "react";

function IngredientsHeader(props) {
  return (
    <div className="ingredients-title">
      <h2>{props.title}</h2>
      <img alt={props.alt} src={props.src}></img>
    </div>
  );
}

export default IngredientsHeader;
