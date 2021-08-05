module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy('eleventy/images');
    eleventyConfig.addWatchTarget('eleventy/css');

    return {
        dir: {
            input: './eleventy',
            output: './eleventy/_site',
            layouts: '_layouts',
            data: '_data'
        },
        htmlTemplateEngine: 'liquid'
    };
};
