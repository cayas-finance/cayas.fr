import { parse, relative } from "node:path";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";

export default async function (cfg) {
  cfg.setInputDirectory("views");

  // JavaScript
  cfg.addPassthroughCopy("js");

  // Assets
  cfg.addPassthroughCopy("assets");

  // CSS
  cfg.addTemplateFormats('css');
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
}
