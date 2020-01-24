import path from 'path'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import gulpIf from 'gulp-if'
import rename from 'gulp-rename'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import { env, tempPath, themes, browserSyncInstances } from '../config'

const webpackDist = (name, file) => {
  const theme   = themes[name]
  const srcBase = tempPath

  const adjustDestinationDirectory = file => {
    file.dirname = file.dirname.replace('view/frontend/web/', '')
    return file
  }

  const dest = theme.locale.map(locale => path.join(theme.src, theme.dest, locale))

  const gulpTask = gulp.src(
    [
      file || srcBase + '/**/*.min.js',
      '!' + srcBase + '/**/node_modules/**/*.js'
    ],
    { base: srcBase }
  )
    .pipe(
      gulpIf(
        !env.ci,
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>')
        })
      )
    ).pipe(rename(adjustDestinationDirectory))
    .pipe(multiDest(dest))
    .pipe(logger({
      display: 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach: ' Compiled!'
    }))

  if (browserSyncInstances) {
    Object.keys(browserSyncInstances).forEach(instanceKey => {
      const instance = browserSyncInstances[instanceKey]

      gulpTask.pipe(instance.stream())
    })
  }

  return gulpTask
}

export default webpackDist
