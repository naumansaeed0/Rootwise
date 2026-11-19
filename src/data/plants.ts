import data from "./plants.json";
export type Plant = (typeof data)[number];
export const plants: Plant[] = data;
export const categories = [...new Set(plants.map((p) => p.category))];
export const sourceLinks = {
  aspca:
    "https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants",
  light:
    "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/lighting-for-indoor-plants",
  care: "https://gardeningsolutions.ifas.ufl.edu/plants/houseplants/houseplant-care/",
  air: "https://pubmed.ncbi.nlm.nih.gov/31695112/",
  wellbeing:
    "https://www.rhs.org.uk/science/articles/houseplants-for-wellbeing",
};
export function filterPlants(query: string, filters: Record<string, string>) {
  const q = query.trim().toLocaleLowerCase();
  return plants.filter(
    (p) =>
      [p.commonName, p.scientificName, ...p.alternateNames].some((n) =>
        n.toLocaleLowerCase().includes(q),
      ) &&
      Object.entries(filters).every(
        ([key, value]) =>
          !value ||
          (key === "pets"
            ? p.toxicity.pets === value
            : p[key as "light" | "difficulty" | "size" | "category"] === value),
      ),
  );
}
