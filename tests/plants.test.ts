import test from "node:test";
import assert from "node:assert/strict";
import { plants, filterPlants } from "../src/data/plants";
test("library contains 55 unique, complete botanical records", () => {
  assert.equal(plants.length, 55);
  assert.equal(new Set(plants.map((p) => p.slug)).size, 55);
  for (const p of plants) {
    assert.match(p.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const value of Object.values(p.care))
      assert.ok(value.trim().length > 0, `${p.slug}: incomplete care`);
    assert.ok(p.sources.every((s) => s.url.startsWith("https://")));
    assert.equal(
      p.needsVerification,
      p.verificationNotes.length > 0,
      `${p.slug}: missing visible notes`,
    );
    if (p.toxicity.pets === "Unverified") assert.ok(p.needsVerification);
  }
});
test("search handles common, scientific, alternate names and whitespace", () => {
  assert.deepEqual(
    filterPlants("  SANSEVIERIA ", {}).map((p) => p.slug),
    ["snake-plant"],
  );
  assert.deepEqual(
    filterPlants("epipremnum aureum", {}).map((p) => p.slug),
    ["pothos"],
  );
  assert.deepEqual(
    filterPlants("ZZ PLANT", {}).map((p) => p.slug),
    ["zz-plant"],
  );
  assert.equal(filterPlants("not-a-plant", {}).length, 0);
});
test("combined filters exclude toxic and unverified plants from pet-friendly results", () => {
  const safe = filterPlants("", { pets: "Non-toxic" });
  assert.ok(safe.length > 10);
  assert.ok(
    !safe.some((p) =>
      [
        "pothos",
        "chinese-money-plant",
        "bird-of-paradise",
        "purple-heart",
      ].includes(p.slug),
    ),
  );
  assert.deepEqual(
    filterPlants("", {
      pets: "Non-toxic",
      light: "Low",
      difficulty: "Easy",
    }).map((p) => p.slug),
    ["cast-iron-plant"],
  );
  assert.equal(
    filterPlants("", { category: "Ferns", pets: "Non-toxic" }).length,
    3,
  );
});
test("uncertain safety remains searchable and never masquerades as non-toxic", () => {
  const unverified = filterPlants("", { pets: "Unverified" });
  assert.ok(unverified.length);
  assert.ok(
    unverified.every((p) =>
      p.verificationNotes.some((n) => /toxicity|safety/.test(n)),
    ),
  );
  assert.equal(
    filterPlants("", { pets: "Non-toxic", category: "Indoor trees" }).length,
    1,
  );
});
