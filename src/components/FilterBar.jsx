import React, { useState } from "react";

export default function FilterBar({ tags, setActiveTag }) {
  const [selected, setSelected] = useState(null);

  const handle = (tag) => {
    const newTag = tag === selected ? null : tag;
    setSelected(newTag);
    setActiveTag(newTag);
  };

  return (
    <div className="filterbar">
      <button onClick={() => handle(null)} className={!selected ? "selected" : ""}>All</button>
      {tags.map(t => (
        <button
          key={t}
          onClick={() => handle(t)}
          className={selected === t ? "selected" : ""}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
