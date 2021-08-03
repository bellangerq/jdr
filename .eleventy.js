const path = require("path");
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");
const implicitFigures = require("markdown-it-implicit-figures");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

const markdownItOptions = {
  html: true,
};
const markdownLib = markdownIt(markdownItOptions).use(implicitFigures);

/**
 * Generate responsive images
 * @param {string} slug
 * @param {string} alt
 * @param {string} className
 * @param {string[]} sizes
 * @returns {string} Generated HTML code
 */
async function imageShortcode(slug, alt, className = "", sizes = []) {
  const metadata = await Image(`./src/images/${slug}`, {
    outputDir: "./dist/images",
    useCache: false,
    urlPath: "/images/",
    widths: [500, 900],
    formats: ["webp", "jpeg"],
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);

      return `${name}-${width}w.${format}`;
    },
  });

  const imageAttributes = {
    alt,
    sizes,
    class: className,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = (config) => {
  config.addFilter("cssmin", (code) => {
    return new CleanCSS({}).minify(code).styles;
  });

  /**
   * Human readable date
   */
  config.addFilter("date", (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
    }).format(date);
  });

  config.setLibrary("md", markdownLib);

  config.addPlugin(pluginRss);

  /**
   * Return articles sorted by date
   */
  config.addCollection("articles", (collection) => {
    return collection
      .getFilteredByGlob("./src/articles/*.md")
      .reverse()
      .sort((a, b) => {
        return b.data.publishedAt - a.data.publishedAt;
      });
  });

  config.addNunjucksAsyncShortcode("image", imageShortcode);

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
