const BASE_URL = "https://rickandmortyapi.com/api";
const MAX_PARALLEL_REQUESTS = 6;
const MAX_ATTEMPTS = 3;
const CACHE_KEY = "rm-api-characters-v2";

function abortError() {
  const error = new Error("Request was cancelled");
  error.name = "AbortError";
  return error;
}

function createError(message, extra = {}) {
  return Object.assign(new Error(message), extra);
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    function onAbort() {
      clearTimeout(timerId);
      reject(abortError());
    }
    const timerId = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function requestOnce(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw createError("Network problem. Check your connection and try again.", { retryable: true });
  }

  if (response.status === 404) {
    throw createError("Not found", { code: "NOT_FOUND", retryable: false });
  }
  if (!response.ok) {
    throw createError(`Server error: ${response.status}`, {
      retryable: response.status === 429 || response.status >= 500,
    });
  }

  try {
    return await response.json();
  } catch {
    throw createError("The server sent an unreadable answer.", { retryable: true });
  }
}

async function fetchJson(url, signal) {
  let lastError;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await requestOnce(url, signal);
    } catch (error) {
      if (error.name === "AbortError" || !error.retryable) throw error;
      lastError = error;
      if (attempt < MAX_ATTEMPTS - 1) {
        await delay(500 * 2 ** attempt, signal);
      }
    }
  }

  throw lastError;
}

async function runWithLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let nextIndex = 0;
  let failed = false;

  async function worker() {
    while (!failed && nextIndex < tasks.length) {
      const index = nextIndex++;
      try {
        results[index] = await tasks[index]();
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

function normalizeCharacter(character) {
  return {
    id: character.id,
    name: character.name,
    status: character.status,
    species: character.species,
    type: character.type,
    gender: character.gender,
    origin: { name: character.origin?.name ?? "unknown" },
    location: { name: character.location?.name ?? "unknown" },
    image: character.image,
    episodeCount: character.episode?.length ?? 0,
    firstEpisodeUrl: character.episode?.[0] ?? null,
    created: character.created,
  };
}

export function readCachedCharacters() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

function writeCachedCharacters(characters) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(characters));
  } catch {
    return;
  }
}

export async function fetchAllCharacters(signal) {
  const first = await fetchJson(`${BASE_URL}/character?page=1`, signal);
  const totalPages = first.info.pages;

  const tasks = Array.from(
    { length: totalPages - 1 },
    (_, index) => () => fetchJson(`${BASE_URL}/character?page=${index + 2}`, signal)
  );
  const otherPages = await runWithLimit(tasks, MAX_PARALLEL_REQUESTS);

  const characters = [first, ...otherPages].flatMap((page) => page.results).map(normalizeCharacter);
  writeCachedCharacters(characters);
  return characters;
}

export async function fetchCharacterById(id, signal) {
  const character = await fetchJson(`${BASE_URL}/character/${id}`, signal);
  return normalizeCharacter(character);
}

export async function fetchEpisode(url, signal) {
  if (!url.startsWith(`${BASE_URL}/episode/`)) {
    throw createError("Invalid episode address");
  }
  const episode = await fetchJson(url, signal);
  return { id: episode.id, name: episode.name, code: episode.episode, airDate: episode.air_date };
}
