// checkbox “A+ setup”

export default function APlusToggle({ checked, onChange }) {
  return (
    <label className="aplusToggle">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span>A+ setup (confluence TF supérieure)</span>
    </label>
  );
}
