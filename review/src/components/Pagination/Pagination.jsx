export default function Pagination({ page, total, pageSize, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button disabled={page === 1} onClick={() => onPage(1)}>Début</button>
      <button disabled={page === 1} onClick={() => onPage(page - 1)}>←</button>
      <span>Page {page} / {pages}</span>
      <button disabled={page === pages} onClick={() => onPage(page + 1)}>→</button>
      <button disabled={page === pages} onClick={() => onPage(pages)}>Fin</button>
    </div>
  );
}
