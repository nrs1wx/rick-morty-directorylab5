const STORAGE_KEY = "rm-custom-characters";

export function loadCustomCharacters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) return [];
    return data.map((character) => ({
      ...character,
      episodeCount: character.episodeCount ?? character.episode?.length ?? 0,
      firstEpisodeUrl: null,
    }));
  } catch {
    return [];
  }
}

export function saveCustomCharacters(characters) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    return true;
  } catch {
    return false;
  }
}
