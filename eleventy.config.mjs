export default function (eleventyConfig) {
  // GitHub Pages: repo名がサブパスになるので環境変数で切り替え
  // ローカル: /  , GitHub Pages: /muse-11ty-lp/
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addFilter("upper", (v) => String(v).toUpperCase());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
