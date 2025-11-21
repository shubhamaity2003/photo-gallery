import React, { useMemo } from "react";
import ImageCard from "./ImageCard";

export default function Favorites({ images = [], getFavs, toggleFav, deleteImage }) {
  const favs = useMemo(() => (getFavs ? getFavs() : []), [getFavs]);
  const favImages = images.filter(i => favs.includes(i.id));

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Your Favorites</h2>
      <div className="grid">
        {favImages.length === 0 && <p className="empty">No favorites yet. Click the star on any image to add it.</p>}
        {favImages.map(img => (
          <ImageCard
            key={img.id}
            img={img}
            isFav={true}
            toggleFav={() => toggleFav(img.id)}
            deleteImage={() => deleteImage(img.id)}
          />
        ))}
      </div>
    </section>
  );
}
