import { useContext, useEffect } from "react";
import { CharactersContext } from "../context/CharactersContext.jsx";

export function useCharacterStore() {
  const context = useContext(CharactersContext);
  if (!context) {
    throw new Error("Characters hooks must be used inside CharactersProvider");
  }
  return context;
}

export default function useCharacters() {
  const store = useCharacterStore();
  const { requestData } = store;

  useEffect(() => {
    requestData();
  }, [requestData]);

  const isLoading = store.status === "idle" || store.status === "loading";
  return { ...store, isLoading };
}
