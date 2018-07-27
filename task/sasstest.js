'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs;

    plugins.util.log(
      plugins.util.colors.green('Running Sass tests')
    );
    require('../helper/sasstest')(gulp, plugins, config)();
};
