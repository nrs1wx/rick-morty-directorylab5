import { Link } from "react-router-dom";

const FEATURES = [
  "List of characters with search, three filters, sorting and pagination",
  "Filters are stored in the URL, so a link always opens the same view",
  "Character page with details loaded by ID, including the first episode",
  "Dashboard with statistics and breakdowns that react to filters",
  "Form for adding your own character with a photo, saved in localStorage",
  "Loading, error, empty and not found states on every page",
];

const TECH = [
  "React 18 and React Router 6 (nested routes, dynamic URLs, useSearchParams)",
  "React.lazy and Suspense for lazy loading pages",
  "Context and custom hooks for shared data",
  "Vite, plain CSS, fetch with retries and cancellation",
];

export default function About() {
  return (
    <div className="prose">
      <h1>About the project</h1>
      <p>
        This is a single page application built for a React course. It shows how routing,
        shared state and asynchronous requests work together in a real project.
      </p>

      <h2>What you can do</h2>
      <ul>
        {FEATURES.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Technology</h2>
      <ul>
        {TECH.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Data</h2>
      <p>
        All characters come from the public{" "}
        <a href="https://rickandmortyapi.com/documentation" target="_blank" rel="noreferrer">
          Rick and Morty API
        </a>
        . Characters you add yourself are stored only in your browser.
      </p>

      <p className="prose-links">
        <Link className="btn btn-primary" to="/characters">
          Browse characters
        </Link>
        <Link className="btn" to="/">
          Back to home
        </Link>
      </p>
    </div>
  );
}
