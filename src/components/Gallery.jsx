import React, { useMemo, useState } from "react";
import ImageCard from "./ImageCard";

export default function Gallery({ images = [], toggleFav, deleteImage, getFavs }) {
  const [q, setQ] = useState("");
  const favs = useMemo(() => (getFavs ? getFavs() : []), [getFavs]);

  const filtered = images.filter((img) => {
    if (!q) return true;
    const safeSrc = (img.src || "").toLowerCase();
    const safeTags = (img.tags ? img.tags.join(" ") : "").toLowerCase();
    const safeQuery = q.toLowerCase();
    return safeSrc.includes(safeQuery) || safeTags.includes(safeQuery);
  });

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <input className="search" placeholder="Search tags or image URL..." value={q} onChange={e => setQ(e.target.value)} />
        <div style={{ alignSelf: "center", color: "#666" }}>{filtered.length} photos</div>
      </div>

      <div className="grid">
        {filtered.length === 0 && <p className="empty">No images found.</p>}
        {filtered.map(img => (
          <ImageCard
            key={img.id}
            img={img}
            isFav={favs.includes(img.id)}
            toggleFav={() => toggleFav(img.id)}
            deleteImage={() => deleteImage(img.id)}
          />
        ))}
      </div>
    </section>
  );
}
