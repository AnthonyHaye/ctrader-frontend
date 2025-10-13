import MultiSelectTags from "../../technical/ui/MultiSelectTags";
import { SESSIONS } from "../constants";

export default function SessionSelect({ selected, onAdd, onRemove }) {
  return (
    <MultiSelectTags
      title="Sessions / Killzones"
      options={SESSIONS}
      selected={selected}
      onAdd={onAdd}
      onRemove={onRemove}
      placeholder="Ajouter une session…"
    />
  );
}
