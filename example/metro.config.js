const path = require('path');
const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    ...defaultConfig.resolver,
    blockList: modules.map(
      (m) =>
        new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
    ),
    extraNodeModules: new Proxy(
      {},
      {
        get: (_target, name) => {
          const examplePath = path.join(__dirname, 'node_modules', name);
          if (modules.includes(name) || fs.existsSync(examplePath)) {
            return examplePath;
          }
          return path.join(root, 'node_modules', name);
        },
      }
    ),
  },
};
