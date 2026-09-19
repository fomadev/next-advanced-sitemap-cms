import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    strapi: 'src/strapi.ts',
    contentful: 'src/contentful.ts',
    sanity: 'src/sanity.ts',
    shopify: 'src/shopify.ts',
  },
  format: ['cjs', 'esm'],
  dts: { resolve: true, compilerOptions: { ignoreDeprecations: '6.0' } },
  splitting: false,
  sourcemap: true,
  clean: true,
});
