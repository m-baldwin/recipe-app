import React, { useState } from "react";

function Card(props) {
  const [like, setLike] = useState(false);

  function likeBtn() {
    return setLike(!like);
  }
  return (
    <div className="card">
      <img src={props.img} alt={props.alt} loading="lazy"></img>

      <h3>{props.title}</h3>
      <p></p>

      {like ? (
        <button onClick={likeBtn} className="like-btn">
          <i
            className="fa-solid fa-heart fa-beat fa-2xl"
            style={{ color: "#ac0202" }}
          ></i>
        </button>
      ) : (
        <button onClick={likeBtn} className="like-btn">
          <i className="fa-regular fa-heart fa-2xl"></i>
        </button>
      )}

      <button className="ingredients-btn" onClick={props.onClick}>
        Get Ingredients
      </button>
    </div>
  );
}

export default Card;
