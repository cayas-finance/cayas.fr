import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import { marked } from "marked";
import { charts } from "./scripts/charts.marked.js";

const R_FootNote = /\[(?<footnote>.{1,3})\]/gm;

export default async function (cfg) {
  cfg.setInputDirectory("views");

  // JavaScript
  cfg.addPassthroughCopy("js");

  // Assets
  cfg.addPassthroughCopy("assets");

  // CSS
  cfg.addTemplateFormats("css");
  cfg.addExtension("css", {
    outputFileExtension: "css",
    compile: async (inputContent, inputPath) => {
      return async () => {
        let output = await postcss([autoprefixer, cssnanoPlugin]).process(
          inputContent,
          { from: inputPath }
        );

        return output.css;
      };
    },
  });

  // Markdown
  cfg.addFilter("markdown", async (content) => {
    // Charts
    marked.use(charts());

    // FootNotes
    content = content.replace(R_FootNote, '');

    // image in localhost
    content = content.replace("/api", "http://localhost:4200/api");
    return await marked.parse(content);
  });
}
