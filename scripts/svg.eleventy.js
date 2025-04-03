import { readFile } from "node:fs/promises";
import { normalize } from "node:path";

export default async function svgPlugin(cfg) {
  cfg.addAsyncFilter("svg", async (path) => {
    try {
      return await readFile(normalize(`./views/${path}`), "utf-8");
    } catch (e) {
      console.error(e);
    }
  });
}
