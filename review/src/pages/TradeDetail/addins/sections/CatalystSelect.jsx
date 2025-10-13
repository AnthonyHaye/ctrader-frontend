import MultiSelectTags from "../../technical/ui/MultiSelectTags";
import { CATALYSTS } from "../constants";

export default function CatalystSelect({ selected, onAdd, onRemove }) {
  return (
    <MultiSelectTags
      title="Catalyseurs"
      options={CATALYSTS}
      selected={selected}
      onAdd={onAdd}
      onRemove={onRemove}
      placeholder="Ajouter un catalyseur…"
    />
  );
}
