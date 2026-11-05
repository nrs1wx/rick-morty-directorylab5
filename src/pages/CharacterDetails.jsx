import { Link, useLocation, useParams } from "react-router-dom";
import CharacterImage from "../components/CharacterImage.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useCharacter from "../hooks/useCharacter.js";
import { formatDate } from "../utils/format.js";

function firstSeenText(character, episode) {
  if (!character.firstEpisodeUrl) return "—";
  if (!episode || episode.status === "loading") return "Loading…";
  if (episode.status === "failed") return "Unavailable";
  const { code, name, airDate } = episode.data;
  return `${code} · ${name} (${airDate})`;
}

function CharacterContent({ id, status, character, episode, error, reload }) {
  if (status === "loading") {
    return <StatusMessage type="loading" message="Loading character…" />;
  }

  if (status === "error") {
    return <StatusMessage type="error" message={error} actionLabel="Try again" onAction={reload} />;
  }

  if (status === "notfound") {
    return (
      <StatusMessage type="empty" message="Character not found. Check the address and try again.">
        <Link className="btn btn-primary" to="/characters">
          All characters
        </Link>
        <Link className="btn" to="/">
          Home
        </Link>
      </StatusMessage>
    );
  }

  const numericId = /^\d+$/.test(id) ? Number(id) : null;

  return (
    <div className="character-layout">
      <CharacterImage
        key={character.id}
        src={character.image}
        name={character.name}
        className="character-image"
      />

      <div className="character-info">
        <h1>{character.name}</h1>
        <span className={`badge badge-${character.status.toLowerCase()}`}>{character.status}</span>

        <dl className="fields">
          <div>
            <dt>ID</dt>
            <dd>{numericId !== null ? `#${numericId}` : "Added by you"}</dd>
          </div>
          <div>
            <dt>Species</dt>
            <dd>{character.species}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{character.type || "—"}</dd>
          </div>
          <div>
            <dt>Gender</dt>
            <dd>{character.gender}</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>{character.origin.name}</dd>
          </div>
          <div>
            <dt>Last known location</dt>
            <dd>{character.location.name}</dd>
          </div>
          <div>
            <dt>Episodes</dt>
            <dd>{character.episodeCount}</dd>
          </div>
          <div>
            <dt>First seen in</dt>
            <dd>{firstSeenText(character, episode)}</dd>
          </div>
          <div>
            <dt>Added to database</dt>
            <dd>{formatDate(character.created)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function CharacterDetails() {
  const { id } = useParams();
  const location = useLocation();
  const result = useCharacter(id);

  const backTo = location.state?.from ?? "/characters";
  const numericId = /^\d+$/.test(id) ? Number(id) : null;

  return (
    <article className="character-page">
      <nav className="character-nav" aria-label="Character navigation">
        <Link className="btn" to={backTo}>
          ← Back
        </Link>
        <Link className="btn" to="/characters">
          All characters
        </Link>
        {numericId !== null && numericId > 1 && (
          <Link className="btn" to={`/characters/${numericId - 1}`}>
            Previous
          </Link>
        )}
        {numericId !== null && (
          <Link className="btn" to={`/characters/${numericId + 1}`}>
            Next
          </Link>
        )}
      </nav>

      <CharacterContent id={id} {...result} />
    </article>
  );
}
