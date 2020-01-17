import { src } from 'gulp'
import gulp from 'gulp'
import path from 'path'
import gulpIf from 'gulp-if'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import svgSprite from 'gulp-svg-sprite'
import { env, projectPath, themes, browserSyncInstances, svgConfig } from './config'

export default name => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.src)
  const dest = path.join(srcBase, 'web')

  const config = {
    ...svgConfig,
    shape: {
      id: {
        generator: file => path.basename(file, '.svg')
      }
    },
  }

  const gulpTask = src(`${srcBase}/**/icons/**/*.svg`)
    .pipe(
      gulpIf(
        !env.ci,
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>')
        })
      )
    )
    .pipe(svgSprite(config))
    .pipe(gulp.dest(dest))
    .pipe(multiDest(dest))
    .pipe(logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))

  if (browserSyncInstances) {
    Object.keys(browserSyncInstances).forEach(instanceKey => {
      const instance = browserSyncInstances[instanceKey]

      gulpTask.pipe(instance.stream())
    })
  }

  return gulpTask
}
