import { useEffect, useState } from "react";
import { fetchCharacterById, fetchEpisode } from "../services/service.js";
import { useCharacterStore } from "./useCharacters.js";

const API_ID = /^\d+$/;

export default function useCharacter(id) {
  const { customCharacters } = useCharacterStore();

  const isLocal = id.startsWith("local-");
  const isValid = isLocal || API_ID.test(id);

  const [state, setState] = useState({ id: null, status: "loading", character: null, error: "" });
  const [episodeState, setEpisodeState] = useState({ id: null, status: "idle", data: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isValid || isLocal) return;

    let ignore = false;
    const controller = new AbortController();

    setState({ id, status: "loading", character: null, error: "" });
    setEpisodeState({ id, status: "idle", data: null });

    async function load() {
      try {
        const character = await fetchCharacterById(id, controller.signal);
        if (ignore) return;
        setState({ id, status: "success", character, error: "" });

        if (character.firstEpisodeUrl) {
          setEpisodeState({ id, status: "loading", data: null });
          try {
            const data = await fetchEpisode(character.firstEpisodeUrl, controller.signal);
            if (!ignore) setEpisodeState({ id, status: "success", data });
          } catch {
            if (!ignore) setEpisodeState({ id, status: "failed", data: null });
          }
        }
      } catch (error) {
        if (ignore || error.name === "AbortError") return;
        if (error.code === "NOT_FOUND") {
          setState({ id, status: "notfound", character: null, error: "" });
        } else {
          setState({ id, status: "error", character: null, error: error.message });
        }
      }
    }

    load();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id, isValid, isLocal, reloadKey]);

  function reload() {
    setReloadKey((key) => key + 1);
  }

  if (!isValid) {
    return { status: "notfound", character: null, episode: null, error: "", reload };
  }

  if (isLocal) {
    const local = customCharacters.find((character) => character.id === id);
    return local
      ? { status: "success", character: local, episode: null, error: "", reload }
      : { status: "notfound", character: null, episode: null, error: "", reload };
  }

  if (state.id !== id) {
    return { status: "loading", character: null, episode: null, error: "", reload };
  }

  const episode = episodeState.id === id && episodeState.status !== "idle" ? episodeState : null;
  return { status: state.status, character: state.character, episode, error: state.error, reload };
}
