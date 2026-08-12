const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const config = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = config.resolver;

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = assetExts.filter((extension) => extension !== 'svg');
config.resolver.sourceExts = [...sourceExts, 'svg'];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@assets': path.resolve(__dirname, '../../packages/app/assets'),
  '@icons': path.resolve(__dirname, '../../packages/app/assets/icons'),
  '@styles': path.resolve(__dirname, '../../packages/app/src/styles'),
  '@components': path.resolve(__dirname, '../../packages/app/src/components'),
};

module.exports = config;
