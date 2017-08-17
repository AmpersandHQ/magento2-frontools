'use strict';
module.exports = function(gulp, plugins, config) { // eslint-disable-line func-names

  return () => {
    const testDir = config.projectPath + 'dev/tests/sass';

    return gulp.src(testDir  + '/test_sass.js', {read: false})
		// `gulp-mocha` needs filepaths so you can't have any plugins before it
		.pipe(plugins.mocha({reporter: 'nyan'}))
  }
};
