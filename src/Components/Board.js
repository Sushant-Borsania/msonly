import React, { useState, useEffect } from "react";
import {
  getRandomNumber,
  getMineNumber,
  revealBoard,
  getUnrevealedData,
  getEmptyCells
} from "./Helpers/helpers";
import Cell from "./Cell";
export default function Board(props) {
  const [boardData, setBoardData] = useState(null);
  const [mineCount, setMineCount] = useState(props.mines);
  const [gameStatus, setGameStatus] = useState("In progress");
  const [count, setCount] = useState(0);

  //Getting board ready with mines and mine number surrounding the cell
  useEffect(() => {
    let data = [];
    let randomX = 0;
    let randomY = 0;
    //Creating nested array - representing the board
    for (let i = 0; i < props.height; i++) {
      data.push([]);
      for (let j = 0; j < props.width; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
          displayItem: null
        };
      }
    }
    //Adding mines randomly
    for (let i = 0; i < props.mines; i++) {
      randomX = getRandomNumber(props.width);
      randomY = getRandomNumber(props.height);
      if (!data[randomX][randomY].isMine) {
        data[randomX][randomY].isMine = true;
      } else {
        i--;
      }
    }
    setBoardData(data);
  }, [props]);

  useEffect(() => {
    //Getting Mine numbers for cell to display
    if (boardData !== null) {
      const data = getMineNumber(boardData, props.height, props.width);
      setBoardData(data);
    }
  }, [boardData, props.height, props.width]);

  //Handle left click for the cell
  function handleCellClick(x, y) {
    //Take out a copy of data
    let updatedData = boardData;

    //Check if Mine and gameOver
    if (updatedData[x][y].isMine) {
      updatedData = revealBoard(updatedData);
      setBoardData(updatedData);
      setGameStatus("Game Over");
    // } else {
    } 
      //Continue game with additional options
      updatedData[x][y].isFlagged = false;
      updatedData[x][y].isRevealed = true;
      // Get all the empty cell  - should not be revealed, should not be mine and should be empty
      if (updatedData[x][y].isEmpty) {
        updatedData = getEmptyCells(x, y, updatedData, props.height, props.width);
      }

      if (getUnrevealedData(updatedData).length === mineCount) {
        revealBoard(updatedData);
        setGameStatus("You win");
        setBoardData(updatedData);
      }
    setCount(count + 1);
  }

  //Handle Right Click
  function onContextMenu(e, x, y) {
    //Preventing default behaviour otherwise regular menu opens!
    e.preventDefault();
    //Take a copy of state
    let updatedData = boardData;
    if (updatedData[x][y].isRevealed) {
      return true;
    }

    if (!updatedData[x][y].isRevealed && !updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = true;
      setMineCount(mineCount - 1);
    } else if (!updatedData[x][y].isRevealed && updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      setMineCount(mineCount + 1);
    } else {
      updatedData[x][y].isFlagged = false;
      setMineCount(mineCount + 1);
    }
    //Check if all mines are flagged
    if (mineCount <= 1) {
      let mineCells = [];
      let flagCells = [];
      //Getting the mine cells
      updatedData.map(datarow => {
        datarow.map(dataitem => {
          if (dataitem.isMine) {
            mineCells.push(dataitem);
          }
        });
      });

      //Getting the flaged cells to compare
      updatedData.map(datarow => {
        datarow.map(dataitem => {
          if (dataitem.isFlagged) {
            flagCells.push(dataitem);
          }
        });
      });

      //Compare two arrays
      if (JSON.stringify(mineCells) === JSON.stringify(flagCells)) {
        setGameStatus("You win");
        updatedData = revealBoard(updatedData);
        setBoardData(updatedData);
      }
    }
  }

  //Drawing the board
  function drawBoard(data) {
    if (data !== null) {
      return data.map(datarow => {
        return datarow.map(dataitem => {
          return (
            <div key={dataitem.x * datarow.length + dataitem.y}>
              <Cell
                onClick={() => handleCellClick(dataitem.x, dataitem.y)}
                onContextMenu={e => onContextMenu(e, dataitem.x, dataitem.y)}
                value={dataitem}
              />
              {datarow[datarow.length - 1] === dataitem ? <div className="clear" /> : ""}
            </div>
          );
        });
      });
    }
  }

  return (
    <div className="board">
      <div className="game-info">
        <p>Mine Count: {mineCount}</p>
        <p>Game Status: {gameStatus}</p>
      </div>
      {drawBoard(boardData)}
    </div>
  );
}
