import React from "react";

function Nutritiontable(props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Carbohydrates</th>
          <th>protein</th>
          <th>Fat</th>
          <th>Calories</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.carbs}</td>
          <td>{props.protein}</td>
          <td>{props.fat}</td>
          <td>{props.cals}kcal</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Nutritiontable;
