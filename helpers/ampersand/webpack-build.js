// import path from 'path'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import gulpIf from 'gulp-if'
import rename from 'gulp-rename'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import webpackStream from 'webpack-stream'
import webpack from 'webpack'
import vinylPaths from 'vinyl-paths'
import { env, tempPath, themes, browserSyncInstances } from '../config'

'use strict'
const webpackBuild = (name, file) => {
  const theme = themes[name]
  const srcBase = tempPath

  function adjustDestinationDirectory(file) {
    file.dirname = file.dirname.replace('web/', '')
    return file
  }

  function getModuleDir(file) {
    return file.replace(/view\/frontend\/web\/js\/(.*)\.entry\.js/, '')
  }

  const dest = []
  theme.locale.forEach(locale => {
    dest.push(theme.projectPath + theme.dest + '/' + locale)
  })

  const gulpTask = gulp.src(
    [
      file || srcBase + '/**/*.entry.js',
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
    )
    .pipe(vinylPaths(path => {
      let moduleDir = getModuleDir(path)
      let webpackfile = moduleDir + 'webpack.config.js'

      return new Promise((resolve, reject) => {
        webpackStream(require(webpackfile), webpack)
          .pipe(gulp.dest(moduleDir + 'view/frontend/web/js/dist/'))
          .on('end', resolve)
          .on('error', reject)
      })
    }))
    .pipe(rename(adjustDestinationDirectory))
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

export default webpackBuild
