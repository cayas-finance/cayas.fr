import { parse, relative } from "node:path";
import * as sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";

export default async function (cfg) {
  cfg.setInputDirectory("views");

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

      let dependencies = sassResult.loadedUrls
        .filter((dep) => dep.protocol === "file:")
        .map((entry) => {
          return relative(".", entry.pathname);
        });

      this.addDependencies(inputPath, dependencies);

      const result = await postcss([autoprefixer(), cssnanoPlugin()]).process(sassResult.css);

      return async () => {
        return result.css;
      };
    },
  });

}
