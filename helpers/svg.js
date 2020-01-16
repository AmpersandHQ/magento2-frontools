import { src } from 'gulp'
import  gulp from 'gulp'
import path from 'path'
import gulpIf from 'gulp-if'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import svgSprite from 'gulp-svg-sprite'
import configLoader from './config-loader'
import { env, tempPath, projectPath, themes, browserSyncInstances, gulpicon } from './config'

export default name => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.src)

  const dest = path.join(srcBase, gulpicon.themeDest)
  const svgConfig = configLoader('svg-sprite.json')
  const templatePath = path.join(srcBase, gulpicon.themeTemplate)

  console.log('templatePath', templatePath)

  const config = {
    dest: '.',
    shape: {
      spacing: {
        padding: 5
      },
      id: {
        generator: file => path.basename(file, '.svg')
      },
      dest: 'images/icons/svg'
    },
    mode: {
      css: {
        dest: 'scss/components/test_svg_sprite.scss',
        prefix: '.c-icon--',
        sprite: 'sprite.svg',
        layout: 'diagonal',
        bust      : true,
        render: {
            scss: {
              dest: '_sprite.scss',
              template: '/Users/hannahfan/src/seraphine2020/app/design/frontend/Seraphine/default/web/images/icons/templates/default-css.hbs'
            }
        }
      }
    }
  };

  const gulpTask = src(srcBase + '/**/icons/**/*.svg')
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
