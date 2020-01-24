import mergeStream from 'merge-stream'
import themes from '../../helpers/get-themes'
import webpackBuild from '../../helpers/ampersand/webpack-build'

const webpackBuildTask = () => { // eslint-disable-line func-names
  const streams = mergeStream()
  // Loop through themes to compile scss or less depending on your config.json
  themes().forEach(name => {
    streams.add(webpackBuild(name))
  })

  return streams
}

export default webpackBuildTask
