import SVGSpriter from "svg-sprite";
import { parse } from "node:path";
import { readdir, mkdir, writeFile } from "node:fs/promises";

const sprites = {};

export default function spritePlugin(cfg) {
  cfg.addTemplateFormats("svg");
  cfg.addExtension("svg", {
    outputFileExtension: "svg",
    compile: async (inputContent, inputPath) => {
      const parsed = parse(inputPath);
      if (parsed.dir !== "./views/assets/sprites") {
        return;
      }

      if (!sprites[parsed.base]) {
        sprites[parsed.base] = inputContent;
      }

      let dir = await readdir(parsed.dir);
      const inter = dir.filter(
        (f) => f.slice(-4) === ".svg" && Object.keys(sprites).includes(f)
      );

      if (inter.length === dir.length) {
        const spriter = new SVGSpriter({
          dest: "./_site/assets",
          mode: {
            inline: true,
            symbol: {
              dest: "",
              sprite: "sprites.svg",
              example: false,
            },
          },
        });
        dir.forEach((filename) =>
          spriter.add(filename, null, sprites[filename])
        );

        await mkdir("./_site/assets", { recursive: true });
        const { result } = await spriter.compileAsync();
        for (const mode of Object.values(result)) {
          for (const resource of Object.values(mode)) {
            await writeFile(resource.path, resource.contents);
          }
        }
      }

      return;
    },
  });
}
