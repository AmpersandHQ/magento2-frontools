import mergeStream from 'merge-stream';
import themes from '../../helpers/get-themes';
import webpackDist from '../../helpers/ampersand/webpack-dist';

const webpackDistTask = function() { // eslint-disable-line func-names
    const streams = mergeStream();

    // Loop through themes to compile scss or less depending on your config.json
    themes().forEach(name => {
        streams.add(webpackDist(name));
    });

    return streams;
};

export default webpackDistTask;
