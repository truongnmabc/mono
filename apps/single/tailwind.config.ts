import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import baseConfig from '../../tailwind.base';
import type { Config } from 'tailwindcss';

const config: Config = {
  ...baseConfig,
  content: [
    './src/app/**/*!(*.stories|*.spec).{js,ts,jsx,tsx,mdx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
};

export default config;
