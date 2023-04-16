import React, { useState } from "react";

function Header(props) {
  const [input, setInput] = useState("");

  function getInput(e) {
    const value = e.target.value;
    setInput(value);
  }

  function searchFood(e) {
    props.setSearch(input);
    props.setIngredients({
      title: "",
      image: [],
      ingredient: [],
      instructions: "",
      servings: "",
      timeToCook: "",
      nutritions: {
        calories: "",
        protein: "",
        fat: "",
        carbs: "",
      },
    });
    setInput("");
    props.setShowFavourites(false);
    e.preventDefault();
  }

  return (
    <header>
      <div className="title">
        <h1>Baldwinos</h1>
      </div>
      <nav>
        <button onClick={props.onClick} className="favourite-btn">
          Favourites
        </button>
        <form onSubmit={searchFood}>
          <input
            onChange={getInput}
            name="search"
            placeholder="Search recipes"
            value={input}
          ></input>
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <p className="error-msg">{props.error}</p>
        </form>
      </nav>
    </header>
  );
}

export default Header;
