import CharacterForm from "../components/CharacterForm.jsx";
import { useCharacterStore } from "../hooks/useCharacters.js";

export default function AddCharacter() {
  const { addCharacter } = useCharacterStore();

  return (
    <section>
      <CharacterForm onSubmit={addCharacter} />
    </section>
  );
}
