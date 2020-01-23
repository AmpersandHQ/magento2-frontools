import gulp, { src } from 'gulp'
import rename from 'gulp-rename'
import path from 'path'
import gulpIf from 'gulp-if'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import svgFallback from 'gulp-svgfallback'
import configLoader from '../config-loader'
import { env, projectPath, themes, browserSyncInstances } from '../config'

export default name => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.src)
  const dest = path.join(srcBase, 'web/scss/components')
  let scssFilename = '_components.icons-png'

  if (name !== 'base') {
    scssFilename = `${scssFilename}.extend`
  }

  const gulpTask = src(`${srcBase}/web/images/icons/png/default.css`)
    .pipe(
      rename({
        basename: scssFilename,
        extname: '.scss'
      })
    )
    .pipe(gulp.dest(dest))

  if (browserSyncInstances) {
    Object.keys(browserSyncInstances).forEach(instanceKey => {
      const instance = browserSyncInstances[instanceKey]

      gulpTask.pipe(instance.stream())
    })
  }

  return gulpTask
}
