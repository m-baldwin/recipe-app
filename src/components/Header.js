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
        <h1>Cook Companion</h1>
      </div>
      <nav>
        <button
          style={{
            borderBottom: props.showHomePage ? "2px solid black" : "none",
          }}
          onClick={props.homePage}
          className="favourite-btn"
        >
          Home
        </button>
        <button
          style={{
            borderBottom: props.showFavourites ? "2px solid black" : "none",
          }}
          onClick={props.favouritePage}
          className="favourite-btn"
        >
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
