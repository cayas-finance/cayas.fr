import { parse, relative } from "node:path";
import * as sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
// import { minify } from "terser";

export default async function (cfg) {
  cfg.setInputDirectory("views");

  // CSS
  cfg.addWatchTarget("scss");
  cfg.addTemplateFormats("scss");
  cfg.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      let parsed = parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      let sassResult = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
        sourceMap: false, // or true, your choice!
      });

      
      return async () => {
        
        let dependencies = sassResult.loadedUrls
          .filter((dep) => dep.protocol === "file:")
          .map((entry) => {
            return relative(".", entry.pathname);
          });
  
        this.addDependencies(inputPath, dependencies);
  
        const result = await postcss([autoprefixer()]).process(
          sassResult.css
        );
        
        return result.css;
      };
    },
  });

  // JavaScript
  cfg.addPassthroughCopy("js")

  // Assets
  cfg.addPassthroughCopy("assets")
}
