import { createGlobPatternsForDependencies } from '@nx/react/tailwind';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*!(*.stories|*.spec).{js,ts,jsx,tsx,mdx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
