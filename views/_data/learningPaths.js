import Fetch from "@11ty/eleventy-fetch";

export default async function () {
  const learningPaths = await Fetch("https://app.cayas.fr/api/v1/lessons", {
    duration: "10m",
    type: "json",
  });

  return learningPaths;
}
