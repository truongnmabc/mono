const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const { swc } = require('rollup-plugin-swc3');
const terser = require('@rollup/plugin-terser');
const packageJson = require('./package.json');
const { withNx } = require('@nx/rollup/with-nx');

const rollupConfig = {
  plugins: [peerDepsExternal(), resolve(), commonjs(), swc(), terser()],
  external: Object.keys(packageJson.peerDependencies || {}),
};

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: '../../dist/libs/shared-utils',
    tsConfig: './tsconfig.lib.json',
    compiler: 'swc',
    format: ['esm'],
    assets: [{ input: '.', output: '.', glob: '*.md' }],
  },
  rollupConfig
);
