export type LibraryView = "grid" | "list";
export const viewStorageKey = "rootwise-library-view";
export function readLibraryView(): LibraryView {
  try {
    return typeof localStorage !== "undefined" &&
      localStorage.getItem(viewStorageKey) === "list"
      ? "list"
      : "grid";
  } catch {
    return "grid";
  }
}
export function saveLibraryView(view: LibraryView) {
  try {
    localStorage.setItem(viewStorageKey, view);
  } catch {
    /* View controls remain usable without browser storage. */
  }
}
