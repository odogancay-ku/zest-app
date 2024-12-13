// Import the default Expo Metro config
const { getDefaultConfig } = require("@expo/metro-config");

// Get the default Expo Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("readable-stream"),
    path: require.resolve("path-browserify"),
    buffer: require.resolve('buffer'),
    events: require.resolve('events'),
    process: require.resolve('process/browser'),
    assert: require.resolve('assert'),
    inherits: require.resolve('inherits'),
};

module.exports = config;