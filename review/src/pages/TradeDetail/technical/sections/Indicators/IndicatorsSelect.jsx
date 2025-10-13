import MultiSelectTags from "../../ui/MultiSelectTags";
import { INDICATORS } from "../../constants";

export default function IndicatorsSelect({ selected, onAdd, onRemove }) {
  return (
    <MultiSelectTags
      title="Indicateurs qui ont provoqué le trade"
      options={INDICATORS}
      selected={selected}
      onAdd={onAdd}
      onRemove={onRemove}
      placeholder="Ajouter un indicateur…"
    />
  );
}
