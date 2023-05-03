import React from "react";

function Card(props) {
  return (
    <div className="card">
      <img src={props.img} alt={props.alt} loading="lazy"></img>

      <h3>{props.title}</h3>
      <p>{props.description}</p>

      <button onClick={props.favourites} className="like-btn">
        {props.icon}
      </button>

      <button className="ingredients-btn" onClick={props.onClick}>
        Get Ingredients
      </button>
    </div>
  );
}

export default Card;
