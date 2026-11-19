import { useEffect, useState } from "react";
import { plants, sourceLinks } from "./data/plants";
import { guides } from "./data/guides";
import { Icon } from "./components/Icon";
import { PlantArt } from "./components/PlantArt";
import { PlantCard } from "./components/PlantCard";
import { LivingPlant } from "./living-plant/LivingPlant";
import { Library } from "./pages/Library";
import {
  Panel,
  PageIntro,
  ReadoutLabel,
  SectionHeading,
  SafetyStatus,
} from "./components/ui/Instrument";
import { PlantReadouts, specimenCode } from "./components/ui/PlantReadouts";
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
          <span>rootwise</span>
        </a>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={menu ? "nav-open" : ""}
        >
          {[
            ["home", "Discover", "index.html"],
            ["library", "Plant library", "library.html"],
            ["guides", "Care guides", "guides.html"],
            ["benefits", "Why plants?", "benefits.html"],
          ].map(([key, label, href], i) => (
            <a
              key={key}
              href={href}
              aria-current={current === key ? "page" : undefined}
            >
              <span className="nav-index" aria-hidden="true">
                {String(i).padStart(2, "0")}
              </span>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-end">
          <span className="header-tag">
            <ReadoutLabel>FIELD GUIDE / INDOOR BOTANY</ReadoutLabel>
          </span>
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
            aria-controls="primary-navigation"
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
        <ReadoutLabel index="RW">END OF FIELD NOTES</ReadoutLabel>
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
  index = "01",
}: {
  kicker: string;
  title: string;
  text?: string;
  href?: string;
  label?: string;
  index?: string;
}) {
  return (
    <SectionHeading
      index={index}
      label={kicker}
      title={title}
      text={text}
      href={href}
      linkLabel={label}
    />
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
          index="02"
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
                <ReadoutLabel>{g.time}</ReadoutLabel>
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
        <Panel className="detail-art">
          <div className="detail-orbit" />
          <PlantArt
            shape={plant.shape}
            label={`Stylized illustration of ${plant.commonName}; not an identification reference`}
          />
          <span className="eyebrow">
            {specimenCode(plant)} / {plant.family.toUpperCase()}
          </span>
        </Panel>
        <div className="detail-intro">
          <ReadoutLabel index={specimenCode(plant)}>
            SPECIMEN RECORD
          </ReadoutLabel>
          <span className="eyebrow">{plant.category}</span>
          <h1>{plant.commonName}</h1>
          <p className="detail-scientific">{plant.scientificName}</p>
          <p className="lead">{plant.description}</p>
          <PlantReadouts plant={plant} />
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
          <Panel as="section" className="detail-section">
            <SectionHeading
              index="02"
              label="WHEN SOMETHING FEELS OFF"
              title="Common problems, considered."
            />
            {plant.commonProblems.map((p) => (
              <details className="problem" key={p.symptom}>
                <summary>
                  {p.symptom}
                  <Icon name="plus" size={18} />
                </summary>
                <p>{p.fix}</p>
              </details>
            ))}
          </Panel>
          <Panel as="section" className="detail-section">
            <SectionHeading
              index="03"
              label="MORE THAN A PRETTY LEAF"
              title="What it brings to your space."
            />
            {plant.benefits.map((b) => (
              <p key={b}>{b}</p>
            ))}
            <p className="muted">
              These are general lifestyle benefits, not species-specific health
              outcomes. <a href="benefits.html">Read the evidence.</a>
            </p>
          </Panel>
          <Panel as="section" className="detail-section">
            <SectionHeading
              index="04"
              label="BOTANICAL CONNECTIONS"
              title="Also worth knowing."
            />
            <p>
              Related species and cultivated forms. These names are starting
              points for further research, not separate care profiles.
            </p>
            <div className="related-tags">
              {plant.related.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          </Panel>
          <Panel as="section" className="detail-section profile-sources">
            <SectionHeading
              index="05"
              label="REFERENCES"
              title="Sources & editorial notes"
            />
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
          </Panel>
        </div>
        <aside className="detail-sidebar">
          <Panel className="safety-card">
            <Icon name="shield" size={26} />
            <ReadoutLabel index="S">SAFETY RECORD</ReadoutLabel>
            <div className="record-safety-status">
              <SafetyStatus value={plant.toxicity.pets} />
            </div>
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
          </Panel>
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
          index="06"
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
      <PageIntro
        index="02"
        label="ROOTWISE / CARE PROTOCOLS"
        title={
          <>
            Good habits.
            <br />
            <em>Happier plants.</em>
          </>
        }
        description="Care is less about getting everything right. More about noticing what matters."
        icon="book"
      />
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
            <Panel as="article" className="guide-article" key={guide.slug}>
              <div className="article-mark">
                <Icon name={guide.icon} size={32} />
                <ReadoutLabel
                  index={String(guides.indexOf(guide) + 1).padStart(2, "0")}
                >
                  {guide.time}
                </ReadoutLabel>
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
            </Panel>
          </div>
        </>
      ) : (
        <div className="guides-grid">
          {guides.map((g, i) => (
            <a
              className="guide-large ui-panel ui-panel--bracket"
              key={g.slug}
              href={`#${g.slug}`}
            >
              <div className={`guide-visual guide-visual-${i}`}>
                <Icon name={g.icon} size={80} />
                <div className="guide-visual-orbit" />
                <ReadoutLabel index={String(i + 1).padStart(2, "0")}>
                  CARE PROTOCOL
                </ReadoutLabel>
              </div>
              <div className="guide-large-copy">
                <ReadoutLabel>{g.time}</ReadoutLabel>
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
      <PageIntro
        index="03"
        label="ROOTWISE / EVIDENCE FILE"
        title={
          <>
            More life in your room.
            <br />
            <em>Less myth in your feed.</em>
          </>
        }
        description="There are good reasons to live with plants. Let’s keep the claims as grounded as the roots."
        icon="leaf"
      />
      <Panel as="div" className="benefits-hero">
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
      </Panel>
      <div className="evidence-grid">
        <Panel as="article" className="evidence-panel">
          <ReadoutLabel index="01">PROMISING, WITH LIMITS</ReadoutLabel>
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
        </Panel>
        <Panel as="article" className="evidence-panel">
          <ReadoutLabel index="02">A PERSONAL EXPERIENCE</ReadoutLabel>
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
        </Panel>
      </div>
      <Panel as="section" className="myth-panel">
        <div>
          <ReadoutLabel index="03">LET’S CLEAR THE AIR</ReadoutLabel>
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
      </Panel>
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
      <PageIntro
        index="04"
        label="ROOTWISE / FIELD NOTES"
        title={
          <>
            Curious by nature.
            <br />
            <em>Careful by choice.</em>
          </>
        }
        description="An independent, static field guide for people who want to understand their indoor plants."
        icon="sprout"
      />
      <div className="prose">
        <Panel as="section" className="prose-section">
          <SectionHeading
            index="01"
            label="FIELD NOTE"
            title="Good information should feel approachable."
          />
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
        </Panel>
        <Panel as="section" className="prose-section">
          <SectionHeading
            index="02"
            label="FIELD NOTE"
            title="Where the knowledge comes from."
          />
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
        </Panel>
        <Panel as="section" className="prose-section" id="safety">
          <SectionHeading
            index="03"
            label="FIELD NOTE"
            title="A careful note on safety."
          />
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
        </Panel>
        <Panel as="section" className="prose-section">
          <SectionHeading
            index="04"
            label="FIELD NOTE"
            title="Open questions, openly marked."
          />
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
        </Panel>
        <Panel as="section" className="prose-section">
          <SectionHeading
            index="05"
            label="FIELD NOTE"
            title="Credits & privacy."
          />
          <p>
            Built with React, TypeScript, and Vite. Manrope by Mikhail Sharanda
            and DM Mono by Colophon Foundry are bundled locally under the SIL
            Open Font License. No fonts, illustrations, or scripts are loaded
            from a runtime CDN. See the repository’s font license files for the
            complete notices.
          </p>
          <p>
            Your theme choice and preferred library view are saved locally in
            this browser. Search and filters can appear in the URL so you can
            share the view. Nothing is sent to an application server.
          </p>
          <a href="https://github.com/naumansaeed0/Rootwise">
            View the source on GitHub
          </a>
        </Panel>
      </div>
    </div>
  );
}
function NotFound({ plant = false }: { plant?: boolean }) {
  return (
    <Panel className="not-found">
      <ReadoutLabel index="00">ROOTWISE / RECORD NOT LOCATED</ReadoutLabel>
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
    </Panel>
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
          <Library initialParams={params} />
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
