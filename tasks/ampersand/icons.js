import ampIcons from '../../helpers/ampersand/svg';
import themes from '../../helpers/get-themes';

export const icons = cb => {
    themes().forEach(name => {
        ampIcons(name, cb);
    });
};
