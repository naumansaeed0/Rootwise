import type { Plant } from "../../data/plants";
import { plants } from "../../data/plants";
import { Meter, SafetyStatus } from "./Instrument";
export const specimenCode = (plant: Plant) =>
  `RW–${String(plants.findIndex((p) => p.slug === plant.slug) + 1).padStart(3, "0")}`;
/** Water advice has no numeric frequency field. Present the existing text faithfully,
 * never infer a thirst score or a watering schedule from plant category. */
export function waterReadout(plant: Plant) {
  const text = plant.care.water;
  if (text.startsWith("Allow the mix to dry through"))
    return { label: "Dry through", note: "Dry mix before watering", level: 1 };
  if (text.startsWith("Let the upper third"))
    return {
      label: "Upper third dry",
      note: "Check below the surface",
      level: 2,
    };
  if (text.startsWith("Keep the mix lightly"))
    return { label: "Evenly moist", note: "Never saturated", level: 3 };
  if (text.startsWith("Water thoroughly when the top"))
    return { label: "Top 2–3 cm dry", note: "Drain excess water", level: 2 };
  if (text.startsWith("Water when the bark"))
    return { label: "Bark nearly dry", note: "Drain completely", level: 2 };
  if (text.startsWith("Moisten the root ball"))
    return { label: "Approaching dry", note: "Let the medium drain", level: 2 };
  if (text.startsWith("Keep a little fresh water"))
    return {
      label: "Fresh central cup",
      note: "Flush water regularly",
      level: 3,
    };
  return {
    label: "See care record",
    note: "Read the full water guidance",
    level: 0,
  };
}
export function PlantReadouts({ plant }: { plant: Plant }) {
  const water = waterReadout(plant);
  return (
    <div className="ui-readouts">
      <div className="ui-readout">
        <span className="ui-readout-label">Light</span>
        <span className="ui-readout-value">
          <Meter
            value={
              ["Low", "Medium", "Bright indirect", "Direct sun"].indexOf(
                plant.light,
              ) + 1
            }
          />
          {plant.light}
        </span>
      </div>
      <div className="ui-readout">
        <span className="ui-readout-label">Water · soil check</span>
        <span className="ui-readout-value">
          <Meter value={water.level} total={3} />
          {water.label}
        </span>
      </div>
      <div className="ui-readout">
        <span className="ui-readout-label">Care level</span>
        <span className="ui-readout-value">
          <Meter
            value={
              ["Easy", "Moderate", "Demanding"].indexOf(plant.difficulty) + 1
            }
            total={3}
          />
          {plant.difficulty}
        </span>
      </div>
      <div className="ui-readout">
        <span className="ui-readout-label">Cats & dogs</span>
        <SafetyStatus value={plant.toxicity.pets} />
      </div>
    </div>
  );
}
