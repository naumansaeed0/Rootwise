import { PlantArt } from "./PlantArt";
import { Icon } from "./Icon";
import type { Plant } from "../data/plants";
export function PlantCard({
  plant,
  index = 0,
}: {
  plant: Plant;
  index?: number;
}) {
  return (
    <a
      className="plant-card"
      data-palette={plant.theme}
      href={`plant-${plant.slug}.html`}
    >
      <div className="plant-card-art">
        <span className="card-category">{plant.category}</span>
        <PlantArt shape={plant.shape} seed={index} />
        <span className="card-open">
          <Icon name="plus" size={18} />
        </span>
      </div>
      <div className="plant-card-copy">
        <div className="plant-card-title">
          <h3>{plant.commonName}</h3>
          <span
            className={`difficulty ${plant.difficulty === "Easy" ? "easy" : ""}`}
          >
            {plant.difficulty}
          </span>
        </div>
        <p className="scientific">{plant.scientificName}</p>
        <div className="card-traits">
          <span>
            <Icon name="sun" size={14} />
            {plant.light}
          </span>
          <span>
            <Icon
              name={plant.toxicity.pets === "Non-toxic" ? "shield" : "leaf"}
              size={14}
            />
            {plant.toxicity.pets === "Non-toxic"
              ? "Pet-friendly"
              : plant.toxicity.pets === "Toxic"
                ? "Keep from pets"
                : "Safety unverified"}
          </span>
        </div>
      </div>
    </a>
  );
}
