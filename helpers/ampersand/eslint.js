import path from 'path';
import { src } from 'gulp';
import globby from 'globby';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';
import notify from 'gulp-notify';
import logger from 'gulp-logger';
import eslint from 'gulp-eslint';

import { env, themes, tempPath } from '../config';
import configLoader from '../config-loader';

export default (name, file) => {
    const theme = themes[name];
    const srcBase = path.join(tempPath, theme.src);
    const eslintConfig = configLoader('eslintrc.yml');
    const files = globby.sync(srcBase + '/**/*.js');

    return src(file ? file : files.length ? files : '.')
        .pipe(gulpIf(
            !env.ci,
            plumber({
                errorHandler: notify.onError('Error: <%= error.message %>')
            })
        ))
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        .pipe(gulpIf(env.ci, eslint.failOnError()))
        .pipe(logger({
            display   : 'name',
            beforeEach: 'Theme: ' + name + ' ' + 'File: ',
            afterEach : ' - ESLint finished.'
        }))
};
