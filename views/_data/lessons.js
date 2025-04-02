import Fetch from "@11ty/eleventy-fetch";

export default async function () {
  const learningPaths = await Fetch("https://app.cayas.fr/api/v1/lessons", {
    duration: "10m",
    type: "json",
  });

  const lessons = [];

  for (const learningPath of learningPaths) {
    for (const {id} of learningPath.lessons) {
      const lesson = await Fetch(
        `https://app.cayas.fr/api/v1/lessons/${id}`,
        {
          duration: "10m",
          type: "json",
        }
      );
      lessons.push(lesson);
    }
  }

  return lessons;
}
