import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import PageLoader from "../components/PageLoader.jsx";
import { useCharacterStore } from "../hooks/useCharacters.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  const { storageFull } = useCharacterStore();

  return (
    <div className="app">
      <ScrollToTop />
      <NavBar />

      <main className="container page">
        {storageFull && (
          <p className="banner" role="alert">
            Browser storage is full, so added characters will be lost after a reload. Try a smaller
            photo.
          </p>
        )}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="muted">
            Data from the public{" "}
            <a href="https://rickandmortyapi.com/" target="_blank" rel="noreferrer">
              Rick and Morty API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
