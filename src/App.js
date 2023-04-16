import React, { useEffect, useState } from "react";

import Card from "./components/Card";
import Header from "./components/Header";
import Nutritiontable from "./components/NutritionTable";
import IngredientsHeader from "./components/IngredientsHeader";
import Favourites from "./components/Favourites";

function App() {
  const apiKey = "0c2f184d291646fe96d86bcc9ba52623";

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [showFavourites, setShowFavourites] = useState(false);
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

  function toggleFavouritePage() {
    return setShowFavourites(!showFavourites);
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    setNumberOfItems(10); // this line to reset numberOfItems to 10

    fetch(
      search === ""
        ? `https://api.spoonacular.com/recipes/complexSearch?sort=random&number=1`
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
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        } else {
          setRecipes(result.results);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [apiKey, search]);

  return (
    <div className="app">
      <Header
        setIngredients={setIngredients}
        setSearch={setSearch}
        error={errorMessage}
        onClick={toggleFavouritePage}
        setShowFavourites={setShowFavourites}
      />

      {/* Render the favourites page */}
      {showFavourites ? (
        <Favourites />
      ) : /* Else render the main Page */
      ingredients.ingredient.length === 0 ? (
        <>
          <div className="card-container">
            {recipes.slice(0, numberOfItems).map((food, i) => {
              return (
                <Card
                  key={i}
                  title={food.title}
                  img={food.image}
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
        </>
      ) : (
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
            Go back
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
