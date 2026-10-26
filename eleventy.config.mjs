import { readFileSync } from "node:fs";
import Image from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // GitHub Pages: repo名がサブパスになるので環境変数で切り替え
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

  // 単独ファイルの配信（OG画像とfaviconのみ。写真は eleventy-img が生成する）
  eleventyConfig.addPassthroughCopy({ "src/img/og.jpg": "img/og.jpg" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  // CSS/JSはLP単一ページなのでHTMLへインライン化し、リクエスト自体を消す
  eleventyConfig.addGlobalData("inlineCss", readFileSync(new URL("./src/css/style.css", import.meta.url), "utf8"));
  eleventyConfig.addGlobalData("inlineJs", readFileSync(new URL("./src/js/main.js", import.meta.url), "utf8"));

  // レスポンシブ画像: AVIF/WebP/JPEG + 複数幅 + width/height自動付与（CLS対策）
  eleventyConfig.addAsyncShortcode("image", async function (src, alt, options = {}) {
    const metadata = await Image(`src/img/${src}`, {
      widths: options.widths || [480, 800, 1200, 1600],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "_site/img/",
      urlPath: `${pathPrefix}img/`,
      filenameFormat: (id, srcPath, width, format) => {
        const base = srcPath.split("/").pop().split(".")[0];
        return `${base}-${width}w.${format}`;
      },
      sharpAvifOptions: { quality: 55 },
      sharpWebpOptions: { quality: 75 },
      sharpJpegOptions: { quality: 78 },
    });
    const attrs = {
      alt,
      sizes: options.sizes || "(max-width: 860px) 92vw, 1120px",
      loading: options.loading || "lazy",
      decoding: "async",
    };
    if (options.class) attrs.class = options.class;
    if (options.loading === "eager") attrs.fetchpriority = "high";
    return Image.generateHTML(metadata, attrs);
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

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
