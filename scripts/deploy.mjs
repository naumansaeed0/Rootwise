/** Manual fallback for repositories where Actions cannot push workflow files.
 * Builds the current clean source and publishes ONLY dist to the generated branch.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, cpSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
const run = (args, cwd = process.cwd()) =>
  execFileSync(args[0], args.slice(1), { cwd, stdio: "inherit" });
const changed = execFileSync("git", ["status", "--porcelain"], {
  encoding: "utf8",
}).trim();
if (changed)
  throw new Error("Commit or stash your source changes before deploying.");
const remote = execFileSync("git", ["remote", "get-url", "origin"], {
  encoding: "utf8",
}).trim();
run(["npm", "run", "verify"]);
const temp = mkdtempSync(path.join(tmpdir(), "rootwise-publish-"));
try {
  cpSync("dist", temp, { recursive: true });
  run(["git", "init", "-b", "gh-pages"], temp);
  run(["git", "config", "user.name", "Rootwise deploy"], temp);
  run(
    ["git", "config", "user.email", "rootwise-deploy@users.noreply.github.com"],
    temp,
  );
  run(["git", "add", "."], temp);
  run(["git", "commit", "-m", "Publish verified Rootwise static build"], temp);
  run(["git", "push", "--force", remote, "gh-pages"], temp);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
