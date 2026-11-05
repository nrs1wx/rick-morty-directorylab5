# Rick and Morty Characters — React SPA

A character directory built with React 18, React Router 6 and Vite.
Data comes from the public [Rick and Morty API](https://rickandmortyapi.com/documentation) (826 characters).

**Live demo:** https://rick-morty-directory.vercel.app/

## Routes
| Route | Page |
|---|---|
| `/` | Home: introduction, images, navigation links |
| `/about` | About the project |
| `/characters` | Characters list: search, 3 filters, sorting, pagination (all synced with the URL) |
| `/characters/new` | Form for adding a character with a photo |
| `/characters/:id` | Character details loaded by ID |
| `/dashboard` | Statistics, breakdowns and an interactive filter |
| `/login` | Styled placeholder for future authentication |
| `*` | Custom 404 page |

## Features
- Nested routes with `RootLayout`, `NavBar` and `Outlet`
- Lazy loading of 7 pages with `React.lazy` and `Suspense`
- Search, filters (status, species, gender), sorting and pagination stored in URL parameters with `useSearchParams`
- Character page: 9 detail fields, the first episode is loaded with a second request, links Back / All characters / Previous / Next
- Stale request protection: cleanup with `ignore` flag and `AbortController`, answers for old IDs are never shown
- Missing characters (404 from the API) and invalid IDs (`/characters/abc`) show a friendly message
- Dashboard: 5 statistics, 3 breakdowns, species and gender filters that change the statistics, links to the matching characters
- Add your own character with a photo (saved in `localStorage`)
- Loading, error (with retry), empty and not found states
- Reliable loading: at most 6 requests at once, retries for network errors, 429 and 5xx, cache in `sessionStorage`
- The full list is loaded only when a page needs it (Characters or Dashboard), not on Home or About
- Responsive layout

## Project structure
```
src/
  main.jsx                 BrowserRouter and styles
  App.jsx                  routes only
  layouts/RootLayout.jsx   NavBar + Outlet inside Suspense + footer
  pages/                   Home, About, Characters, CharacterDetails, AddCharacter, Dashboard, Login, NotFound
  components/              NavBar, CharacterCard, Controls, Pagination, CharacterForm, CharacterImage,
                           StatCard, BarList, StatusMessage, PageLoader
  services/service.js      all requests to the API
  services/storage.js      localStorage for added characters
  context/                 CharactersProvider (shared data)
  hooks/                   useCharacters, useCharacter
  utils/                   stats and formatting helpers
  styles/                  base, layout, components, pages
```

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

`vercel.json` sends every path to `index.html`, so direct URLs and page refresh work on any route.
