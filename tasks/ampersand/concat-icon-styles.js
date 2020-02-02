import mergeStream from 'merge-stream';
import themes from '../../helpers/get-themes';
import concatIconStyles from '../../helpers/ampersand/concat-icon-styles';

export default () => {
    const streams = mergeStream();
    themes().forEach(name => {
        if (name === 'base') {
            return false;
        }

        streams.add(concatIconStyles(name));
    });

    return streams;
}
