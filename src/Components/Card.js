// src/components/Card.js
import React, { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";

const Card = ({
  id,
  title,
  relIds,
  onTitleChange,
  onAddRow,
  onDrag,
  onChange,
  onRemove,
}) => {
  const [rows, setRows] = useState([]);
  const [relId, setRelId] = useState([]);
  const [inputTitle, setInputTitle] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [newRowText, setNewRowText] = useState("");
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const cardBodyRef = useRef(null);
  useEffect(()=>{
      onChange()
  },[rows,inputTitle,showAddRow,editingRowIndex])

  const handleRowChange = (e, index) => {
    const updatedRows = [...rows];
    updatedRows[index] = e.target.value;
    setRows(updatedRows);
  };

  const handleTitleEnter = (e) => {
    if (e.code === "Enter") {
      setInputTitle(false);
      setShowAddRow(true);
    }
  };

  const addRow = () => {
    setRows([...rows, newRowText]);
    setNewRowText("");
    onAddRow(id, newRowText); // اطلاع دادن به والد
  };

  useEffect(() => {
    var item =
      cardBodyRef.current.children[cardBodyRef.current.children.length - 2];
    if (item) {
      var n = item.querySelector("span").textContent;
      if (n.endsWith("Id") && n.length > 2) {
        relId.push(item)
        setRelId(relId);
        relIds(relId);
      }
    }
  }, [rows]);

  return (
    <Draggable
      onDrag={(e) => onDrag(e)}
      {...(inputTitle
        ? { cancel: ".card-header" }
        : { handle: ".card-header" })}
    >
      <div
        className="card"
        style={{ position: "absolute", width: "max-content", top: "100px" }}
      >
        <div
          role="button"
          className="card-header"
          onDoubleClick={(e) => setInputTitle(true)}
        >
          {inputTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => onTitleChange(id, e.target.value,e.target.parentNode.parentNode)}
              onKeyUp={(e) => handleTitleEnter(e)}
              onBlur={(e) => setInputTitle(false)}
              onFocus={(e) =>
                e.target.value === "New Table" && e.target.select()
              }
            />
          ) : (
            <>
              <span>{title}</span>
              <div className="ms-3 float-end d-flex ">
                <button
                  href="#"
                  className="float-start circle-button-primary p-1"
                  onClick={(e) => setShowAddRow(true)}
                >
                  +
                </button>

                <button
                  className="float-end circle-button-danger ms-1 p-1"
                  onClick={(e) => onRemove()}
                >
                  &times;
                </button>
              </div>
            </>
          )}
        </div>
        <div className="card-body" ref={cardBodyRef}>
          {rows.map((row, index) => (
            <div key={index} onDoubleClick={() => setEditingRowIndex(index)}>
              {editingRowIndex === index ? (
                <input
                  value={row}
                  onChange={(e) => handleRowChange(e, index)}
                  onKeyUp={(e) =>
                    e.code === "Enter" && setEditingRowIndex(null)
                  }
                  onBlur={() => setEditingRowIndex(null)}
                  autoFocus
                />
              ) : (
                <span role="button">{row}</span>
              )}
            </div>
          ))}
          {showAddRow && (
            <input
              autoFocus
              value={newRowText}
              onChange={(e) => setNewRowText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRow()}
              onBlur={(e) => setShowAddRow(false)}
              placeholder="Add a row"
            />
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Card;
