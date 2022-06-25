import React from "react";

const trainingTypes = [
  { type: "squat", name: "приседания" },
  { type: "pushUp", name: "отжимания" },
  { type: "pullUp", name: "подтягивания" },
];

export const Home = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {trainingTypes.map((v) => (
        <div style={{ width: 300, height: 200, border: "1px solid black" }}>
          {v.name}
        </div>
      ))}
    </div>
  );
};
