# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Questions
If you have any questions about this project let's go to offical Magento forum - [Less to Sass Community Project](https://community.magento.com/t5/Less-to-Sass-Community-Project/bd-p/less-to-sass)

## Requirements
* Unix-like OS (please, do not ask about Windows support)
* Node.js LTS version (currently branch v6). We recommend to use [avn](https://github.com/wbyoung/avn) to automate version switching. Required configuration is already added to repository as `.node-version` file.
* Gulp CLI global package - `yarn global add gulp-cli` or `npm install -g gulp-cli`
* Magento 2 project with SASS based theme i.e. [SASS version of "Blank"](https://github.com/SnowdogApps/magento2-theme-blank-sass)

## Installation
1. Run `composer require ampersand/magento2-frontools`
2. Go to package directory `/vendor/ampersand/magento2-frontools`
3. Run `npm install` or `yarn`
4. Decide where you want to keep your config files.
You can store them in Frontools `config` directory or in `dev/tools/frontools/config`.
There is a `gulp setup` task to copy all sample config files from the `config` to `dev/tools/frontools/config` and create a convenient symlink `tools` in the project root.
If you want to keep config files inside frontools `config` dir, you have to handle this manually.
5. Define your themes in `themes.json`.

## `themes.json` structure
Check `config/themes.json.sample` to get samples.
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme_area]/[theme_vendor]/[theme_name]`
- `locale` - array of available locales
- `parent` - name of parent theme
- `stylesDir` - (default `styles`) path to styles directory. For `theme-blank-sass` it's `styles`. By default Magento 2 use `web/css`.
- `disableSuffix` - disable adding `.min` suffix using `--prod` flag.
- `postcss` - (deafult `["plugins.autoprefixer()"]`) PostCSS plugins config. Have to be an array.
- `modules` - list of modules witch you want to map inside your theme
- `ignore` - array of ignore patterns

## Webpack building
The `webpack` task will compile both local and vendor based webpack bundles (the specific module needs to be specified in `/dev/tools/frontools/config/themes.json` for the module to be compiled).

```json
    ...
    "modules": {
        "Ampersand_Local": "app/code/Ampersand/Local",
        "Ampersand_Vendor": "vendor/ampersand/magento2-vendor"
    }
```

See [this PR](https://github.com/AmpersandHQ/m2-ee/pull/3/files#diff-585600f4e9c5485604262df0af1adf9a) for a full example.

The bundle also needs to have a entry file in the format `*.babel.js` for the compilation to work.
=======
## `watcher.json` structure
Check `config/watcher.json.sample` to get samples.
- `usePolling` - set this to `true` to successfully watch files over a network (i.e. Docker or Vagrant) or when your watcher dosen't work well. Warining, enabling this option may lead to high CPU utilization! [chokidar docs](https://github.com/paulmillr/chokidar#performance)

## Optional configurations for 3rd party plugins
You will find sample config files for theses plugins in `vendor/snowdog/frontools/config` directory.
* Create [browserSync](https://www.browsersync.io/) configuration
* Create [eslint](https://github.com/adametry/gulp-eslint) configuration
* Create [sass-lint](https://github.com/sasstools/sass-lint) configuration
* Create [stylelint](https://github.com/stylelint/stylelint) configuration
* Create [BackstopJs](https://github.com/garris/BackstopJS/) configuration
* Create [svg-sprite](https://github.com/jkphl/gulp-svg-sprite) configuration


## Tasks list
* `backstop` - Run visual regression tests against a styleguide
  * `--reference` - Create reference screenshots
  * `--test` - Take new screenshots and compare against reference ones, launch the results report in the browser
  * `--approve` - If there are new changes that are OK, update the reference screenshots with the test ones
  * `--filter=foo` - Add this flag after `--reference` or `--test` with a regex matching scenarios you want to test (e.g. foo)
* `babel` - Run [Babel](https://babeljs.io/), a compiler for writing next generation JavaScript.
  * `--theme name` - Process single theme.
  * `--prod` - Production output - minifies and uglyfy code.
* `build` - Run inheritance, styles task and webpack building.
  * `--prod` - Production output - minifies styles and add `.min` sufix.
* `browser-sync` - Run [browserSync](https://www.browsersync.io/).
* `clean` - Removes `/pub/static` directory content.
* `csslint` - Run [stylelint](https://github.com/stylelint/stylelint) based tests.
  * `--theme name` - Process single theme.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `default` - type `gulp` to see this readme in console.
* `dev` - Runs [browserSync](https://www.browsersync.io/) and `inheritance`, `babel`, `styles`, `watch` tasks.
  * `--theme name` - Process single theme.
  * `--disableLinting` - Disable SASS and CSS linting.
  * `--disableMaps` - Toggles source maps generation.
* `eslint` - Watch and run [eslint](https://github.com/adametry/gulp-eslint) on specified JS file.
  * `--file fileName` - You have to specify what file you want to lint, fileName without .js.
* `inheritance` - Create necessary symlinks to resolve theme styles inheritance and make the base for styles processing. You have to run in before styles compilation and after adding new files.
* `sasslint` - Run [sass-lint](https://github.com/sasstools/sass-lint) based tests.
  * `--theme name` - Process single theme.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `setup` - Creates a convenient symlink from `/tools` to `/vendor/snowdog/frontools` and copies all sample files if no configuration exists.
  * `--symlink name` - If you don't want to use `tools` as the symlink you can specify another name.
* `styles` - Use this task to manually trigger styles processing pipeline.
  * `--theme name` - Process single theme.
  * `--disableMaps` - Toggles source maps generation.
  * `--prod` - Production output - minifies styles and add `.min` sufix.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `svg` - Run [svg-sprite](https://github.com/jkphl/gulp-svg-sprite) to generate SVG sprite.
  * `--theme name` - Process single theme.
* `watch` - Watch for style changes and run processing tasks.
  * `--theme name` - Process single theme.
  * `--disableLinting` - Disable SASS and CSS linting.
  * `--disableMaps` - Enable inline source maps generation.
* `webpack` - Run webpack and compiles bundles if any.
