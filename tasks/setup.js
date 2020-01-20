import fs from 'fs-extra'
import path from 'path'
import log from 'fancy-log'
import colors from 'ansi-colors'

import { env, projectPath, themes } from '../helpers/config'

export const setup = callback => {
  // Create a relative symlink in project root to /vendor/snowdog/frontools
  const relativeDirectory = path.relative(
    projectPath,
    fs.realpathSync('./')
  )
  const symlinkDirectoryName = env.symlink || 'tools'

  // Set config files paths
  const configSamplesPath = './config/'
  const configPath = path.join(projectPath, 'dev/tools/frontools/config/')

  // Set template files paths
  const templateSamplePath = './templates'

  try {
    fs.symlinkSync(
      relativeDirectory,
      path.join(projectPath, symlinkDirectoryName),
      'dir'
    )

    log(
      colors.green('Symlink created. You can now use Frontools from the "' + symlinkDirectoryName + '" directory.')
    )
  }
  catch (error) {
    log(
      colors.yellow(symlinkDirectoryName + ' already exists. Skipped it.')
    )
  }

  Object.keys(themes).forEach(name => {
    let templatesPath = path.join(projectPath, themes[name].src, 'web/images/icons/templates/')

    // Copy over any new template files
    fs.readdirSync(templateSamplePath).forEach(fileName => {
      const newFileName = fileName.replace('.sample', '')

      try {
        fs.copySync(
          path.join(templateSamplePath, fileName),
          path.join(templatesPath, newFileName), {
            overwrite: false,
            errorOnExist: true
          }
        )

        log('File ' + fileName + ' copied to web/images/icons/templates' + newFileName)
      }
      catch (error) {
        log(
          colors.yellow('File ' + newFileName + ' already exists. Skipped it.')
        )
      }
    })
  })

  // Copy all all non existent config files to /dev/tools/frontools/config/
  fs.readdirSync(configSamplesPath).forEach((fileName) => {
    const newFileName = fileName.replace('.sample', '')

    try {
      fs.copySync(
        path.join(configSamplesPath, fileName),
        path.join(configPath, newFileName), {
          overwrite: false,
          errorOnExist: true
        }
      )

      log('File ' + fileName + ' copied to /dev/tools/frontools/config/' + newFileName)
    }
    catch (error) {
      log(
        colors.yellow('File ' + newFileName + ' already exists. Skipped it.')
      )
    }
  })

  log(
    colors.green('Setup complete! Go to "/dev/tools/frontools/config/" directory and edit the configuration there.')
  )

  callback()
}
