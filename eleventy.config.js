// import svgSprite from "eleventy-plugin-svg-sprite";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import { marked } from "marked";
import { charts } from "./scripts/charts.marked.js";
import { table } from "./scripts/table.marked.js";
import { legend } from "./scripts/legend.marked.js";
import { ninja } from "./scripts/ninja.marked.js";
import { cssImage } from "./scripts/image.postcss.js";
import katex from "katex";

const R_FootNote = /\[(?<footnote>.{1,3})\]/gm;
const R_Equation = /\$\$(?<equation>[^\$]*)\$\$/gm;
const R_InlineEquation = /\$(?<equation>[^\$]*)\$/gm;

export default async function (cfg) {
  cfg.setInputDirectory("views");

  // JavaScript
  // cfg.addPassthroughCopy("js");

  // Assets
  cfg.addPassthroughCopy("views/assets/favicon");
  cfg.addPassthroughCopy("views/assets/fonts");

  // Images
  cfg.addPlugin(eleventyImageTransformPlugin);

  // sprites
  // cfg.addWatchTarget("views/assets/sprites/*.svg");
  // cfg.addPlugin(svgSprite, {
  //   path: "views/assets/sprites", // relative path to SVG directory
  //   outputFilepath: "_site/assets/sprites/icons.svg",
  // });

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

  // Markdown
  cfg.addFilter("markdown", async (content) => {
    // Charts, Tables, Legands, Ninja
    marked.use(charts(), table(), legend(), ninja());

    // FootNotes
    content = content.replace(R_FootNote, "");

    // image in localhost
    content = content.replace("/api", "http://localhost:4200/api");

    // Equations
    const equations = [];
    content = content.replaceAll(R_Equation, (_, eq) => {
      equations.push(eq);
      return "@EQUATION";
    });
    content = content.replaceAll(R_InlineEquation, (_, eq) => {
      equations.push(eq);
      return "@EQUATION";
    });

    content = await marked.parse(content);

    // Math expression : Convert and replace
    equations.forEach((equation) => {
      content = content.replace(
        "@EQUATION",
        katex.renderToString(equation, {
          throwOnError: false,
          output: "mathml",
        })
      );
    });

    return content;
  });
}
