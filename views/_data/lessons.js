import Fetch from "@11ty/eleventy-fetch";

export default async function () {
  const learningPaths = await Fetch("https://app.cayas.fr/api/v1/lessons", {
    duration: "1d",
    type: "json",
  });

  const lessons = [];

  for (const learningPath of learningPaths) {
    for (const { id } of learningPath.lessons) {
      const lesson = await Fetch(`https://app.cayas.fr/api/v1/lessons/${id}`, {
        duration: "1d",
        type: "json",
      });
      lessons.push(lesson);
    }
  }

  return lessons;
}
