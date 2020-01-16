import { src } from 'gulp'
import gulp from 'gulp'
import path from 'path'
import gulpIf from 'gulp-if'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import svgSprite from 'gulp-svg-sprite'
import configLoader from './config-loader'
import { env, tempPath, projectPath, themes, browserSyncInstances } from './config'

const gulpicon = {
  'datasvgcss': '_components.icons-data-svg.scss',
  'datapngcss': '_components.icons-data-png.scss',
  'urlpngcss': '_components.icons-url-png.scss',
  'pngfolder': '../../images/icons/png',
  'cssprefix': '.c-icon--',
  'defaultWidth': '28px',
  'defaultHeight': '28px',
  'compressPNG': true,
  'enhanceSVG': true,
  'themeSrc': 'images/icons/svg',
  'themeDest': 'web',
  'themeTemplate': '/images/icons/templates/default-css.hbs',
}

export default name => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.src)
  const svgDest = path.join(srcBase, gulpicon.themeSrc)
  const dest = path.join(srcBase, gulpicon.themeDest)
  // const svgConfig = configLoader('svg-sprite.json')
  const templatePath = path.join(srcBase, gulpicon.themeTemplate)

  const config = {
    shape: {
      dest: gulpicon.themeSrc,
      id: {
        generator: file => path.basename(file, '.svg')
      }
    },
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false
    },
    mode: {
      css: {
        dest: 'scss/components',
        prefix: '.c-icon--%s',
        common: 'c-icon',
        dimensions: true,
        bust: false,
        example: false,
        render: {
          scss: {
            dest: '_components.icons.scss'
          }
        }
      }
    }
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
