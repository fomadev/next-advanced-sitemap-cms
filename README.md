# @fomadev/next-advanced-sitemap-cms

[![License: FPL](https://img.shields.io/badge/License-FPL-orange.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](README.md)

Official, free, open-core headless CMS adapters for [`next-advanced-sitemap`](../next-advanced-sitemap). Each adapter is a thin, pure mapping function that turns records you already fetched from your CMS into `SitemapEntry[]` — no mapping loop, no boilerplate, no vendor SDK lock-in.

Part of the `next-advanced-sitemap` ecosystem. This package intentionally does **not** perform any network calls itself: you fetch data with your existing CMS client (any version, any auth strategy), and hand the result to the matching adapter.

## Supported CMS

| Adapter | Import path | Function |
|---|---|---|
| Strapi (REST API v4) | `@fomadev/next-advanced-sitemap-cms/strapi` | `mapStrapiEntriesToSitemap(data, options)` |
| Contentful (Delivery API) | `@fomadev/next-advanced-sitemap-cms/contentful` | `mapContentfulEntriesToSitemap(items, options)` |
| Sanity (GROQ projections) | `@fomadev/next-advanced-sitemap-cms/sanity` | `mapSanityDocumentsToSitemap(docs, options)` |
| Shopify (Storefront API) | `@fomadev/next-advanced-sitemap-cms/shopify` | `mapShopifyProductsToSitemap(products, options)` |

## Installation

```bash
npm install next-advanced-sitemap @fomadev/next-advanced-sitemap-cms
```

## Usage

```typescript
// app/sitemap-blog.xml/route.ts
import { getServerSitemapResponse } from 'next-advanced-sitemap';
import { mapStrapiEntriesToSitemap } from '@fomadev/next-advanced-sitemap-cms/strapi';

export async function GET() {
  const res = await fetch(`${process.env.STRAPI_URL}/api/articles?populate=cover`, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
  });
  const { data } = await res.json();

  const entries = mapStrapiEntriesToSitemap(data, {
    baseUrl: 'https://example.com',
    pathPrefix: '/blog',
    changefreq: 'weekly',
  });

  return getServerSitemapResponse(entries, { autoLastmod: true });
}
```

Every adapter accepts `slugField` / `updatedAtField` / `imageField` overrides (a dot-notation path string, or an accessor function) so you are never locked into the default content-model assumptions.

## License

FomaDev Public License (FPL). Free for personal and commercial use as a dependency. Contributions (new adapters — Payload CMS, Directus, Prismic, ...) are welcome via pull request. See [LICENSE](LICENSE) for full terms.

Copyright (c) 2026 Fordi / FomaDev.
