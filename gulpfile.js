const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const fsp = require('fs').promises
const assert = require('assert').strict

const sassCompile = () =>
  gulp
    .src('eleventy/css/**/*.scss')
    .pipe(
      sass({
        includePaths: [
          'node_modules',
          'node_modules/@dawaltconley',
          'node_modules/normalize.css',
        ],
        quietDeps: true,
      }).on('error', sass.logError)
    )
    .pipe(gulp.dest('eleventy/_site/css'))

const sassWatch = () => gulp.watch('eleventy/css/**/*.scss', sassCompile)

const sassCompare = cb => {
  let buf = []
  let expected = fsp.readFile('test/main.css')
  sassCompile()
    .on('data', data => buf.push(data.contents))
    .on('end', async () => {
      const output = Buffer.concat(buf).toString()
      expected = (await expected).toString()
      try {
        assert.deepEqual(output, expected)
        cb()
      } catch (error) {
        cb(error)
      }
    })
}

exports.build = sassCompile

exports.serve = gulp.series(sassCompile, sassWatch)

exports.test = sassCompare
