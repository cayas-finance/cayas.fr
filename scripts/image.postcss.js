import EleventyImage from "@11ty/eleventy-img";

let options = {
  formats: ["auto"],
  outputDir: "_site/img/",
};

async function processImage(decl) {
  if (decl.value.includes("url(")) {
    const url = decl.value.match(/url\("(.+)"\)/)[1];
    try {
      const images = await EleventyImage(`./views${url}`, options);
      const image = Object.values(images)[0][0];
      decl.value = `url("${image.url}")`;
    } catch (e) {}
  }
}

export function cssImage() {
  return {
    postcssPlugin: "cssImage",
    Declaration: {
      "background-image": processImage,
      "mask-image": processImage,
    },
  };
}

cssImage.postcss = true;
