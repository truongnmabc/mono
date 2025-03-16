const { withNx } = require('@nx/rollup/with-nx');
const terser = require('@rollup/plugin-terser');
const replace = require('@rollup/plugin-replace');

module.exports = (_, context) => {
  const { dbName } = context || {};

  const configSw = withNx(
    {
      main: './src/sw.ts',
      outputPath: '../../dist/libs/service-worker',
      tsConfig: './tsconfig.lib.json',
      compiler: 'swc',
      format: ['esm'],
    },
    {
      output: {
        chunkFileNames: 'sw.js',
        entryFileNames: 'sw.js',
      },
      plugins: [
        terser(),
        replace({
          preventAssignment: true,
          'process.env.DB_NAME': JSON.stringify(dbName || 'default-db'),
        }),
      ],
    }
  );

  return configSw;
};
