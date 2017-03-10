'use strict';
module.exports = function(gulp, plugins, config, name) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return () => {
    const theme          = config.themes[name],
          srcBase        = config.projectPath + theme.src,
          imageMinConfig = require('../helper/config-loader')('imagemin.json', plugins, config),

          // Look for any images in the web/images directory and minify them in place
          imageDir       = srcBase + '/web/images/**/*',
          minnedImageDir = srcBase + '/web/images/';


    return gulp.src(imageDir)
        .pipe(plugins.imagemin(imageMinConfig))
        .pipe(gulp.dest(minnedImageDir));
  }
};
