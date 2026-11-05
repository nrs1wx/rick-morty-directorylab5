import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { fetchAllCharacters, readCachedCharacters } from "../services/service.js";
import { loadCustomCharacters, saveCustomCharacters } from "../services/storage.js";

export const CharactersContext = createContext(null);

export function CharactersProvider({ children }) {
  const [apiCharacters, setApiCharacters] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [wanted, setWanted] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [customCharacters, setCustomCharacters] = useState(loadCustomCharacters);
  const [storageFull, setStorageFull] = useState(false);

  useEffect(() => {
    if (!wanted) return;

    const cached = reloadKey === 0 ? readCachedCharacters() : null;
    if (cached) {
      setApiCharacters(cached);
      setStatus("success");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    fetchAllCharacters(controller.signal)
      .then((data) => {
        setApiCharacters(data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Could not load characters.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [wanted, reloadKey]);

  useEffect(() => {
    setStorageFull(!saveCustomCharacters(customCharacters));
  }, [customCharacters]);

  const requestData = useCallback(() => setWanted(true), []);

  const reload = useCallback(() => {
    setWanted(true);
    setReloadKey((key) => key + 1);
  }, []);

  const addCharacter = useCallback((data) => {
    const newCharacter = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: data.name,
      status: data.status,
      species: data.species,
      type: "",
      gender: data.gender,
      origin: { name: data.origin || "unknown" },
      location: { name: data.location || "unknown" },
      image: data.image,
      episodeCount: 0,
      firstEpisodeUrl: null,
      created: new Date().toISOString(),
    };
    setCustomCharacters((prev) => [newCharacter, ...prev]);
    return newCharacter.id;
  }, []);

  const characters = useMemo(
    () => [...customCharacters, ...apiCharacters],
    [customCharacters, apiCharacters]
  );

  const value = useMemo(
    () => ({
      characters,
      customCharacters,
      status,
      error,
      storageFull,
      requestData,
      reload,
      addCharacter,
    }),
    [characters, customCharacters, status, error, storageFull, requestData, reload, addCharacter]
  );

  return <CharactersContext.Provider value={value}>{children}</CharactersContext.Provider>;
}
