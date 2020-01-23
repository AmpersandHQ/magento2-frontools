import gulp, { src } from 'gulp'
import rename from 'gulp-rename'
import path from 'path'
import gulpIf from 'gulp-if'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import svgFallback from 'gulp-svgfallback'
import imagemin from 'gulp-imagemin'
import configLoader from '../config-loader'
import { env, projectPath, themes, browserSyncInstances } from '../config'

export default name => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.src)
  const dest = path.join(srcBase, 'web/images/icons/png')

  const gulpTask = src(`${srcBase}/**/icons/**/*.svg`)
    .pipe(
      gulpIf(
        !env.ci,
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>')
        })
      )
    )
    .pipe(imagemin())
    .pipe(svgFallback())
    .pipe(gulp.dest(dest))
    // .pipe(logger({
    //   display   : 'name',
    //   beforeEach: 'Theme: ' + name + ' ',
    //   afterEach : ' Compiled!'
    // }))

  return gulpTask
}
