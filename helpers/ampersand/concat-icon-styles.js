import path from 'path';
import { src, dest } from 'gulp';
import concat from 'gulp-concat';
import configLoader from '../config-loader';
import { projectPath, themes as themesConfig } from '../config';
import themes from '../get-themes';

export default name => {
    const iconConfig = configLoader('gulpicon.json');

    const iconFiles = themes().map(name => {
        const theme = themesConfig[name];
        const srcBase = path.join(projectPath, theme.src);
        return path.join(srcBase, iconConfig.themeDest, iconConfig.datasvgcss);
    });

    const gulpTask = src(iconFiles)
        .pipe(concat(iconConfig.datasvgcss))
        .pipe(dest(path.join(projectPath, themesConfig[name].src, iconConfig.themeDest)));

    return gulpTask;
};
