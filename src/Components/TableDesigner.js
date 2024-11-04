// src/components/TableDesigner.js
import React, { useState } from "react";
import Card from "./Card";
import LeaderLine from "react-leader-line";

const TableDesigner = () => {
  const [cards, setCards] = useState([]);
  const [relations, setRelations] = useState([]);
  const [lines, setLines] = useState([]);

  const addCard = () => {
    const newCard = { id: Date.now(), title: "New Table", rows: [] };
    setCards([...cards, newCard]);
  };

  const updateCardTitle = (id, title, parent) => {
    title = title.replaceAll(" ", "_").trim();
    title = title.startsWith("_") ? title.substr(1) : title;
    for (var item of relations) {
      if (item.firstChild) {
        if (item.firstChild.textContent === title + "Id") {
          var d = lines.filter((item, _) => item.start === item);
          if (d.length === 0) {
            var line = new LeaderLine(item, parent, { startPlug: "disc" });
            document
              .querySelector("svg.leader-line:last-of-type")
              .addEventListener(
                "mouseup",
                function (e) {
                  if (e.button === 2) {
                    setLines(lines.filter((item, _) => item !== line));
                    line.remove();
                  }
                },
                false
              );
            setLines([...lines, line]);
          }
        }
      }
    }
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

  return (
    <div
      className="table-designer"
      style={{
        width: "max-content",
      }}
    >
      <button onClick={addCard}>Add Table</button>

      {cards.map((card, index) => (
        <Card
          relIds={(e) => setRelations([relations, ...e])}
          onDrag={handleChange}
          key={card.id}
          id={card.id}
          title={card.title}
          onTitleChange={updateCardTitle}
          onAddRow={addRowToCard}
          onChange={handleChange}
          onRemove={() => handleRemove(index)}
        />
      ))}
    </div>
  );
};

export default TableDesigner;
