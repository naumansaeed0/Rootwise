import { useEffect, useState } from "react";
import { plants, categories, filterPlants } from "../data/plants";
import { PlantCard } from "../components/PlantCard";
import { Icon } from "../components/Icon";
import {
  Panel,
  PageIntro,
  ReadoutLabel,
  ToggleGroup,
  SafetyStatus,
} from "../components/ui/Instrument";
import { specimenCode, waterReadout } from "../components/ui/PlantReadouts";
import {
  readLibraryView,
  saveLibraryView,
  type LibraryView,
} from "../library/preferences";
const filterDefinitions = [
  {
    key: "light",
    label: "Light",
    options: ["Low", "Medium", "Bright indirect", "Direct sun"],
  },
  {
    key: "difficulty",
    label: "Care level",
    options: ["Easy", "Moderate", "Demanding"],
  },
  {
    key: "pets",
    label: "Pet safety",
    options: ["Non-toxic", "Toxic", "Unverified"],
  },
  { key: "size", label: "Size", options: ["Small", "Medium", "Large"] },
];
export function Library({ initialParams }: { initialParams: URLSearchParams }) {
  const [query, setQuery] = useState(initialParams.get("q") || ""),
    [filters, setFilters] = useState<Record<string, string>>({
      light: initialParams.get("light") || "",
      difficulty: initialParams.get("difficulty") || "",
      pets: initialParams.get("pets") || "",
      size: initialParams.get("size") || "",
      category: initialParams.get("category") || "",
    });
  const [view, setView] = useState<LibraryView>(readLibraryView),
    [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = filterPlants(query, filters),
    count = Object.values(filters).filter(Boolean).length;
  useEffect(() => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    Object.entries(filters).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    history.replaceState(
      null,
      "",
      location.pathname + (p.size ? "?" + p.toString() : ""),
    );
  }, [query, filters]);
  useEffect(() => saveLibraryView(view), [view]);
  function change(key: string, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
  }
  function reset() {
    setQuery("");
    setFilters({ light: "", difficulty: "", pets: "", size: "", category: "" });
  }
  return (
    <div className="page-shell specimen-library">
      <PageIntro
        index="01"
        label="ROOTWISE / SPECIMEN DATABASE"
        title={
          <>
            Find your kind of <em>green.</em>
          </>
        }
        description="Every plant has a way of living. Find one that fits yours."
        icon="sprout"
      />
      <div className="database-summary">
        <ReadoutLabel>
          COLLECTION / {String(plants.length).padStart(3, "0")} RECORDS
        </ReadoutLabel>
        <ReadoutLabel>{categories.length} botanical categories</ReadoutLabel>
        <span className="database-summary-note">
          Observe. Understand. Grow.
        </span>
      </div>
      <Panel
        className={`library-console ${filtersOpen ? "is-open" : ""}`}
        as="section"
      >
        <div className="console-heading">
          <ReadoutLabel index="A">Refine your environment</ReadoutLabel>
          <button
            className="console-reset"
            onClick={reset}
            disabled={!count && !query}
          >
            <Icon name="close" size={15} />
            Reset all
          </button>
        </div>
        <div className="console-search-row">
          <label className="instrument-search">
            <Icon name="search" size={20} />
            <span className="sr-only">Search plants</span>
            <input
              aria-label="Search plants"
              placeholder="Search common, scientific, or alternate name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="icon-button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <Icon name="close" size={16} />
              </button>
            )}
            <kbd aria-hidden="true">FIND</kbd>
          </label>
          <button
            className="filter-toggle ui-chip"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="library-filter-fields"
          >
            <Icon name="humidity" size={17} />
            Filters{count > 0 && <span className="filter-count">{count}</span>}
            <Icon name={filtersOpen ? "close" : "plus"} size={16} />
          </button>
        </div>
        <div className="filter-fields" id="library-filter-fields">
          <div className="filter-matrix">
            {filterDefinitions.map((f) => (
              <ToggleGroup
                key={f.key}
                label={f.label}
                value={filters[f.key]}
                onChange={(v) => change(f.key, v)}
                options={[
                  { value: "", label: "Any" },
                  ...f.options.map((v) => ({
                    value: v,
                    label: v === "Non-toxic" ? "Pet-friendly" : v,
                  })),
                ]}
              />
            ))}
          </div>
          <ToggleGroup
            label="Plant category"
            value={filters.category}
            onChange={(v) => change("category", v)}
            options={[
              { value: "", label: "All plants" },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
        {count > 0 && (
          <div className="active-filters" aria-label="Active filters">
            <ReadoutLabel>Applied</ReadoutLabel>
            {Object.entries(filters)
              .filter(([, v]) => v)
              .map(([key, value]) => (
                <button
                  className="active-filter"
                  key={key}
                  onClick={() => change(key, "")}
                  aria-label={`Remove ${key === "pets" ? "pet safety" : key} filter: ${value === "Non-toxic" ? "Pet-friendly" : value}`}
                >
                  {key === "difficulty"
                    ? "Care"
                    : key === "pets"
                      ? "Pets"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  : {value === "Non-toxic" ? "Pet-friendly" : value}
                  <Icon name="close" size={13} />
                </button>
              ))}
          </div>
        )}
      </Panel>
      <div className="database-results-heading">
        <div>
          <ReadoutLabel index="B">Collection readout</ReadoutLabel>
          <div role="status" aria-live="polite" aria-atomic="true">
            <h2>
              {String(filtered.length).padStart(2, "0")}{" "}
              <span>
                {filtered.length === 1 ? "specimen" : "specimens"} found
              </span>
            </h2>
          </div>
        </div>
        <div className="view-toggle" role="group" aria-label="Library view">
          <button
            className="ui-chip"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <Icon name="grid" size={17} />
            <span>Grid</span>
          </button>
          <button
            className="ui-chip"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <Icon name="list" size={17} />
            <span>List</span>
          </button>
        </div>
      </div>
      <div
        className="database-results"
        key={`${view}:${query}:${Object.values(filters).join("|")}`}
      >
        {filtered.length ? (
          view === "grid" ? (
            <div className="specimen-grid">
              {filtered.map((p) => (
                <PlantCard plant={p} key={p.slug} />
              ))}
            </div>
          ) : (
            <div
              className="specimen-table-wrap ui-panel"
              role="region"
              aria-label="Specimen records table; scroll horizontally to see all readouts"
              tabIndex={0}
            >
              <table className="specimen-table">
                <caption className="sr-only">
                  Plant records with light, watering, care level, pet safety,
                  and size. Open a plant name for its full record.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Specimen / identity</th>
                    <th scope="col">Light</th>
                    <th scope="col">Water · soil check</th>
                    <th scope="col">Care level</th>
                    <th scope="col">Cats & dogs</th>
                    <th scope="col">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.slug} data-palette={p.theme}>
                      <th scope="row">
                        <a href={`plant-${p.slug}.html`}>
                          <span className="specimen-id">{specimenCode(p)}</span>
                          <strong>{p.commonName}</strong>
                          <span className="specimen-scientific">
                            {p.scientificName}
                          </span>
                        </a>
                      </th>
                      <td>{p.light}</td>
                      <td>{waterReadout(p).label}</td>
                      <td>{p.difficulty}</td>
                      <td>
                        <SafetyStatus value={p.toxicity.pets} />
                      </td>
                      <td>{p.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <Panel className="database-empty">
            <div className="empty-reticle" aria-hidden="true">
              <Icon name="search" size={35} />
            </div>
            <ReadoutLabel>SCAN COMPLETE / NO MATCHES</ReadoutLabel>
            <h3>
              A different combination
              <br />
              could take root.
            </h3>
            <p>
              No specimens match these conditions. Try a broader search or
              remove a filter.
            </p>
            <button className="button primary" onClick={reset}>
              Reset the scan
            </button>
          </Panel>
        )}
      </div>
      <Panel as="aside" className="database-notes">
        <div>
          <Icon name="shield" size={22} />
          <ReadoutLabel>Reading the signals</ReadoutLabel>
        </div>
        <p>
          Light bars show relative light level. Water bars summarize moisture
          guidance, never days between watering. Care bars show difficulty.
          Every meter includes a text label.
        </p>
        <div className="safety-legend">
          <SafetyStatus value="Non-toxic" />
          <SafetyStatus value="Toxic" />
          <SafetyStatus value="Unverified" />
        </div>
        <p>
          Pet-friendly means listed as non-toxic to cats and dogs, not edible.
          Any plant can cause stomach upset if eaten. Unverified plants are
          excluded from that filter.{" "}
          <a href="about.html#safety">Read our safety notes.</a>
        </p>
      </Panel>
    </div>
  );
}
