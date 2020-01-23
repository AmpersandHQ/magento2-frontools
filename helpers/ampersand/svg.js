import gulp, { src } from 'gulp'
import path from 'path'
import gulpIf from 'gulp-if'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import imagemin from 'gulp-imagemin'
import globby from 'globby'
import gulpicon from '@ampersandhq/gulpicon'
import configLoader from '../config-loader'
import { env, projectPath, themes, browserSyncInstances } from '../config'

export default name => {
  const theme = themes[name]
  const config = configLoader('gulpicon.json')
  const srcBase = path.join(projectPath, theme.src)
  const iconPath = path.join(srcBase, config.themeSrc)

  // let fileName = svgConfig.file.name

  // if (name !== 'base') {
  //   fileName = `${svgConfig.file.name}.extend`
  // }

  // const config = {
  //   filename: `${svgConfig.file.path}/${fileName}.${svgConfig.file.type}`,
  //   template: `${srcBase}/${svgConfig.template}`
  // }

  config.dest = path.join(srcBase, config.themeDest)
  config.template = path.join(srcBase, config.themeTemplate)
  config.previewTemplate = path.join(srcBase, config.themePreviewTemplate)
  config.verbose = true
  config.compressPNG = false

  const icons = globby.sync(`${iconPath}*.svg`)

  const gulpTask = src(iconPath)
    .pipe(gulpicon(icons, config))
    .pipe(logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))
    // .pipe(gulpicon(icons, config))
  // const gulpTask = gulpicon(icons, config)

  // if (browserSyncInstances) {
  //   Object.keys(browserSyncInstances).forEach(instanceKey => {
  //     const instance = browserSyncInstances[instanceKey]

  //     gulpTask.pipe(instance.stream())
  //   })
  // }

  return gulpTask
}
