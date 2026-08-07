import tsconfigPaths from 'rollup-plugin-tsconfig-paths';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
// `assert { type: 'json' }` a été retiré de Node 22 au profit de `with` : la
// syntaxe d'origine faisait échouer le build sur « Unexpected identifier
// 'assert' » avant même d'atteindre Rollup.
import pkg from './package.json' with { type: 'json' };
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
  ],
  onwarn(warning, warn) {
    // Ignore "use client" warnings
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
      return;
    }
    warn(warning);
  },
  plugins: [
    json(),
    tsconfigPaths(),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    }),
    commonjs(),
    postcss({
      extract: true,
      minimize: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      modules: false,
      use: [
        ['sass', { includePaths: ['./src', './node_modules'] }],
      ],
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    terser({
      format: {
        comments: false,
      },
    }),
  ],
};
