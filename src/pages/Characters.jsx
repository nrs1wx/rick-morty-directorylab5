import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Controls from "../components/Controls.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import Pagination from "../components/Pagination.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useCharacters from "../hooks/useCharacters.js";
import { PAGE_SIZE } from "../constants.js";

export default function Characters() {
  const { characters, status, error, isLoading, reload } = useCharacters();
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const statusFilter = params.get("status") ?? "all";
  const species = params.get("species") ?? "all";
  const gender = params.get("gender") ?? "all";
  const sortBy = params.get("sort") ?? "default";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(query);

  const updateParams = useCallback(
    (changes, { replace = true } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            const isDefault =
              value === "" ||
              value === "all" ||
              value === "default" ||
              (key === "page" && value === 1);
            if (isDefault) next.delete(key);
            else next.set(key, String(value));
          }
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === query) return;

    const timerId = setTimeout(() => {
      updateParams({ q: trimmed, page: 1 });
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchInput, query, updateParams]);

  const speciesList = useMemo(
    () => [...new Set(characters.map((c) => c.species))].sort(),
    [characters]
  );

  const visibleCharacters = useMemo(() => {
    const needle = query.toLowerCase();
    const result = characters.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesSpecies = species === "all" || c.species === species;
      const matchesGender = gender === "all" || c.gender === gender;
      return matchesSearch && matchesStatus && matchesSpecies && matchesGender;
    });

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "episodes-desc":
        result.sort((a, b) => b.episodeCount - a.episodeCount);
        break;
      default:
        break;
    }
    return result;
  }, [characters, query, statusFilter, species, gender, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleCharacters.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = visibleCharacters.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleFilterChange(key, value) {
    updateParams({ [key]: value, page: 1 });
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage }, { replace: false });
    window.scrollTo({ top: 0 });
  }

  function handleReset() {
    setSearchInput("");
    setParams({}, { replace: true });
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Characters</h1>
          <p className="muted">
            {status === "success" ? `${characters.length} characters in the directory` : "Character directory"}
          </p>
        </div>
        <Link className="btn btn-primary" to="/characters/new">
          Add character
        </Link>
      </div>

      {isLoading && (
        <StatusMessage type="loading" message="Loading characters… this can take a few seconds." />
      )}

      {status === "error" && (
        <StatusMessage type="error" message={error} actionLabel="Try again" onAction={reload} />
      )}

      {status === "success" && (
        <>
          <Controls
            search={searchInput}
            onSearchChange={setSearchInput}
            status={statusFilter}
            onStatusChange={(value) => handleFilterChange("status", value)}
            species={species}
            onSpeciesChange={(value) => handleFilterChange("species", value)}
            speciesList={speciesList}
            gender={gender}
            onGenderChange={(value) => handleFilterChange("gender", value)}
            sortBy={sortBy}
            onSortChange={(value) => handleFilterChange("sort", value)}
            onReset={handleReset}
          />

          <p className="muted results-count">
            {visibleCharacters.length} result{visibleCharacters.length === 1 ? "" : "s"}
          </p>

          {visibleCharacters.length === 0 ? (
            <StatusMessage
              type="empty"
              message="No characters match your filters."
              actionLabel="Reset filters"
              onAction={handleReset}
            />
          ) : (
            <>
              <div className="grid">
                {pageItems.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}
