import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import type { Config } from 'tailwindcss';
import baseConfig from '../../tailwind.base';

const config: Config = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    './src/app/**/*!(*.stories|*.spec).{js,ts,jsx,tsx,mdx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
};

export default config;
