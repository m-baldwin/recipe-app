import React, { useState } from "react";
import Card from "./Card";

function Favourites() {
  const [favouriteArr, setFavouriteArr] = useState([]);

  function addToFavourites() {}
  return (
    <section>
      <div>
        <h1>Favourites</h1>
      </div>
      <div>
        {favouriteArr.map((fav) => {
          return <Card />;
        })}
      </div>
    </section>
  );
}

export default Favourites;
