import path from 'path'
import fs from 'fs-extra'
import log from 'fancy-log'
import colors from 'ansi-colors'

import { projectPath } from '../../helpers/config'

// Copy Casper scripts over to 'dev/tests/backstop_data/casper_scripts' directory.
export const setupBackstop = callback => {
  const casperSamplesPath = './tests/backstop_data/casper_scripts/'
  const casperPath = path.join(projectPath, 'dev/tests/backstop_data/casper_scripts/')

  fs.readdirSync(casperSamplesPath).forEach(fileName => {
    try {
      fs.copySync(casperSamplesPath + fileName, casperPath + fileName, {
        clobber: false
      })

      log(`File: ${fileName} copied to /dev/tests/backstop_data/casper_scripts/${fileName}`)
    }
    catch (error) {
      log(
        colors.yellow(`File ${fileName} already exists. Skipped it.`)
      )
    }
  })

  callback()
}
