import { renderToString } from "react-dom/server";
import App, { setRoute } from "./App";
export function render(url: string) {
  setRoute(url);
  return renderToString(<App />);
}
