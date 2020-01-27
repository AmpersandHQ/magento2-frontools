import path from 'path';
import gulp, { src } from 'gulp';
import imagemin from 'gulp-imagemin';
import logger from 'gulp-logger';
import { colors } from 'gulp-util';
import configLoader from '../config-loader';
import { env, themes, projectPath } from '../config';

export default name => {
    const imageMinConfig = configLoader('imagemin.json');

    if (env.dir) {
    // Requires an argument, if only `--dir` provided then this is just true
        if (env.dir !== true) {
            const minnedImageDir = path.join(projectPath, env.dir);
            const imageDir = path.join(minnedImageDir, '**/*');
            logger('Minifying everything in: ' + minnedImageDir);

            return src(imageDir)
                .pipe(imagemin(imageMinConfig))
                .pipe(gulp.dest(minnedImageDir));
        }
        else {
            logger(colors.red('Must provide a directory as an argument'));
        }
    }
    else {
    // No flag => go through theme image directory
        const theme = themes[name];
        const srcBase = path.join(projectPath, theme.src);
        // Look for any images in the web/images directory and minify them in place
        const imageDir = path.join(srcBase, '/web/images/**/*');
        const minnedImageDir = path.join(srcBase, '/web/images/');

        return src(imageDir)
            .pipe(imagemin(imageMinConfig))
            .pipe(gulp.dest(minnedImageDir))
            .pipe(logger({
                display   : 'name',
                beforeEach: 'Theme: ' + name + ', ' + 'File: ',
                afterEach : ' - Imagemin finished.'
            }));
    }
};
