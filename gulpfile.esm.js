import { series } from 'gulp'

import pipelineHelper from './helpers/pipeline'

import { babel as babelTask } from './tasks/babel'
import { browserSync as browserSyncTask } from './tasks/browser-sync'
import { clean as cleanTask } from './tasks/clean'
import { csslint as cssLintTask } from './tasks/css-lint'
import { emailFix as emailFixTask } from './tasks/email-fix'
import { inheritance as inheritanceTask } from './tasks/inheritance'
import { sasslint as sassLintTask } from './tasks/sass-lint'
import { setup as setupTask } from './tasks/setup'
import { styles as stylesTask } from './tasks/styles'
import { svg as svgTask } from './tasks/svg'
import { watch as watchTask } from './tasks/watch'

/**
 * Amp-specific task imports
 */
import { icons as iconsTask } from './tasks/ampersand/icons'
import webpackBuildTask from './tasks/ampersand/webpack-build'
import webpackDistTask from './tasks/ampersand/webpack-dist'

export const babel = series(inheritanceTask, babelTask)
export const clean = cleanTask
export const csslint = cssLintTask
export const dev = series(pipelineHelper, inheritanceTask, babelTask, stylesTask, browserSyncTask, watchTask)
export const emailfix = emailFixTask
export const inheritance = inheritanceTask
export const sasslint = sassLintTask
export const setup = setupTask
export const styles = series(inheritanceTask, stylesTask)
export const svg = series(inheritanceTask, svgTask)
export const watch = watchTask

/**
 * Amp-specific tasks
 */
export const icons = series(inheritanceTask, iconsTask)
export const webpackBuild = webpackBuildTask
export const webpackDist = webpackDistTask
export const webpack = series(inheritanceTask, webpackBuild, webpackDist)
export const build = series(styles, babel, webpackBuildTask, webpackDistTask)

export { default as default } from './tasks/default'
