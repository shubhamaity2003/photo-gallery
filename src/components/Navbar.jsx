import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ currentUser, logout, uploadForUser }) {
  const loc = useLocation();
  const inputRef = useRef();

  const handleUploadClick = () => {
    if (!currentUser) {
      alert("Please login to upload images.");
      return;
    }
    inputRef.current?.click();
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readers = files.map(file => new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(file);
    }));
    Promise.all(readers).then(dataUrls => {
      const res = uploadForUser(dataUrls);
      if (!res.ok) alert(res.message || "Uploaded");
      else alert("Uploaded to your gallery");
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">PhotoAlbum</Link>
        <Link to="/" className={loc.pathname === "/" ? "active" : ""}>Gallery</Link>
        <Link to="/favorites" className={loc.pathname === "/favorites" ? "active" : ""}>Favorites</Link>
      </div>

      <div className="nav-right">
        <button className="btn" onClick={handleUploadClick}>Upload</button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          style={{ display: "none" }}
        />

        {currentUser ? (
          <>
            <span className="user-badge">Hi, {currentUser}</span>
            <button className="btn secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn small">Login</Link>
            <Link to="/signup" className="btn small secondary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
