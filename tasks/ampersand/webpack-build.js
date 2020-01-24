import mergeStream from 'merge-stream'
import themes from '../../helpers/get-themes'
import webpackBuild from '../../helpers/ampersand/webpack-build'

const webpackBuildTask = () => {
  const streams = mergeStream()

  themes().forEach(name => {
    streams.add(webpackBuild(name))
  })

  return streams
}

export default webpackBuildTask
