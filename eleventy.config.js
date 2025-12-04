import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import spritePlugin from "./scripts/sprite.eleventy.js";
import svgPlugin from "./scripts/svg.eleventy.js";
import { cssImage } from "./scripts/image.postcss.js";
import { marked } from "marked";
import dayjs from "dayjs";
import "dayjs/locale/fr.js";

dayjs.locale("fr");

const colorsList = [
  "fuschia",
  "aqua",
  "lilac",
  "pink",
  "yellow",
  "green",
  "blue",
  "purple",
]
const getColorFromString = (str = "default") => {
  const index = Math.abs(str.toLowerCase().split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0)) % colorsList.length;
  return colorsList[index] || colorsList[0];
}

export default async function (cfg) {
  cfg.setInputDirectory("views");


 // Slugify function to remove special characters and create URL-friendly slugs
 const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    // Normalize and remove accents (é -> e, à -> a, etc.)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9]+/g, "-")
    // Remove multiple consecutive hyphens
    .replace(/-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
};

  const tagMapper = (tag) => {
    return {
      name: tag,
      slug: slugify(tag),
    };
  };

  // Blog Collection
  cfg.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("views/blog/*.md")
      .filter((item) => {
        // Filter out drafts (published: false)
        return item.data.published === true;
      })
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.data.date || a.date);
        const dateB = new Date(b.data.date || b.date);
        return dateB - dateA;
      })
      .map((item) => {
        // Ensure all expected fields exist with defaults
        const data = item.data;

        // Generate slug from filename if not provided
        if (!data.slug && item.fileSlug) {
          // Remove date prefix from filename if present
          data.slug = item.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
        }

        // Set defaults
        data.author = data.author || "L'équipe Cayas";
        data.tags = data.tags || [];
        data.categories = data.categories || [];
        data.excerpt = data.excerpt || "";
        data.featured_image = data.featured_image || null;
        data.color = getColorFromString(data.title || data.slug);

        data.tags = data.tags.map(tagMapper);

        if (data.date && !(data.date instanceof Date)) {
          data.date = new Date(data.date);
        }

        return item;
      });
  });

  cfg.addCollection("tags", function (collectionApi) {
    // Get all blog posts
    const blogPosts = collectionApi
      .getFilteredByGlob("views/blog/*.md")
      .filter((item) => {
        return item.data.published === true;
      });

    // Extract and map all tags
    const allTags = blogPosts
      .flatMap((item) => {
        const tags = item.data.tags || [];
        return tags;
      });

    // Deduplicate tags by slug
    const uniqueTagsMap = new Map();
    allTags.forEach((tag) => {
      if (!uniqueTagsMap.has(tag.slug)) {
        uniqueTagsMap.set(tag.slug, tag);
      }
    });

    // Return array of unique tags, sorted by name
    return Array.from(uniqueTagsMap.values()).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  });

  // Date formatting filters (used in blog)
  cfg.addFilter("date", (date, format) => {
    if (!date) return "";

    const d = dayjs(date);
    if (!d.isValid()) {
      return "";
    }

    return d.format(format);
  });

  // Filter posts by tag slug
  cfg.addFilter("postsByTag", (posts, tagSlug) => {
    return posts.filter((post) => {
      if (!post.data || !post.data.tags) return false;
      return post.data.tags.some((tag) => tag.slug === tagSlug);
    });
  });

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

  // Markdown
  cfg.addFilter("markdown", async (content) => {
    content = await marked.parse(content);

    return content;
  });

  // Ignore GitIgnore :)
  cfg.setUseGitIgnore(false);
}
