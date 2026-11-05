import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BarList from "../components/BarList.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useCharacters from "../hooks/useCharacters.js";
import { GENDERS } from "../constants.js";
import { computeStats } from "../utils/stats.js";

export default function Dashboard() {
  const { characters, status, error, isLoading, reload } = useCharacters();
  const [params, setParams] = useSearchParams();

  const species = params.get("species") ?? "all";
  const gender = params.get("gender") ?? "all";

  const speciesList = useMemo(
    () => [...new Set(characters.map((c) => c.species))].sort(),
    [characters]
  );

  const filtered = useMemo(
    () =>
      characters.filter(
        (c) => (species === "all" || c.species === species) && (gender === "all" || c.gender === gender)
      ),
    [characters, species, gender]
  );

  const stats = useMemo(() => computeStats(filtered), [filtered]);

  function handleFilterChange(key, value) {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  function listLink(extra = {}) {
    const query = new URLSearchParams();
    if (species !== "all") query.set("species", species);
    if (gender !== "all") query.set("gender", gender);
    for (const [key, value] of Object.entries(extra)) query.set(key, value);
    const text = query.toString();
    return text ? `/characters?${text}` : "/characters";
  }

  const hasFilters = species !== "all" || gender !== "all";

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Statistics calculated from the character data</p>
        </div>
        <Link className="btn" to={listLink()}>
          {hasFilters ? "Open these characters" : "All characters"}
        </Link>
      </div>

      {isLoading && <StatusMessage type="loading" message="Loading statistics…" />}

      {status === "error" && (
        <StatusMessage type="error" message={error} actionLabel="Try again" onAction={reload} />
      )}

      {status === "success" && (
        <>
          <div className="controls dashboard-filters" role="group" aria-label="Statistics filters">
            <select
              aria-label="Filter statistics by species"
              value={species}
              onChange={(e) => handleFilterChange("species", e.target.value)}
            >
              <option value="all">All species</option>
              {speciesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter statistics by gender"
              value={gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <option value="all">All genders</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn"
              disabled={!hasFilters}
              onClick={() => setParams({}, { replace: true })}
            >
              Reset
            </button>
          </div>

          {stats.total === 0 ? (
            <StatusMessage
              type="empty"
              message="No characters match these filters."
              actionLabel="Reset filters"
              onAction={() => setParams({}, { replace: true })}
            />
          ) : (
            <>
              <div className="stats-grid">
                <StatCard
                  label="Characters"
                  value={stats.total}
                  hint={hasFilters ? "matching the filters" : "in the directory"}
                  to={listLink()}
                />
                <StatCard
                  label="Alive"
                  value={`${stats.aliveShare}%`}
                  hint={`${stats.alive} characters`}
                  to={listLink({ status: "Alive" })}
                />
                <StatCard
                  label="Species"
                  value={stats.speciesCount}
                  hint="different kinds"
                />
                <StatCard
                  label="Average episodes"
                  value={stats.averageEpisodes.toFixed(1)}
                  hint="per character"
                />
                <StatCard
                  label="Most featured"
                  value={stats.mostFeatured.name}
                  hint={`${stats.mostFeatured.episodeCount} episodes`}
                  to={`/characters/${stats.mostFeatured.id}`}
                />
              </div>

              <div className="breakdowns">
                <BarList
                  title="By status"
                  total={stats.total}
                  rows={stats.byStatus.map((row) => ({
                    ...row,
                    to: listLink({ status: row.label }),
                  }))}
                />
                <BarList
                  title="By gender"
                  total={stats.total}
                  rows={stats.byGender.map((row) => ({
                    ...row,
                    to: listLink({ gender: row.label }),
                  }))}
                />
                <BarList
                  title="Top species"
                  total={stats.total}
                  rows={stats.bySpecies.slice(0, 8).map((row) => ({
                    ...row,
                    to: listLink({ species: row.label }),
                  }))}
                />
              </div>

              <section className="panel" aria-label="Most featured characters">
                <h2>Most featured characters</h2>
                <ol className="top-list">
                  {stats.topFeatured.map((character) => (
                    <li key={character.id}>
                      <Link to={`/characters/${character.id}`}>{character.name}</Link>
                      <span className="muted">{character.episodeCount} episodes</span>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}
        </>
      )}
    </section>
  );
}
