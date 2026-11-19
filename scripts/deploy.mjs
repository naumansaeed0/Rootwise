/** Publish only dist, appending to gh-pages history. Never force-push.
 * A detached worktree shares the existing checkout's Git authentication.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
const root = process.cwd();
const run = (args, cwd = root) =>
  execFileSync(args[0], args.slice(1), { cwd, stdio: "inherit" });
const read = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
if (read(["status", "--porcelain"]))
  throw new Error("Commit or stash your source changes before deploying.");
const source = read(["rev-parse", "--short", "HEAD"]);
run(["npm", "run", "verify"]);
run(["git", "fetch", "origin", "gh-pages"]);
const temp = mkdtempSync(path.join(tmpdir(), "rootwise-publish-"));
let worktree = false;
try {
  run(["git", "worktree", "add", "--detach", temp, "FETCH_HEAD"]);
  worktree = true;
  for (const name of readdirSync(temp))
    if (name !== ".git")
      rmSync(path.join(temp, name), { recursive: true, force: true });
  cpSync(path.join(root, "dist"), temp, { recursive: true });
  run(["git", "add", "--all"], temp);
  const diff = spawnSync("git", ["diff", "--cached", "--quiet"], {
    cwd: temp,
    stdio: "ignore",
  });
  if (diff.status === 0) console.log("Published output is already up to date.");
  else if (diff.status === 1) {
    run(
      [
        "git",
        "-c",
        "user.name=Rootwise deploy",
        "-c",
        "user.email=rootwise-deploy@users.noreply.github.com",
        "commit",
        "-m",
        `chore: publish Rootwise from ${source}`,
      ],
      temp,
    );
    run(["git", "push", "origin", "HEAD:refs/heads/gh-pages"], temp);
  } else throw new Error("Unable to inspect the staged publication.");
} finally {
  if (worktree) run(["git", "worktree", "remove", "--force", temp]);
  else rmSync(temp, { recursive: true, force: true });
}
