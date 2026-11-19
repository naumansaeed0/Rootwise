import { PlantArt } from "./PlantArt";
import { Icon } from "./Icon";
import { PlantReadouts, specimenCode } from "./ui/PlantReadouts";
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
      className="specimen-card ui-panel"
      data-palette={plant.theme}
      href={`plant-${plant.slug}.html`}
    >
      <div className="specimen-card-header">
        <span className="specimen-id">{specimenCode(plant)}</span>
        <span className="specimen-category">{plant.category}</span>
      </div>
      <div className="specimen-art ui-scan-texture">
        <div className="specimen-orbit" aria-hidden="true" />
        <PlantArt shape={plant.shape} seed={index} />
        <span className="specimen-art-label">BOTANICAL STUDY</span>
        <span className="specimen-marker" aria-hidden="true">
          <Icon name="plus" size={17} />
        </span>
      </div>
      <div className="specimen-body">
        <div className="specimen-title">
          <h3>{plant.commonName}</h3>
          <span className="specimen-size">{plant.size}</span>
        </div>
        <p className="specimen-scientific">{plant.scientificName}</p>
        <PlantReadouts plant={plant} />
      </div>
      <div className="specimen-card-footer">
        <span>{plant.family}</span>
        <span>
          Open record <Icon name="plus" size={12} />
        </span>
      </div>
    </a>
  );
}
