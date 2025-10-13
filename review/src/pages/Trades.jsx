import { useEffect, useMemo, useState } from "react";
import { fetchTrades } from "../services/tradesService";
import { applyFilters, applySort, paginate } from "../utils/table";
import TradesTable from "../components/TradesTable/TradesTable";
import FiltersBar from "../components/FiltersBar/FiltersBar";
import Pagination from "../components/Pagination/Pagination";

const PAGE_SIZE = 15;

export default function Trades() {
  const [allTrades, setAllTrades] = useState([]);
  const [filters, setFilters] = useState({ symbol: "", direction: "" , hasSltpMods: false, hasAddIns: false});
  const [sort, setSort] = useState({ key: "openTime", dir: "desc" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTrades().then(setAllTrades);
  }, []);

  const filtered = useMemo(() => applyFilters(allTrades, filters), [allTrades, filters]);
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const pageItems = useMemo(() => paginate(sorted, page, PAGE_SIZE), [sorted, page]);

  useEffect(() => setPage(1), [filters, sort]); // reset page si filtre/tri change

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <FiltersBar filters={filters} onChange={setFilters} />
      <TradesTable trades={pageItems} sort={sort} onSortChange={setSort} />
      <Pagination page={page} total={sorted.length} pageSize={PAGE_SIZE} onPage={setPage} />
    </section>
  );
}
