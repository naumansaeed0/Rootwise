import { useEffect, useState } from "react";
import { plants, categories, filterPlants, sourceLinks } from "./data/plants";
import { guides } from "./data/guides";
import { Icon } from "./components/Icon";
import { PlantArt } from "./components/PlantArt";
import { PlantCard } from "./components/PlantCard";
import { LivingPlant } from "./living-plant/LivingPlant";
let route = new URL(
  typeof location === "undefined"
    ? "https://naumansaeed0.github.io/Rootwise/"
    : location.href,
);
let current = "home";
let params = new URLSearchParams();
export function setRoute(url: string) {
  route = new URL(url);
  const file = route.pathname.split("/").pop() || "index.html";
  current =
    file === "index.html"
      ? "home"
      : file.startsWith("plant-")
        ? "plant"
        : file.replace(".html", "");
  params = new URLSearchParams(route.search);
  if (file.startsWith("plant-")) params.set("slug", file.slice(6, -5));
}
setRoute(route.href);
const readTheme = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.theme === "light"
    ? "light"
    : "dark";
function Header() {
  const [theme, setTheme] = useState(readTheme),
    [menu, setMenu] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: light)");
    const sync = () => {
      let chosen;
      try {
        chosen = localStorage.getItem("rootwise-theme");
      } catch {}
      if (!chosen) {
        const t = media.matches ? "light" : "dark";
        setTheme(t);
        document.documentElement.dataset.theme = t;
      }
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("rootwise-theme", next);
    } catch {}
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="index.html" aria-label="Rootwise home">
          <Icon name="sprout" size={27} />
          <span>
            rootwise<span className="brand-dot">®</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className={menu ? "nav-open" : ""}>
          {[
            ["home", "Discover", "index.html"],
            ["library", "Plant library", "library.html"],
            ["guides", "Care guides", "guides.html"],
            ["benefits", "Why plants?", "benefits.html"],
          ].map(([key, label, href]) => (
            <a
              key={key}
              href={href}
              aria-current={current === key ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-end">
          <span className="header-tag">GROW WITH UNDERSTANDING</span>
          <button
            className="icon-button theme-toggle"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
          </button>
          <button
            className="icon-button mobile-menu"
            aria-expanded={menu}
            aria-label="Toggle navigation"
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand" href="index.html">
          <Icon name="sprout" size={26} />
          rootwise
        </a>
        <p>
          A little closer to nature.
          <br />A little more in your element.
        </p>
      </div>
      <div className="footer-links">
        <a href="library.html">Plant library</a>
        <a href="guides.html">Care guides</a>
        <a href="benefits.html">Why plants?</a>
        <a href="about.html">About & sources</a>
      </div>
      <div className="footer-bottom">
        <span>AN INDEPENDENT FIELD GUIDE TO INDOOR PLANTS.</span>
        <span>Built with care. Rooted in curiosity.</span>
      </div>
    </footer>
  );
}
function SectionTitle({
  kicker,
  title,
  text,
  href,
  label,
}: {
  kicker: string;
  title: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{kicker}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {label}
        </a>
      )}
    </div>
  );
}
function Home() {
  return (
    <>
      <LivingPlant />
      <section className="intro-strip">
        <p>
          Less guesswork.
          <br />
          <strong>More green.</strong>
        </p>
        <div>
          <span className="stat-number">55</span>
          <span>Plants to get to know</span>
        </div>
        <div>
          <span className="stat-number">06</span>
          <span>Guides for growing well</span>
        </div>
        <div>
          <Icon name="sprout" size={36} />
          <span>One good place to begin</span>
        </div>
      </section>
      <section className="content-section">
        <SectionTitle
          kicker="MEET YOUR NEXT GREEN COMPANION"
          title="A plant for your kind of space."
          text="Quiet corners, sunny windows, and everything in between."
          href="library.html"
          label="Explore the library"
        />
        <div className="featured-grid">
          {[plants[3], plants[1], plants[19], plants[2]].map((p, i) => (
            <PlantCard key={p.slug} plant={p} index={i} />
          ))}
        </div>
      </section>
      <section className="care-preview content-section">
        <SectionTitle
          kicker="GOOD HABITS. HEALTHY LEAVES."
          title="Small things. Growing confidence."
          href="guides.html"
          label="All care guides"
        />
        <div className="guide-preview-grid">
          {guides.slice(0, 3).map((g, i) => (
            <a
              className="guide-preview"
              href={`guides.html#${g.slug}`}
              key={g.slug}
            >
              <div className="guide-top">
                <Icon name={g.icon} size={32} />
                <span className="eyebrow">{g.time}</span>
              </div>
              <h3>{g.title}</h3>
              <p>{g.subtitle}</p>
              <span className="guide-number">
                {["FEEL THE SOIL", "FOLLOW THE LIGHT", "KNOW YOUR AIR"][i]}
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="truth-banner">
        <div className="truth-art">
          <Icon name="leaf" size={100} />
        </div>
        <div>
          <span className="eyebrow">A FRESH PERSPECTIVE</span>
          <h2>
            Good for your space.
            <br />
            Grounded in science.
          </h2>
          <p>
            Plants bring life to a room. The air-purifying claims?
            <br />
            Let’s untangle what the evidence actually says.
          </p>
          <a href="benefits.html" className="button secondary">
            The real benefits of plants
          </a>
        </div>
        <span className="vertical-label">CURIOUS BY NATURE</span>
      </section>
    </>
  );
}

function Library() {
  const [query, setQuery] = useState(params.get("q") || ""),
    [filters, setFilters] = useState<Record<string, string>>({
      light: params.get("light") || "",
      difficulty: params.get("difficulty") || "",
      pets: params.get("pets") || "",
      size: params.get("size") || "",
      category: params.get("category") || "",
    });
  const filtered = filterPlants(query, filters);
  const count = Object.values(filters).filter(Boolean).length;
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
  function change(key: string, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
  }
  return (
    <div className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">THE PLANT LIBRARY</span>
        <h1>
          Find your kind of <em>green.</em>
        </h1>
        <p>
          55 plants. A world of possibility. Get to know what grows with you.
        </p>
      </div>
      <div className="library-toolbar">
        <label className="search-field">
          <Icon name="search" />
          <input
            aria-label="Search plants"
            placeholder="Search by common or scientific name…"
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
        </label>
        <div className="filter-selects">
          {[
            [
              "light",
              "Light",
              ["Low", "Medium", "Bright indirect", "Direct sun"],
            ],
            ["difficulty", "Care level", ["Easy", "Moderate", "Demanding"]],
            ["pets", "Pet safety", ["Non-toxic", "Toxic", "Unverified"]],
            ["size", "Size", ["Small", "Medium", "Large"]],
          ].map(([key, label, options]) => (
            <label key={key as string}>
              <span className="sr-only">{label}</span>
              <select
                aria-label={label as string}
                value={filters[key as string]}
                onChange={(e) => change(key as string, e.target.value)}
              >
                <option value="">{label}</option>
                {(options as string[]).map((o) => (
                  <option key={o} value={o}>
                    {key === "pets" && o === "Non-toxic" ? "Pet-friendly" : o}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      <div className="category-tabs" role="group" aria-label="Plant category">
        {["All plants", ...categories].map((c) => (
          <button
            key={c}
            aria-pressed={filters.category === (c === "All plants" ? "" : c)}
            className={
              filters.category === (c === "All plants" ? "" : c) ? "active" : ""
            }
            onClick={() => change("category", c === "All plants" ? "" : c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="results-bar">
        <span role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "plant" : "plants"} to
          explore
        </span>
        <div>
          {(count > 0 || query) && (
            <button
              className="reset-button"
              onClick={() => {
                setQuery("");
                setFilters({
                  light: "",
                  difficulty: "",
                  pets: "",
                  size: "",
                  category: "",
                });
              }}
            >
              Clear filters <Icon name="close" size={14} />
            </button>
          )}
          <span className="library-caption">GROW AT YOUR OWN PACE</span>
        </div>
      </div>
      {filtered.length ? (
        <div className="library-grid">
          {filtered.map((p, i) => (
            <PlantCard plant={p} key={p.slug} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={40} />
          <h2>No leaves left unturned.</h2>
          <p>
            We couldn’t find a match. Try a different name or loosen a filter.
          </p>
        </div>
      )}
      <aside className="library-footnote">
        <Icon name="shield" />
        <p>
          Pet-friendly means listed as non-toxic to cats and dogs, not edible.
          Any plant can cause stomach upset if eaten. “Safety unverified” plants
          are excluded from the pet-friendly filter.{" "}
          <a href="about.html#safety">Read our safety notes.</a>
        </p>
      </aside>
    </div>
  );
}
const careIcons: Record<string, string> = {
  light: "sun",
  water: "drop",
  humidity: "humidity",
  temperature: "temperature",
  soil: "sprout",
  fertilizing: "leaf",
  repotting: "sprout",
  propagation: "plus",
};
function PlantDetail() {
  const plant = plants.find((p) => p.slug === params.get("slug"));
  if (!plant) return <NotFound plant />;
  return (
    <div className="plant-detail" data-palette={plant.theme}>
      <div className="breadcrumbs">
        <a href="library.html">Plant library</a>
        <Icon name="chevron" size={14} />
        <span>{plant.commonName}</span>
      </div>
      <section className="detail-hero">
        <div className="detail-art">
          <div className="detail-orbit" />
          <PlantArt
            shape={plant.shape}
            label={`Stylized illustration of ${plant.commonName}; not an identification reference`}
          />
          <span className="eyebrow">
            BOTANICAL STUDY / {plant.family.toUpperCase()}
          </span>
        </div>
        <div className="detail-intro">
          <span className="eyebrow">{plant.category}</span>
          <h1>{plant.commonName}</h1>
          <p className="detail-scientific">{plant.scientificName}</p>
          <p className="lead">{plant.description}</p>
          <div className="detail-tags">
            <span>
              <Icon name="sun" />
              {plant.light} light
            </span>
            <span>
              <Icon name="leaf" />
              {plant.difficulty} care
            </span>
            <span>
              <Icon name="sprout" />
              {plant.size} size
            </span>
          </div>
          <dl className="botanical-info">
            <div>
              <dt>FAMILY</dt>
              <dd>{plant.family}</dd>
            </div>
            <div>
              <dt>ORIGIN</dt>
              <dd>{plant.origin}</dd>
            </div>
            {plant.alternateNames.length > 0 && (
              <div>
                <dt>ALSO KNOWN AS</dt>
                <dd>{plant.alternateNames.join(" · ")}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>
      <div className="detail-body">
        <div className="detail-content">
          <section id="care">
            <SectionTitle
              kicker="A LITTLE UNDERSTANDING GOES A LONG WAY"
              title="Help it feel at home."
            />
            <div className="care-grid">
              {Object.entries(plant.care).map(([key, value]) => (
                <article className="care-item" key={key}>
                  <span className="care-icon">
                    <Icon name={careIcons[key]} />
                  </span>
                  <h3>
                    {key === "water"
                      ? "Watering"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </h3>
                  <p>{value}</p>
                  {key === "light" && (
                    <a href="guides.html#light">Light, explained</a>
                  )}
                </article>
              ))}
            </div>
          </section>
          <section className="detail-section">
            <span className="eyebrow">WHEN SOMETHING FEELS OFF</span>
            <h2>Common problems, considered.</h2>
            {plant.commonProblems.map((p) => (
              <details className="problem" key={p.symptom}>
                <summary>
                  {p.symptom}
                  <Icon name="plus" size={18} />
                </summary>
                <p>{p.fix}</p>
              </details>
            ))}
          </section>
          <section className="detail-section">
            <span className="eyebrow">MORE THAN A PRETTY LEAF</span>
            <h2>What it brings to your space.</h2>
            {plant.benefits.map((b) => (
              <p key={b}>{b}</p>
            ))}
            <p className="muted">
              These are general lifestyle benefits, not species-specific health
              outcomes. <a href="benefits.html">Read the evidence.</a>
            </p>
          </section>
          <section className="detail-section">
            <span className="eyebrow">BOTANICAL CONNECTIONS</span>
            <h2>Also worth knowing.</h2>
            <p>
              Related species and cultivated forms. These names are starting
              points for further research, not separate care profiles.
            </p>
            <div className="related-tags">
              {plant.related.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          </section>
          <section className="detail-section profile-sources">
            <h3>Sources & editorial notes</h3>
            <ul>
              {plant.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p>
              Care is a starting point: adjust to your light, mix, pot, and
              climate. Size labels describe typical indoor scale, not a growth
              guarantee. Illustrations are decorative, not identification tools.
            </p>
            {plant.needsVerification && (
              <div className="verification">
                <strong>Needs verification</strong>
                {plant.verificationNotes.map((n) => (
                  <p key={n}>{n}</p>
                ))}
              </div>
            )}
          </section>
        </div>
        <aside className="detail-sidebar">
          <div className="safety-card">
            <Icon name="shield" size={26} />
            <span className="eyebrow">SHARE YOUR SPACE SAFELY</span>
            <h3>
              {plant.toxicity.pets === "Non-toxic"
                ? "A pet-friendlier choice."
                : plant.toxicity.pets === "Toxic"
                  ? "Keep away from pets."
                  : "Pet safety unverified."}
            </h3>
            <p>
              {plant.toxicity.pets === "Non-toxic"
                ? "Listed as non-toxic to cats and dogs. Eating plant material can still cause stomach upset."
                : plant.toxicity.pets === "Toxic"
                  ? "Toxic or irritating if chewed or ingested. Keep out of reach of cats and dogs."
                  : "We have not confirmed species-specific safety. Do not assume this plant is safe for cats or dogs."}
            </p>
            <a href={sourceLinks.aspca} target="_blank" rel="noreferrer">
              ASPCA plant database
            </a>
            <hr />
            <h4>Children & handling</h4>
            <p>{plant.toxicity.humans}</p>
            <p className="small">
              If ingestion is suspected, contact a veterinarian or local poison
              service promptly. Do not use this guide for diagnosis.
            </p>
          </div>
          <a className="sidebar-guide" href="guides.html">
            <Icon name="book" size={27} />
            <h3>Grow your understanding.</h3>
            <p>Six thoughtful guides to the everyday essentials.</p>
            <span className="text-link">Explore care guides</span>
          </a>
        </aside>
      </div>
      <section className="content-section related-plants">
        <SectionTitle
          kicker="KEEP EXPLORING"
          title="A few other green companions."
        />
        <div className="featured-grid">
          {plants
            .filter(
              (p) =>
                p.slug !== plant.slug &&
                (p.category === plant.category || p.theme === plant.theme),
            )
            .slice(0, 4)
            .map((p) => (
              <PlantCard key={p.slug} plant={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
function Guides() {
  const [selected, setSelected] = useState(route.hash.slice(1));
  useEffect(() => {
    const update = () =>
      setSelected(decodeURIComponent(location.hash.slice(1)));
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  const guide = guides.find((g) => g.slug === selected);
  return (
    <div className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">THE EVERYDAY ESSENTIALS</span>
        <h1>
          Good habits.
          <br />
          <em>Happier plants.</em>
        </h1>
        <p>
          Care is less about getting everything right. More about noticing what
          matters.
        </p>
      </div>
      {guide ? (
        <>
          <a className="text-link back-link" href="guides.html">
            All care guides
          </a>
          <div className="article-layout">
            <aside className="guide-nav" aria-label="Care guide topics">
              {guides.map((g) => (
                <a
                  href={`#${g.slug}`}
                  key={g.slug}
                  aria-current={guide.slug === g.slug ? "page" : undefined}
                >
                  <Icon name={g.icon} />
                  {g.slug === "low-light"
                    ? "Low-light plants"
                    : g.slug.charAt(0).toUpperCase() + g.slug.slice(1)}
                </a>
              ))}
            </aside>
            <article className="guide-article" key={guide.slug}>
              <div className="article-mark">
                <Icon name={guide.icon} size={32} />
                <span className="eyebrow">{guide.time}</span>
              </div>
              <h2>{guide.title}</h2>
              <p className="lead">{guide.intro}</p>
              {guide.sections.map(([title, text]) => (
                <section key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </section>
              ))}
              <div className="article-source">
                Further reading:{" "}
                <a href={guide.source} target="_blank" rel="noreferrer">
                  University extension guidance
                </a>
                . Pair these fundamentals with your plant’s individual profile.
              </div>
              <a
                className="button secondary"
                href={
                  guide.slug === "low-light"
                    ? "library.html?light=Low"
                    : "library.html"
                }
              >
                {guide.slug === "low-light"
                  ? "Explore low-light plants"
                  : "Find your plant’s care profile"}
              </a>
            </article>
          </div>
        </>
      ) : (
        <div className="guides-grid">
          {guides.map((g, i) => (
            <a className="guide-large" key={g.slug} href={`#${g.slug}`}>
              <div className={`guide-visual guide-visual-${i}`}>
                <Icon name={g.icon} size={80} />
                <div className="guide-visual-orbit" />
                <span className="eyebrow">ROOTWISE / CARE NOTES</span>
              </div>
              <div className="guide-large-copy">
                <span className="eyebrow">{g.time}</span>
                <h2>{g.title}</h2>
                <p>{g.subtitle}</p>
                <span className="text-link">Read the guide</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
function Benefits() {
  return (
    <div className="page-shell benefits-page">
      <div className="page-heading">
        <span className="eyebrow">THE SCIENCE OF A GREENER SPACE</span>
        <h1>
          More life in your room.
          <br />
          <em>Less myth in your feed.</em>
        </h1>
        <p>
          There are good reasons to live with plants. Let’s keep the claims as
          grounded as the roots.
        </p>
      </div>
      <div className="benefits-hero">
        <div>
          <span className="eyebrow">START WITH WHAT WE KNOW</span>
          <h2>
            Connection.
            <br />
            Attention.
            <br />
            <em>A living rhythm.</em>
          </h2>
          <p>
            Watching a new leaf unfold can be its own reward. You don’t need an
            extraordinary health claim to make space for something green.
          </p>
        </div>
        <PlantArt
          shape="split"
          label="Decorative illustration of a leafy indoor plant"
        />
      </div>
      <div className="evidence-grid">
        <article>
          <span className="evidence-label">PROMISING, WITH LIMITS</span>
          <h2>A little nature, indoors.</h2>
          <p>
            Some studies report benefits for mood, comfort, or stress-related
            measures around indoor plants. Results vary with the setting, the
            people involved, and the research method.
          </p>
          <p>
            Research using plant images can tell us about preferences, but
            cannot establish that a real plant will improve someone’s health.
            Plants complement everyday wellbeing; they are not treatment.
          </p>
          <a href={sourceLinks.wellbeing}>RHS · houseplants and wellbeing</a>
          <a href="https://pubmed.ncbi.nlm.nih.gov/36334835/">
            Review · indoor plants and mental health
          </a>
        </article>
        <article>
          <span className="evidence-label">A PERSONAL EXPERIENCE</span>
          <h2>A habit worth keeping.</h2>
          <p>
            Noticing new growth, checking soil, and tending a living thing can
            create an enjoyable routine. The benefit is personal: there is no
            universal dose of plant care or guaranteed productivity boost.
          </p>
          <p>
            Choose plants that suit your energy, budget, and light. A healthy
            plant you enjoy is a better starting point than a roomful you
            struggle to maintain.
          </p>
          <a href="guides.html">Start with the care essentials</a>
        </article>
      </div>
      <section className="myth-panel">
        <div>
          <span className="eyebrow">LET’S CLEAR THE AIR</span>
          <h2>
            Your pothos is a plant.
            <br />
            <em>It isn’t an air purifier.</em>
          </h2>
        </div>
        <div>
          <p>
            Plants can remove some pollutants in sealed laboratory chambers.
            That does not translate into meaningful air cleaning from a few
            houseplants in a normally ventilated home.
          </p>
          <p>
            A review by Cummings and Waring found that passive potted plants
            remove volatile organic compounds too slowly to compete with typical
            building air exchange at practical plant densities.
          </p>
          <p>
            For air quality, address pollutant sources, ventilation, and
            appropriate filtration. Enjoy your plants for what they bring to
            daily life.
          </p>
          <a href={sourceLinks.air}>Read the Cummings & Waring review</a>
        </div>
      </section>
      <section className="benefit-cautions">
        <h2>Keep the whole picture in mind.</h2>
        <p>
          Some plants are toxic to pets or irritating to people. Damp potting
          mix can support fungus gnats, and flowers or mold can bother sensitive
          individuals. A little care and a good species choice go a long way.
        </p>
        <a className="button primary" href="library.html">
          Find a plant that fits
        </a>
      </section>
    </div>
  );
}
function About() {
  const flagged = plants.filter((p) => p.needsVerification);
  return (
    <div className="page-shell about-page">
      <div className="page-heading">
        <span className="eyebrow">ABOUT ROOTWISE</span>
        <h1>
          Curious by nature.
          <br />
          <em>Careful by choice.</em>
        </h1>
        <p>
          An independent, static field guide for people who want to understand
          their indoor plants.
        </p>
      </div>
      <div className="prose">
        <section>
          <h2>Good information should feel approachable.</h2>
          <p>
            Rootwise brings together 55 popular indoor plants and six evergreen
            care guides. This is a reference library, not a blog or a shop.
            There are no accounts, contributions, trackers, or personalized
            health claims. All content ships with the site.
          </p>
          <p>
            The design pairs botanical forms with the quiet precision of a field
            instrument. Every illustration is custom SVG. They are stylized
            studies, not photographs or tools for identifying an unknown plant.
          </p>
        </section>
        <section>
          <h2>Where the knowledge comes from.</h2>
          <p>
            Species profiles draw on university extension and botanical
            resources. Taxonomic synonyms are retained where nursery labels and
            references use different names. General care advice is a starting
            point, not a universal watering formula.
          </p>
          <ul>
            <li>
              <a href="https://plants.ces.ncsu.edu/">
                NC State Extension Gardener Plant Toolbox
              </a>{" "}
              — species descriptions, cultivation, and safety references.
            </li>
            <li>
              <a href={sourceLinks.care}>University of Florida IFAS</a> —
              houseplant care fundamentals.
            </li>
            <li>
              <a href={sourceLinks.light}>University of Minnesota Extension</a>{" "}
              — indoor light.
            </li>
            <li>
              <a href={sourceLinks.aspca}>ASPCA plant database</a> — cat and dog
              toxicity; exact species matters.
            </li>
            <li>
              <a href={sourceLinks.wellbeing}>Royal Horticultural Society</a> —
              wellbeing research and its limits.
            </li>
            <li>
              <a href={sourceLinks.air}>Cummings & Waring, 2019/2020</a> —
              review of passive plant air-cleaning claims.
            </li>
            <li>
              <a href="https://pubmed.ncbi.nlm.nih.gov/36334835/">
                2022 scoping review
              </a>{" "}
              — indoor plants and mental health.
            </li>
          </ul>
          <p>
            Each plant links to its supporting species or genus source.
            Genus-level sources are identified as such. Data notes distinguish
            unresolved details from reviewed material.
          </p>
        </section>
        <section id="safety">
          <h2>A careful note on safety.</h2>
          <p>
            “Pet-friendly” means listed as non-toxic to cats and dogs, not safe
            to eat. Any plant material may cause gastrointestinal upset.
            Toxicity to other animals can differ. This site does not provide
            veterinary or medical advice.
          </p>
          <p>
            Keep plants and loose parts away from small children. Do not eat or
            use a plant medicinally based on this guide. For suspected
            ingestion, contact a veterinarian or your local poison service; do
            not wait for symptoms or rely on an illustration for identification.
          </p>
          <p>
            Size groups describe typical indoor scale: small plants fit a shelf,
            medium plants need more room or trailing space, and large plants may
            need floor space and pruning. Conditions and cultivar can change the
            mature size substantially.
          </p>
        </section>
        <section>
          <h2>Open questions, openly marked.</h2>
          <p>
            Accuracy takes precedence over false certainty. The following
            profiles contain explicit verification notes. Unverified pet safety
            is excluded from the pet-friendly filter.
          </p>
          <ul className="verification-list">
            {flagged.map((p) => (
              <li key={p.slug}>
                <a href={`plant-${p.slug}.html`}>{p.commonName}</a>
                <p>{p.verificationNotes.join(" ")}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Credits & privacy.</h2>
          <p>
            Built with React, TypeScript, and Vite. Manrope by Mikhail Sharanda
            and DM Mono by Colophon Foundry are bundled locally under the SIL
            Open Font License. No fonts, illustrations, or scripts are loaded
            from a runtime CDN. See the repository’s font license files for the
            complete notices.
          </p>
          <p>
            Only your theme choice is saved locally in this browser. Search and
            filters can appear in the URL so you can share the view. Nothing is
            sent to an application server.
          </p>
          <a href="https://github.com/naumansaeed0/Rootwise">
            View the source on GitHub
          </a>
        </section>
      </div>
    </div>
  );
}
function NotFound({ plant = false }: { plant?: boolean }) {
  return (
    <div className="not-found">
      <span className="eyebrow">
        {plant ? "PLANT NOT FOUND" : "404 / A LITTLE OFF THE PATH"}
      </span>
      <PlantArt shape="grass" />
      <h1>
        Let’s get back
        <br />
        <em>to growing.</em>
      </h1>
      <p>
        {plant
          ? "That plant is not in our library. Try searching by name."
          : "This page hasn’t put down roots here."}
      </p>
      <div className="hero-actions">
        <a className="button primary" href="library.html">
          Explore the library
        </a>
        <a className="text-link" href="index.html">
          Back to the beginning
        </a>
      </div>
    </div>
  );
}
export default function App() {
  const titles: Record<string, string> = {
    home: "A little knowledge. A lot of growth.",
    library: "Find your kind of green",
    guides: "Care guides for happier plants",
    benefits: "The real benefits of indoor plants",
    about: "About, sources & credits",
    "404": "Page not found",
  };
  useEffect(() => {
    const p = plants.find((p) => p.slug === params.get("slug"));
    document.title = `${current === "plant" && p ? p.commonName + " — " + p.scientificName : titles[current] || "Page not found"} | Rootwise`;
    if (current === "plant" && p) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", p.description);
      document
        .querySelector('meta[property="og:title"]')
        ?.setAttribute("content", document.title);
    }
  }, []);
  return (
    <>
      <Header />
      <main id="main">
        {current === "home" ? (
          <Home />
        ) : current === "library" ? (
          <Library />
        ) : current === "plant" ? (
          <PlantDetail />
        ) : current === "guides" ? (
          <Guides />
        ) : current === "benefits" ? (
          <Benefits />
        ) : current === "about" ? (
          <About />
        ) : (
          <NotFound />
        )}
      </main>
      <Footer />
    </>
  );
}
