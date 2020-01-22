import React, { useState, useEffect } from "react";

export default function Cell(props) {
  const [val, setVal] = useState(null);

  useEffect(() => {
    const { value } = props;
    //Display value accordingly!
    if (value.isRevealed && value.isMine) {
      setVal("B");
    }
    if (value.isRevealed && !value.isMine) {
      setVal(value.neighbour);
    }
    if (!value.isRevealed && value.isFlagged) {
      setVal("F");
    }
    if (!value.isRevealed && !value.isFlagged) {
      setVal(null);
    }
    
  }, [props]);

  function assignClassName() {
    let className =
      "cell" +
      (props.value.isRevealed ? "" : " hidden") +
      (props.value.isMine ? " is-mine" : "") +
      (props.value.isFlagged ? " is-flag" : "");
    return className;
  }

  return (
    <div className={assignClassName()} onClick={props.onClick} onContextMenu={props.onContextMenu}>
      {val}
    </div>
  );
}
