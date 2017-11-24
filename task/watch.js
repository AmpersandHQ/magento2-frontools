'use strict';
module.exports = function(resolve) { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

  config.watcher = require('../helper/config-loader')('watcher.json', plugins, config);

  plugins.path                 = require('path');
  plugins.helper               = {};
  plugins.helper.babel         = require('../helper/babel');
  plugins.helper.cssLint       = require('../helper/css-lint');
  plugins.helper.dependecyTree = require('../helper/dependency-tree-builder');
  plugins.helper.inheritance   = require('../helper/inheritance-resolver');
  plugins.helper.sass          = require('../helper/scss');
  plugins.helper.sassLint      = require('../helper/sass-lint');
  plugins.helper.svg           = require('../helper/svg');

  plugins.util.log(
    plugins.util.colors.yellow('Initializing watcher...')
  );

  themes.forEach(name => {
    const theme = config.themes[name],
          themeTempSrc = config.tempPath + theme.dest.replace('pub/static', ''),
          themeDest = config.projectPath + theme.dest,
          themeSrc = [config.projectPath + theme.src];

    // Add modules source directeoried to theme source paths array
    if (theme.modules) {
      Object.keys(theme.modules).forEach(module => {
        themeSrc.push(config.projectPath + theme.modules[module]);
      });
    }

      const files = plugins.globby.sync([
              srcBase + '/**/*.scss',
              '!/**/_*.scss'
            ]),
            dependencyTreeBuilder = require('../helper/dependency-tree-builder');

      files.forEach(file => {
        const compiler = require('../helper/scss')(gulp, plugins, config, name, file);

        let dependencies = new Set(dependencyTreeBuilder(theme, file, plugins));

        gulp.watch(
          Array.from(dependencies),
          event => {
            plugins.util.log(
              plugins.util.colors.green('File') + ' '
              + plugins.util.colors.blue(event.path.replace(config.tempPath, '')) + ' '
              + plugins.util.colors.green('changed.')
            );
            require('../helper/scss')(gulp, plugins, config, name, file);
          }
        );
      });
    }

    generateSassDependencyTree();

    function reinitialize(path) {
      // Reset previously set timeout
      clearTimeout(reinitTimeout);

      // Timeout to run only once while moving or renaming files
      reinitTimeout = setTimeout(() => {
        plugins.util.log(
          plugins.util.colors.yellow('Change detected.') + ' ' +
          plugins.util.colors.green('Theme:') + ' ' +
          plugins.util.colors.blue(name) + ' ' +
          plugins.util.colors.green('File:') + ' ' +
          plugins.util.colors.blue(plugins.path.relative(config.projectPath, path))
        );

        plugins.util.log(
          plugins.util.colors.yellow('Resolving inheritance.') + ' ' +
          plugins.util.colors.green('Theme:') + ' ' +
          plugins.util.colors.blue(name)
        );

        const files = plugins.globby.sync([
                srcBase + '/' + locale + '/**/*.scss',
                '!/**/_*.scss',
                srcBase + '/' + locale + '/**/*.extend.scss', // Included here as we can't run sassGlob
                srcBase + '/' + locale + '/**/*.theme.scss', // Included here as we can't run sassGlob
                '!**/node_modules/**'
              ]),
              dependencyTreeBuilder = require('../helper/dependency-tree-builder');

        let dependencies = new Set(dependencyTreeBuilder(theme, file, plugins));

        files.forEach(file => {
          gulp.watch(
            Array.from(dependencies),
            event => {
              plugins.util.log(
                plugins.util.colors.green('File') + ' '
                + plugins.util.colors.blue(event.path.replace(config.tempPath, '')) + ' '
                + plugins.util.colors.green('changed.')
              );
              require('../helper/scss')(gulp, plugins, config, name, file)
            }
          );
        });
      }, 100);
    }

    // Watch add / move / rename / delete events on source files
    srcWatcher
      .on('add', reinitialize)
      .on('addDir', reinitialize)
      .on('unlink', reinitialize)
      .on('unlinkDir', reinitialize);

    // print msg when temp dir watcher is initialized
    tempWatcher.on('ready', () => {
      plugins.util.log(
        plugins.util.colors.yellow('Watcher initialized!') + ' ' +
        plugins.util.colors.green('Theme:') + ' ' +
        plugins.util.colors.blue(name) + ' ' +
        plugins.util.colors.green('and dependencies...')
      );
    });

    // Events handling
    tempWatcher.on('change', path => {
      // Print message to know what's going on
      plugins.util.log(
        plugins.util.colors.yellow('Change detected.') + ' ' +
        plugins.util.colors.green('Theme:') + ' ' +
        plugins.util.colors.blue(name) + ' ' +
        plugins.util.colors.green('File:') + ' ' +
        plugins.util.colors.blue(plugins.path.relative(config.projectPath, path))
      );

      // SASS Lint
      if (!plugins.util.env.disableLinting) {
        if (plugins.path.extname(path) === '.scss') {
          plugins.helper.sassLint(gulp, plugins, config, name, path);
        }
      }

      // SASS Compilation
      if (plugins.path.extname(path) === '.scss') {
        Object.keys(sassDependecyTree).forEach(file => {
          if (sassDependecyTree[file].includes(path)) {
            plugins.helper.sass(gulp, plugins, config, name, file);
          }
        });
      }

      // Babel
      if (plugins.path.basename(path).includes('.babel.js')) {
        plugins.helper.babel(gulp, plugins, config, name, path);
      }

      // SVG Sprite
      if (plugins.path.extname(path) === '.svg') {
        plugins.helper.svg(gulp, plugins, config, name);
      }

      // Files that require reload after save
      if (['.html', '.phtml', '.xml', '.csv', '.js'].some(ext => {
        return plugins.path.extname(path) === ext;
      })) {
        plugins.browserSync.reload();
      }
    });

    destWatcher.on('change', path => {
      // CSS Lint
      if (!plugins.util.env.disableLinting) {
        if (plugins.path.extname(path) === '.css') {
          plugins.helper.cssLint(gulp, plugins, config, name, path);
        }
      }
    });
  });

  resolve();
};
