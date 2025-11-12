import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import spritePlugin from "./scripts/sprite.eleventy.js";
import svgPlugin from "./scripts/svg.eleventy.js";
import { cssImage } from "./scripts/image.postcss.js";

export default async function (cfg) {
  cfg.setInputDirectory("views");

  // JavaScript
  cfg.addPassthroughCopy("views/js");

  // Assets
  cfg.addPassthroughCopy("views/assets/favicon");
  cfg.addPassthroughCopy("views/assets/fonts");

  // pdfs
  cfg.addPassthroughCopy("views/assets/files");

  // Images
  cfg.addPlugin(eleventyImageTransformPlugin, {
    formats: ["auto"],
  });

  // sprites
  cfg.addPlugin(spritePlugin);

  // svg
  cfg.addPlugin(svgPlugin);

  // CSS
  cfg.addTemplateFormats("css");
  cfg.addExtension("css", {
    outputFileExtension: "css",
    compile: async (inputContent, inputPath) => {
      return async () => {
        let output = await postcss([
          autoprefixer,
          cssnanoPlugin,
          cssImage,
        ]).process(inputContent, { from: inputPath });

        return output.css;
      };
    },
  });

  // Ignore GitIgnore :)
  cfg.setUseGitIgnore(false);
}
