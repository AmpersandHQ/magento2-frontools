import logger from 'gulp-logger';
import colors from 'ansi-colors';
import mergeStream from 'merge-stream';
import { env } from '../../helpers/config';
import themes from '../../helpers/get-themes';
import imagemin from '../../helpers/ampersand/imagemin';

export default () => {
    const streams = mergeStream();

    if (env.dir) {
        logger(
            colors.green('Running imagemin on custom directory...')
        );
        streams.add(imagemin());
    }
    else {
        themes().forEach(name => {
            logger(
                `${colors.green('Running imagemin on')} ${colors.blue(name)} ${colors.green('theme...')}`
            );
            streams.add(imagemin(name));
        });
    }

    return streams;
};
