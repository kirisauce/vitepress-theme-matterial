import { build } from 'esbuild'

await build({
  entryPoints: ['src/node/default-config.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: './lib/config.js',
  external: [
    'vitepress',
    'markdown-it',
    '@vue-macros/reactivity-transform',
    'unplugin-icons/vite',
  ],
})