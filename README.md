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

## 9. License

`next-advanced-sitemap` is released under the **Fordima Public License (FPL) v1.0**. See the [LICENSE](./LICENSE) file for the full text.

- **Free Use**: Free for individuals, education, and companies, including commercial projects and revenue-generating products. Use it as a dependency or integrate it into your own systems at no cost.
- **Contributions**: Forks are welcome for contributing. Improvements, bug fixes, and new features must be submitted via a Pull Request to the official repository.
- **Restrictions**: Using this source code to build a similar or competing product, redistributing the source code as a standalone product, offering a paid hosted or "as a service" version, or maintaining an independent permanent fork requires a paid commercial license from Fordima Inc.

For commercial licensing, please contact the management of Fordima Inc.

Copyright (c) 2026 Fordima Inc. All rights reserved.
