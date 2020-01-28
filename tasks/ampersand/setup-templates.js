import path from 'path';
import fs from 'fs-extra';
import log from 'fancy-log';
import colors from 'ansi-colors';

import { projectPath, themes } from '../../helpers/config';

// Copy default template files over for such things as icon style generation
export const setupTemplates = callback => {
    const templateSamplePath = './templates';

    Object.keys(themes).forEach(name => {
        let templatesPath = path.join(projectPath, themes[name].src, 'web/images/icons/templates/');

        // Copy over any new template files
        fs.readdirSync(templateSamplePath).forEach(fileName => {
            const newFileName = fileName.replace('.sample', '');

            try {
                fs.copySync(
                    path.join(templateSamplePath, fileName),
                    path.join(templatesPath, newFileName), {
                        overwrite: false,
                        errorOnExist: true
                    }
                );

                log(`File ${fileName} copied to web/images/icons/templates/${newFileName}`);
            }
            catch (error) {
                log(
                    colors.yellow(`File ${newFileName} already exists. Skipped it.`)
                );
            }
        });
    });

    callback();
};
