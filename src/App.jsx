import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Gallery from "./components/Gallery";
import Favorites from "./components/Favorites";
import Login from "./components/Login";
import Signup from "./components/Signup";
import IMAGES from "./data/images";
import "./App.css";

/* Storage keys */
const USERS_KEY = "demo_users";
const CURRENT_USER = "demo_current_user";

function App() {
  const [users, setUsers] = useState(() => {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem(CURRENT_USER) || null;
  });

  // seed images (static import)
  const [seedImages] = useState(IMAGES);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(CURRENT_USER, currentUser);
    else localStorage.removeItem(CURRENT_USER);
  }, [currentUser]);

  /* Register & login */
  const register = (username, password) => {
    if (users[username]) return { ok: false, message: "User already exists" };
    const newUsers = { ...users, [username]: { password } };
    setUsers(newUsers);

    // initialize user storage
    localStorage.setItem(`images_${username}`, JSON.stringify([]));
    localStorage.setItem(`favs_${username}`, JSON.stringify([]));
    localStorage.setItem(`deleted_${username}`, JSON.stringify([]));

    setCurrentUser(username);
    return { ok: true };
  };

  const login = (username, password) => {
    if (!users[username]) return { ok: false, message: "User not found" };
    if (users[username].password !== password) return { ok: false, message: "Wrong password" };
    setCurrentUser(username);
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  /* Helpers to read user storage */
  const _getUserUploads = (username) => {
    const raw = localStorage.getItem(`images_${username}`);
    return raw ? JSON.parse(raw) : [];
  };

  const _getDeleted = (username) => {
    const raw = localStorage.getItem(`deleted_${username}`);
    return raw ? JSON.parse(raw) : [];
  };

  const _getFavs = (username) => {
    const raw = localStorage.getItem(`favs_${username}`);
    return raw ? JSON.parse(raw) : [];
  };

  /* Combined images for user: seed + uploads - deleted */
  const getUserImages = (username) => {
    const uploads = _getUserUploads(username);
    const deleted = _getDeleted(username);
    // include seed images except those in deleted
    const visibleSeed = seedImages.filter(i => !deleted.includes(i.id));
    return [...visibleSeed, ...uploads];
  };

  /* Upload images for user: dataUrls array */
  const uploadForUser = (username, dataUrls) => {
    const key = `images_${username}`;
    const existing = _getUserUploads(username);
    const newImages = dataUrls.map((src, i) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2,9)}_${i}`,
      src,
      tags: ["user"]
    }));
    const updated = [...existing, ...newImages];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  };

  /* Toggle favorite for user */
  const toggleFav = (username, imgId) => {
    const key = `favs_${username}`;
    const raw = localStorage.getItem(key);
    const favs = raw ? JSON.parse(raw) : [];
    const updated = favs.includes(imgId) ? favs.filter(x => x !== imgId) : [...favs, imgId];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  };

  /* Delete image: if it's uploaded by user, remove from their uploads;
     if it's a seed image, add to user's deleted list so it won't show for them.
     Also remove from user's favorites. */
  const deleteImage = (username, imgId) => {
    // remove from uploads if present
    const uploadKey = `images_${username}`;
    const uploads = _getUserUploads(username);
    const remainingUploads = uploads.filter(img => img.id !== imgId);
    localStorage.setItem(uploadKey, JSON.stringify(remainingUploads));

    // if not found in uploads and exists in seed, add to deleted list
    const isSeed = seedImages.some(i => i.id === imgId);
    if (isSeed) {
      const delKey = `deleted_${username}`;
      const deleted = _getDeleted(username);
      if (!deleted.includes(imgId)) {
        const updatedDeleted = [...deleted, imgId];
        localStorage.setItem(delKey, JSON.stringify(updatedDeleted));
      }
    }

    // remove from favorites
    const favKey = `favs_${username}`;
    const favs = _getFavs(username).filter(id => id !== imgId);
    localStorage.setItem(favKey, JSON.stringify(favs));

    return { uploads: remainingUploads, deleted: _getDeleted(username), favs };
  };

  return (
    <Router>
      <Navbar
        currentUser={currentUser}
        logout={logout}
        uploadForUser={(files) => {
          if (!currentUser) return { ok: false, message: "Login first" };
          const updated = uploadForUser(currentUser, files);
          return { ok: true, updated };
        }}
      />

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                <Gallery
                  images={getUserImages(currentUser)}
                  toggleFav={(id) => toggleFav(currentUser, id)}
                  deleteImage={(id) => deleteImage(currentUser, id)}
                  getFavs={() => _getFavs(currentUser)}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/favorites"
            element={
              currentUser ? (
                <Favorites
                  images={getUserImages(currentUser)}
                  toggleFav={(id) => toggleFav(currentUser, id)}
                  deleteImage={(id) => deleteImage(currentUser, id)}
                  getFavs={() => _getFavs(currentUser)}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={<Login onLogin={login} onSuccess={(u) => setCurrentUser(u)} />}
          />

          <Route
            path="/signup"
            element={<Signup onSignup={register} onSuccess={(u) => setCurrentUser(u)} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
