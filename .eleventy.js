const CleanCSS = require('clean-css')
const markdownIt = require('markdown-it')
const implicitFigures = require('markdown-it-implicit-figures')

const markdownItOptions = {
	html: true
}
const markdownLib = markdownIt(markdownItOptions).use(implicitFigures)

module.exports = config => {
	config.addPassthroughCopy('./src/images/')

	config.addFilter('cssmin', code => {
		return new CleanCSS({}).minify(code).styles
	})

	config.setLibrary('md', markdownLib)

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
