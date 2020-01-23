import mergeStream from 'merge-stream'
import helperSvg from '../../helpers/ampersand/svg'
import helperPng from '../../helpers/ampersand/png'
import helperMoveCss from '../../helpers/ampersand/moveCss'
import themes from '../../helpers/get-themes'

export const icons = () => {
  // const streams = mergeStream()
  themes().forEach(name => {
    helperSvg(name)
    // streams.add(helperPng(name))
    // streams.add(helperMoveCss(name))
  })
  // return streams
  return true
}
