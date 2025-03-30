// rollup.config.js
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' assert { type: 'json' };

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
  plugins: [
    postcss({
      extract: true,
      minimize: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      modules: false,
      use: [
        ['sass', { includePaths: ['./src', './node_modules'] }]
      ],
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
