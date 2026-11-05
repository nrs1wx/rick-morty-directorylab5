export const STATUSES = ["Alive", "Dead", "unknown"];
export const GENDERS = ["Female", "Male", "Genderless", "unknown"];
export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "default", label: "Sort: default" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
  { value: "episodes-desc", label: "Most episodes" },
];

export const SPECIES_SUGGESTIONS = [
  "Human",
  "Alien",
  "Humanoid",
  "Robot",
  "Animal",
  "Cronenberg",
  "Mythological Creature",
  "Disease",
  "Poopybutthole",
  "unknown",
];

export const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/characters", label: "Characters", end: false },
  { to: "/dashboard", label: "Dashboard", end: false },
  { to: "/about", label: "About", end: false },
  { to: "/login", label: "Login", end: false },
];
