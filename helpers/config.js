import path from 'path'
import fs from 'fs-extra'
import parseArgs from 'minimist'

import configLoader from './config-loader'

export const env = parseArgs(process.argv.slice(2))
export const projectPath = path.join(fs.realpathSync('../../../'), '/')
export const tempPath = path.join(projectPath, 'var/view_preprocessed/frontools/')
export const themes = configLoader('themes.json', false)
export const browserSyncInstances = {}

// export const gulpicon = {
//   'datasvgcss': '_components.icons-data-svg.scss',
//   'datapngcss': '_components.icons-data-png.scss',
//   'urlpngcss': '_components.icons-url-png.scss',
//   'pngfolder': '../../images/icons/png',
//   'cssprefix': '.c-icon--',
//   'defaultWidth': '28px',
//   'defaultHeight': '28px',
//   'compressPNG': true,
//   'enhanceSVG': true,
//   'themeSrc': 'images/icons/svg',
//   'themeDest': 'web',
//   'themeTemplate': '/images/icons/templates/default-css.hbs',
// }
