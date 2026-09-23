const { getDefaultConfig } = require('expo/metro-config');

// Expo detects the pnpm/Turborepo workspace automatically (watchFolders + nodeModulesPaths).
module.exports = getDefaultConfig(__dirname);
