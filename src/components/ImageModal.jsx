import React from "react";

/* Modal shows larger image and favorite/delete buttons */
export default function ImageModal({ img, close, isFav, toggleFav, deleteImage }) {
  return (
    <div className="modal" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt="large" />

        <div className="modal-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}></h3>

            <div>
              {/* Favorite Button */}
              <button
                onClick={() => toggleFav()}
                className="btn small"
              >
                {isFav ? "Remove Favorite" : "Add to Favorites"}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => {
                  if (window.confirm("Delete this photo?")) {
                    deleteImage();
                    close();
                  }
                }}
                className="btn small danger"
                style={{ marginLeft: 8 }}
              >
                Delete Photo
              </button>

              {/* Close Button */}
              <button
                onClick={close}
                className="btn secondary"
                style={{ marginLeft: 8 }}
              >
                Close
              </button>
            </div>
          </div>

          {img.tags && (
            <p style={{ marginTop: 10, color: "#444" }}>
              Tags: {img.tags.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
