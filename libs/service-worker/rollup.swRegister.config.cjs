const { withNx } = require('@nx/rollup/with-nx');
const terser = require('@rollup/plugin-terser');
const replace = require('@rollup/plugin-replace');

module.exports = (_, context) => {
  const { dbName } = context || {};

  const configSwRegister = withNx(
    {
      main: './src/swRegister.ts',
      outputPath: '../../dist/libs/service-worker',
      tsConfig: './tsconfig.lib.json',
      compiler: 'swc',
      format: ['iife'],
    },
    {
      plugins: [
        terser(),
        replace({
          preventAssignment: true,
          'process.env.DB_NAME': JSON.stringify(dbName || 'default-db'),
        }),
      ],
    }
  );

  return configSwRegister;
};
