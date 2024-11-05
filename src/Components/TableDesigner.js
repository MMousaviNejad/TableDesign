// src/components/TableDesigner.js
import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import LeaderLine from "react-leader-line";

const TableDesigner = () => {
  const cardsRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [relations, setRelations] = useState([]);
  const [lines, setLines] = useState([]);

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      title: "New Table",
      rows: [],
      transform: { x: 0, y: 100 },
    };
    setCards([...cards, newCard]);
  };

  const updateCardTitle = (id, title) => {
    title = title.replaceAll(" ", "_").trim();
    title = title.startsWith("_") ? title.substr(1) : title;
    setCards(cards.map((card) => (card.id === id ? { ...card, title } : card)));
  };

  const addRowToCard = (id, row) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, rows: [...card.rows, row] } : card
      )
    );
  };

  const handleRemove = (index) => {
    setCards(cards.filter((_, i) => i !== index));
    var card = cardsRef.current?.children[index]
    for (var item of lines) {
      if (item.start.parentNode.parentNode === card || item.end === card) {
        setLines(lines.filter((i, _) => i !== item));
        item.remove();
      }
    }
  };

  const handleChange = () => {
    for (var item of lines) {
      if (!item.start || !item.end) {
        setLines(lines.filter((i, _) => i !== item));
        item.remove();
      } else {
        item.position();
      }
    }
  };

  const saveTables = () => {
    const name = prompt("Enter a name for your tables:");
    if (name) {
      var crd = [];
      for (var item of cards) {
        var index = cards.findIndex((x) => x === item);
        var transform = cardsRef.current.children[
          index
        ].style.transform.replace("translate(", "");
        var x = transform.substr(0, transform.indexOf("px"));
        transform = transform.substr(transform.indexOf(", ") + 2);
        var y = transform.substr(0, transform.lastIndexOf("px"));
        item.transform = { x: x, y: y };
        crd.push(item);
      }
      localStorage.setItem(`tables_${name}`, JSON.stringify(crd));
      setCards(crd);
      alert("Tables saved successfully!");
    }
  };

  const loadTables = () => {
    const name = prompt("Enter the name to load tables:");
    if (name) {
      const savedTables = localStorage.getItem(`tables_${name}`);
      if (savedTables) {
        setRelations([])
        setLines([])
        setCards(JSON.parse(savedTables));
        alert("Tables loaded successfully!");
      } else {
        alert("No saved tables found with this name.");
      }
    }
  };

  const handleEndTitleEdit = (e, title) => {
    var ls = lines
    for (var item of relations) {
      if (item.firstChild) {
        if (item.firstChild.textContent === title + "Id") {
          var d = ls.filter((item, _) => item.start === item);
          if (d.length === 0) {
            var line = new LeaderLine(item, e, { startPlug: "disc" });
            document
              .querySelector("svg.leader-line:last-of-type")
              .addEventListener(
                "contextmenu",
                function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  setLines(lines.filter((item, _) => item !== line));
                  line.remove();
                },
                false
              );
            ls.push(line)
          }
        }
      }
    }
    setLines(ls);
  }

  const handleRelation = (e) => {
    var rels = relations
    for(var item of e){
      if (!rels.includes(item)){
        rels.push(item)
      }
    }
    setRelations(rels)
  }

  return (
    <div
      className="table-designer"
      style={{
        width: "max-content",
      }}
    >
      <button className="btn btn-primary m-2" onClick={addCard}>
        Add Table
      </button>
      <button className="btn btn-primary m-2" onClick={saveTables}>
        Save Tables
      </button>
      <button className="btn btn-primary m-2" onClick={loadTables}>
        Load Tables
      </button>
      <div ref={cardsRef}>
        {cards.map((card, index) => (
          <Card
            editTitleEnd={handleEndTitleEdit}
            relIds={handleRelation}
            onDrag={handleChange}
            key={card.id}
            id={card.id}
            title={card.title}
            rowsData={card.rows}
            onTitleChange={updateCardTitle}
            onAddRow={addRowToCard}
            onChange={handleChange}
            onRemove={() => handleRemove(index)}
            transform={{
              x: parseInt(card.transform.x),
              y: parseInt(card.transform.y),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TableDesigner;
