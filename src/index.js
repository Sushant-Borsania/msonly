import React, { useState } from "react";
import ReactDOM from "react-dom";
import Board from "./Components/Board";
import "../src/index.scss";

const Game = () => {
  const [height, setHeight] = useState(16);
  const [width, setWidth] = useState(16);
  const [mines, setMines] = useState(40);

  return (
    <div className="game">
      <Board height={height} width={width} mines={mines} />
    </div>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));
