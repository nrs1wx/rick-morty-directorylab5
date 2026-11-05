import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { CharactersProvider } from "./context/CharactersContext.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx";

const About = lazy(() => import("./pages/About.jsx"));
const Characters = lazy(() => import("./pages/Characters.jsx"));
const CharacterDetails = lazy(() => import("./pages/CharacterDetails.jsx"));
const AddCharacter = lazy(() => import("./pages/AddCharacter.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

export default function App() {
  return (
    <CharactersProvider>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="characters">
            <Route index element={<Characters />} />
            <Route path="new" element={<AddCharacter />} />
            <Route path=":id" element={<CharacterDetails />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CharactersProvider>
  );
}
