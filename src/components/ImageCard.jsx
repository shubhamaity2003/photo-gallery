import React, { useState } from "react";
import ImageModal from "./ImageModal";

export default function ImageCard({ img, isFav, toggleFav, deleteImage }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="card" onClick={() => setOpen(true)} role="button" tabIndex={0}>
        <div className="img-wrap">
          <img src={img.src} alt="" />
        </div>

        <div className="card-info">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFav(); // toggleFav is already a bound function from Gallery
              }}
              aria-label="toggle favorite"
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {isFav ? "★" : "☆"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // confirm delete (optional)
                if (window.confirm("Delete this photo? This will only affect your account.")) {
                  deleteImage();
                }
              }}
              className="btn small danger"
              style={{ marginLeft: 10 }}
            >
              🗑 Delete
            </button>
          </div>
        </div>

        <div className="tag-row">
          {img.tags && img.tags.slice(0,3).map((t, idx) => <span key={idx} className="tag">{t}</span>)}
        </div>
      </div>

      {open && (
  <ImageModal
    img={img}
    close={() => setOpen(false)}
    isFav={isFav}
    toggleFav={() => toggleFav(img.id)}   // FIXED
    deleteImage={() => deleteImage(img.id)} // FIXED
  />
)}

    </>
  );
}
