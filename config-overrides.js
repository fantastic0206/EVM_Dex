const path = require('path');

module.exports = function override(config, env) {
  // Add your own webpack config here
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@context': path.resolve(__dirname, 'src/context'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@public': path.resolve(__dirname, 'public'),
    // Add other aliases here
  };
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
};