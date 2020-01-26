import logger from 'gulp-logger'
import colors from 'ansi-colors'
import backstop from '../../helpers/ampersand/backstop'

export default cb => {
  logger(
    colors.green('Running BackstopJs')
  )

  backstop(cb)
}
