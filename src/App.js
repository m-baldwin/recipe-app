import React, { useEffect, useState } from "react";

import Card from "./components/Card";
import Header from "./components/Header";
import Nutritiontable from "./components/NutritionTable";
import IngredientsHeader from "./components/IngredientsHeader";
import HeartIcon from "./components/HeartIcon";

function App() {
  const apiKey = "0c2f184d291646fe96d86bcc9ba52623";

  const [recipes, setRecipes] = useState([
    {
      id: "",
      title: "",
      image: "",
    },
  ]);
  const [favouriteArr, setFavouriteArr] = useState([]);
  const [search, setSearch] = useState("");
  const [showFavourites, setShowFavourites] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  let [numberOfItems, setNumberOfItems] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [ingredients, setIngredients] = useState({
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

  console.log(favouriteArr.map((fav) => fav.title));

  function addToFavourites(id) {
    setFavouriteArr((prevFavourites) => {
      const index = prevFavourites.findIndex((recipe) => recipe.id === id);
      if (index === -1) {
        const recipeToAdd = recipes.find((recipe) => recipe.id === id);
        const updatedFavourites = [...prevFavourites, recipeToAdd];
        localStorage.setItem("favouriteArr", JSON.stringify(updatedFavourites));
        return updatedFavourites;
      } else {
        const updatedFavourites = [...prevFavourites];
        updatedFavourites.splice(index, 1);
        localStorage.setItem("favouriteArr", JSON.stringify(updatedFavourites));
        return updatedFavourites;
      }
    });
  }

  useEffect(() => {
    const favouriteArrString = localStorage.getItem("favouriteArr");
    if (favouriteArrString) {
      const favouriteArr = JSON.parse(favouriteArrString);
      setFavouriteArr(favouriteArr);
    }
  }, []);

  function toggleHomePage() {
    setIngredients({
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
    setShowFavourites(false);
    if (showHomePage === true) {
      setShowHomePage(true);
      setSearch("");
    } else {
      setShowHomePage(true);
      setSearch(search);
    }
  }

  function toggleFavouritePage() {
    setIngredients({
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
    setShowFavourites(true);
    setShowHomePage(false);
  }

  function getMoreRecipes() {
    setNumberOfItems(numberOfItems + 10);
  }

  function goBack() {
    setIngredients({
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
    if (showFavourites === true) {
      setShowFavourites(true);
    } else {
      setShowHomePage(true);
    }
    window.scrollTo(0, 0);
  }

  function getIngredients(id) {
    const recipe = recipes.find((rec) => rec.id === id);

    Promise.all([
      fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      ),
      fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      ),
    ])
      .then((responses) => {
        // Check if all responses are okay
        if (responses.every((response) => response.ok)) {
          // Parse responses
          return Promise.all(responses.map((response) => response.json()));
        }
        throw new Error("One or more network responses were not ok.");
      })
      .then(([info, nutrition]) => {
        const mealIngredients = info.extendedIngredients.map((ingredient) => {
          return ingredient;
        });
        setIngredients({
          title: info.title,
          image: info.image,
          ingredient: mealIngredients,
          instructions: info.analyzedInstructions[0].steps,
          servings: info.servings,
          timeToCook: info.readyInMinutes,
          nutritions: {
            calories: nutrition.calories,
            protein: nutrition.protein,
            fat: nutrition.fat,
            carbs: nutrition.carbs,
          },
        });
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    setNumberOfItems(10); // this line to reset numberOfItems to 10

    fetch(
      search === ""
        ? `https://api.spoonacular.com/recipes/complexSearch?sort=random&number=100`
        : `https://api.spoonacular.com/recipes/complexSearch?query=${search}&sort=random&number=100`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((result) => {
        if (result.results.length === 0) {
          setErrorMessage("No matching recipes found.");
        } else {
          const foodItem = result.results.map((food) => ({
            id: food.id,
            title: food.title,
            image: food.image,
          }));
          setRecipes(foodItem);
          setErrorMessage("");
          window.scrollTo(0, 0);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [apiKey, search]);

  return (
    <div className="app">
      <Header
        showFavourites={showFavourites}
        setIngredients={setIngredients}
        setSearch={setSearch}
        error={errorMessage}
        favouritePage={toggleFavouritePage}
        setShowFavourites={setShowFavourites}
        homePage={toggleHomePage}
        showHomePage={showHomePage}
      />

      {ingredients.ingredient.length === 0 ? (
        showFavourites ? (
          <section className="main-section">
            <h2 className="sub-heading">Favourites Page</h2>
            {favouriteArr.length === 0 ? (
              <h5 className="fav-err-msg">You Currently Have No favourites</h5>
            ) : (
              <div className="card-container">
                {favouriteArr.map((fav, i) => {
                  console.log(fav.title);
                  return (
                    <Card
                      key={i}
                      title={fav.title}
                      img={fav.image}
                      icon=<HeartIcon className="fa-solid fa-heart fa-2xl" />
                      favourites={() => addToFavourites(fav.id)}
                      onClick={() => getIngredients(fav.id)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="main-section">
            {errorMessage === "" && <h2 className="sub-heading">{search}</h2>}

            <div className="card-container">
              {recipes.slice(0, numberOfItems).map((food, i) => {
                return (
                  <Card
                    key={i}
                    title={food.title}
                    img={food.image}
                    icon={
                      favouriteArr.find((recipe) => recipe.id === food.id) ? (
                        <HeartIcon className="fa-solid fa-heart fa-beat fa-2xl" />
                      ) : (
                        <HeartIcon className="fa-heart fa-regular fa-2xl" />
                      )
                    }
                    favourites={() => addToFavourites(food.id)}
                    onClick={() => getIngredients(food.id)}
                  />
                );
              })}
            </div>
            {numberOfItems < recipes.length && (
              <div className="load">
                <button onClick={getMoreRecipes} className="load-btn">
                  Load More
                </button>
              </div>
            )}
          </section>
        )
      ) : (
        /* Else render the in Page */

        <div className="instructions-container">
          <IngredientsHeader
            title={ingredients.title}
            src={ingredients.image}
            alt={ingredients.title}
          />

          <section className="nutrition-info">
            <div className="ingredients-list">
              <h3>Ingredients</h3>
              {ingredients.ingredient.map((food, i) => {
                return <li key={i}>{food.original}</li>;
              })}
            </div>

            <Nutritiontable
              carbs={ingredients.nutritions.carbs}
              protein={ingredients.nutritions.protein}
              fat={ingredients.nutritions.fat}
              cals={ingredients.nutritions.calories}
            />
          </section>
          <div className="instructions">
            <h3>Instructions</h3>
            <ol>
              {ingredients.instructions.map((step) => {
                return <li>{step.step}</li>;
              })}
            </ol>
          </div>
          <div className="extra-info">
            <p>Serves {ingredients.servings} People</p>
            <p>Cook Duration: {ingredients.timeToCook} Minutes</p>
          </div>
          <button className="back-btn" onClick={goBack}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
