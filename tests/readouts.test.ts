import test from "node:test";
import assert from "node:assert/strict";
import { plants } from "../src/data/plants";
import { specimenCode, waterReadout } from "../src/components/ui/PlantReadouts";
import {
  readLibraryView,
  saveLibraryView,
  viewStorageKey,
} from "../src/library/preferences";
test("specimen identity is stable across filtering and shared with records", () => {
  assert.equal(
    specimenCode(plants.find((p) => p.slug === "pothos")!),
    "RW–001",
  );
  assert.equal(new Set(plants.map(specimenCode)).size, 55);
  assert.equal(specimenCode(plants[54]), "RW–055");
});
test("water readouts preserve existing moisture instructions without guessed schedules", () => {
  for (const plant of plants) {
    const r = waterReadout(plant);
    assert.notEqual(r.label, "See care record", plant.slug);
    assert.ok(r.level >= 1 && r.level <= 3);
    assert.ok(!/day|week|month/.test(r.label));
  }
  assert.equal(
    waterReadout(plants.find((p) => p.slug === "boston-fern")!).label,
    "Evenly moist",
  );
  assert.equal(
    waterReadout(plants.find((p) => p.slug === "snake-plant")!).label,
    "Dry through",
  );
});
test("view persistence handles corrupt values and storage errors", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  let value = "corrupt";
  try {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => (key === viewStorageKey ? value : null),
        setItem: (key: string, v: string) => {
          assert.equal(key, viewStorageKey);
          value = v;
        },
      },
    });
    assert.equal(readLibraryView(), "grid");
    saveLibraryView("list");
    assert.equal(readLibraryView(), "list");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("denied");
      },
    });
    assert.equal(readLibraryView(), "grid");
    assert.doesNotThrow(() => saveLibraryView("list"));
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete (globalThis as { localStorage?: unknown }).localStorage;
  }
});
