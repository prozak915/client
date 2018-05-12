/* eslint-disable import/no-dynamic-require */

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// prevent `react-scripts` from checking for the existence of `public/index.html`
const checkRequiredFilesPath = 'react-dev-utils/checkRequiredFiles';
require(checkRequiredFilesPath);
require.cache[require.resolve(checkRequiredFilesPath)].exports = () => true;

// run original script
require('react-app-rewired/scripts/build');
