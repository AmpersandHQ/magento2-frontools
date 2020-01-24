import gulp from 'gulp'
import streams from 'merge-stream'
import webpack from 'webpack'
import themes from '../../helpers/get-themes'
import webpackBuild from '../../helpers/ampersand/webpack-build'

'use strict';
const webpackBuildTask = cb => { // eslint-disable-line func-names
  cb()
  // Global variables
  // const gulp    = this.gulp,
  //       plugins = this.opts.plugins,
  //       config  = this.opts.configs,
  //       themes  = plugins.getThemes(),
  //       streams = plugins.mergeStream(),
  //       webpack = this.webpack;

  // Loop through themes to compile scss or less depending on your config.json
  // themes().forEach(name => {
  //   streams.add(webpackBuild(gulp, plugins, config, name))
  // })

  // return streams
};

module.exports = webpackBuildTask
