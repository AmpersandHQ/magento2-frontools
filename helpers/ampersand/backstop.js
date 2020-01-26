import logger from 'gulp-logger'
import colors from 'ansi-colors'
import backstopjs from 'backstopjs'
import { env, themes } from '../config'
import configLoader from '../config-loader'

export default callback => {
  const backstopConfig = configLoader('backstop.json', themes)
  const backstopConfigFilePath = `${themes.projectPath}dev/tools/frontools/config/backstop.json`
  const backstopOptions = {
    'backstopConfigFilePath': backstopConfigFilePath
  }

  if (env.genConfig) {
    logger(colors.yellow('Don\'t run this, run gulp setup instead [TODO]'))
  }
  else if (env.reference) {
    if (env.filter) {
      backstopOptions.filter = env.filter
    }
    return backstopjs('reference', backstopOptions)
  }
  else if (env.test) {
    if (env.filter) {
      backstopOptions.filter = env.filter
    }
    return backstopjs('test', backstopOptions)
  }
  else if (env.approve) {
    return backstopjs('approve', backstopOptions)
  }
  else {
    logger(colors.red('Error, run with a flag to specify the required task: --reference, --test or --approve'))
    logger(colors.red('Or run the --filter flag alongside the --reference or --test flag'))
  }

  callback()
}
