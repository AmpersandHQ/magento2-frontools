import mergeStream from 'merge-stream'
import helperSvg from '../../helpers/ampersand/svg'
import helperPng from '../../helpers/ampersand/png'
import themes from '../../helpers/get-themes'

export const icons = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    streams.add(helperSvg(name))
    streams.add(helperPng(name))
  })
  return streams
}
