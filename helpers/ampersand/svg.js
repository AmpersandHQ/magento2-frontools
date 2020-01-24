import path from 'path'
import globby from 'globby'
import gulpicon from '@ampersandhq/gulpicon'
import configLoader from '../config-loader'
import { projectPath, themes } from '../config'

export default (name, cb) => {
  const theme = themes[name]
  const config = configLoader('gulpicon.json')
  const srcBase = path.join(projectPath, theme.src)
  const iconPath = path.join(srcBase, config.themeSrc)

  config.dest = path.join(srcBase, config.themeDest)
  config.template = path.join(srcBase, config.themeTemplate)
  config.previewTemplate = path.join(srcBase, config.themePreviewTemplate)
  config.verbose = true
  // set temp path for icon generation in the icons folder;
  // grunticon creates it's own folder when it's working.
  // Forced this way as Grunticon doesn't seem to be able to create
  // a temp directory at OS-level as it does by default -
  // possible permissions issue?
  config.tmpPath = iconPath

  const icons = globby.sync(`${iconPath}*.svg`)

  return gulpicon(icons, config)(cb)
}
