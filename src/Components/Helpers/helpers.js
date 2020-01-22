export const getRandomNumber = area => {
  return Math.floor(Math.random() * 1000 + 1) % area;
};

const traverseBoard = (x, y, data, height, width) => {
  const el = [];

  //up
  if (x > 0) {
    el.push(data[x - 1][y]);
  }

  //down
  if (x < height - 1) {
    el.push(data[x + 1][y]);
  }

  //left
  if (y > 0) {
    el.push(data[x][y - 1]);
  }

  //right
  if (y < width - 1) {
    el.push(data[x][y + 1]);
  }

  // top left
  if (x > 0 && y > 0) {
    el.push(data[x - 1][y - 1]);
  }

  // top right
  if (x > 0 && y < width - 1) {
    el.push(data[x - 1][y + 1]);
  }

  // bottom right
  if (x < height - 1 && y < width - 1) {
    el.push(data[x + 1][y + 1]);
  }

  // bottom left
  if (x < height - 1 && y > 0) {
    el.push(data[x + 1][y - 1]);
  }
  return el;
};

export const getMineNumber = (data, height, width) => {
  let updatedData = data;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      //Get the mines away
      if (data[i][j].isMine !== true) {
        let mine = 0;
        const boardArea = traverseBoard(data[i][j].x, data[i][j].y, data, height, width);
        boardArea.forEach(value => {
          if (value.isMine === true) {
            mine++;
          }
        });
        updatedData[i][j].neighbour = mine;
        if (mine === 0) {
          updatedData[i][j].isEmpty = true;
        }
      }
    }
  }
  return updatedData;
};

export const revealBoard = data => {
  let updatedData = data;
  updatedData.map(datarow => {
    datarow.map(dataitem => {
      dataitem.isRevealed = true;
    });
  });
  return updatedData;
};

export const getUnrevealedData = data => {
  // get Unrevealed cells
  let mineArray = [];
  data.map(datarow => {
    datarow.map(dataitem => {
      if (!dataitem.isRevealed) {
        mineArray.push(dataitem);
      }
    });
  });
  return mineArray;
};

export const getEmptyCells = (x, y, data, height, width) => {
  const boardArea = traverseBoard(x, y, data, height, width);
  boardArea.map(cell => {
    if (!cell.isFlagged && !cell.isRevealed && (cell.isEmpty || !cell.isMine)) {
      data[cell.x][cell.y].isRevealed = true;
      if (cell.isEmpty) {
        getEmptyCells(cell.x, cell.y, data, height, width);
      }
    }
  });
  return data;
};
