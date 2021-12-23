import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    file: path.resolve(__dirname, 'dist/vue.js'),
    name: 'Vue',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled'
    })
  ]
}
