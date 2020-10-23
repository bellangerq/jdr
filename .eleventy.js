const CleanCSS = require('clean-css')

module.exports = config => {
	config.addPassthroughCopy('./src/images/')

	config.addFilter('cssmin', code => {
		return new CleanCSS({}).minify(code).styles
	})

	return {
		markdownTemplateEngine: 'njk',
		dataTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		dir: {
			input: 'src',
			output: 'dist'
		}
	}
}
