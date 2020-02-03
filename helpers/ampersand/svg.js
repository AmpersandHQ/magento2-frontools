import path from 'path';
import globby from 'globby';
import colors from 'ansi-colors';
import gulpicon from '@ampersandhq/gulpicon';
import configLoader from '../config-loader';
import { projectPath, themes as themesConfig } from '../config';
import themes from '../get-themes';

export default (name, cb) => {
    let icons = [];
    // eslint-disable-next-line no-console
    console.log(`${colors.green('Running Gulpicon on')} ${colors.blue(name)} ${colors.green('theme...')}`);
    const theme = themesConfig[name];
    const config = configLoader('gulpicon.json');
    const srcBase = path.join(projectPath, theme.src);
    const iconPath = path.join(srcBase, config.themeSrc);

    config.dest = path.join(srcBase, config.themeDest);
    config.template = path.join(srcBase, config.themeTemplate);
    config.previewTemplate = path.join(srcBase, config.themePreviewTemplate);
    config.verbose = true;
    // set temp path for icon generation in the icons folder;
    // grunticon creates it's own folder when it's working.
    // Forced this way as Grunticon doesn't seem to be able to create
    // a temp directory at OS-level as it does by default -
    // possible permissions issue?
    config.tmpPath = iconPath;

    // if we aren't in the base theme, glob all icons from both
    // base theme and our current theme together to ensure that
    // they get picked up by gulpicon and added to the stylesheet
    // for the theme.
    // Base theme is excluded so that we don't accidentally add
    // custom icons from a theme into base theme
    if (name !== 'base') {
        icons = themes().reduce((iconList, name) => {
            const { src } = themesConfig[name];
            const iconsPath = path.join(projectPath, src, config.themeSrc);

            return iconList.concat(globby.sync(`${iconsPath}*.svg`));
        }, []);
    } else {
        icons = globby.sync(`${iconPath}*.svg`);
    }

    return gulpicon(icons, config)(cb);
};
