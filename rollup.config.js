import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const extensions = ['.ts']

export default {
    input: 'src/main',
    output: {
        file: 'dist/main.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            'plotly.js-basic-dist-min': 'Plotly',
        },
    },
    external: ['plotly.js-basic-dist-min'],
    plugins: [resolve({ extensions }), typescript()],
}
