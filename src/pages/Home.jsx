import { Link } from "react-router-dom";
import CharacterImage from "../components/CharacterImage.jsx";

const HERO_CHARACTERS = [
  { id: 1, name: "Rick Sanchez" },
  { id: 2, name: "Morty Smith" },
  { id: 3, name: "Summer Smith" },
];

const FEATURES = [
  {
    to: "/characters",
    title: "Browse characters",
    text: "Search, filter, sort and open every character from the series.",
  },
  {
    to: "/dashboard",
    title: "See the statistics",
    text: "Counts, shares and breakdowns by status, species and gender.",
  },
  {
    to: "/characters/new",
    title: "Add your own",
    text: "Create a new character with a photo. It is saved in your browser.",
  },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>Rick and Morty Characters</h1>
          <p className="hero-lead">
            A directory of more than 800 characters from the multiverse. Explore them, filter them
            and look at the numbers behind the show.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/characters">
              Browse characters
            </Link>
            <Link className="btn" to="/dashboard">
              Open dashboard
            </Link>
          </div>
        </div>

        <div className="hero-images">
          {HERO_CHARACTERS.map((character) => (
            <CharacterImage
              key={character.id}
              src={`https://rickandmortyapi.com/api/character/avatar/${character.id}.jpeg`}
              name={character.name}
              className="hero-image"
            />
          ))}
        </div>
      </section>

      <section className="feature-grid" aria-label="Where to go next">
        {FEATURES.map((feature) => (
          <Link key={feature.to} className="feature-card" to={feature.to}>
            <h2>{feature.title}</h2>
            <p className="muted">{feature.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
