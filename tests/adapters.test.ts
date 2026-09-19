/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { mapStrapiEntriesToSitemap, StrapiEntry } from '../src/strapi.js';
import { mapContentfulEntriesToSitemap, ContentfulEntry } from '../src/contentful.js';
import { mapSanityDocumentsToSitemap, SanityDocument } from '../src/sanity.js';
import { mapShopifyProductsToSitemap, ShopifyProduct } from '../src/shopify.js';

describe('mapStrapiEntriesToSitemap', () => {
  it('should map Strapi v4 entries to sitemap entries', () => {
    const data: StrapiEntry[] = [
      { id: 1, attributes: { slug: 'hello-world', updatedAt: '2026-01-01T00:00:00.000Z', cover: { data: { attributes: { url: '/uploads/hero.jpg' } } } } },
    ];

    const [entry] = mapStrapiEntriesToSitemap(data, { baseUrl: 'https://example.com', pathPrefix: '/blog' });

    expect(entry.url).toBe('https://example.com/blog/hello-world');
    expect(entry.lastmod).toBe('2026-01-01T00:00:00.000Z');
    expect(entry.images?.[0].loc).toBe('/uploads/hero.jpg');
  });
});

describe('mapContentfulEntriesToSitemap', () => {
  it('should map Contentful entries and upgrade protocol-relative image URLs', () => {
    const items: ContentfulEntry[] = [
      {
        sys: { id: 'abc', updatedAt: '2026-02-01T00:00:00.000Z' },
        fields: { slug: 'my-post', coverImage: { fields: { file: { url: '//images.ctfassets.net/x.jpg' } } } },
      },
    ];

    const [entry] = mapContentfulEntriesToSitemap(items, { baseUrl: 'https://example.com', pathPrefix: 'blog' });

    expect(entry.url).toBe('https://example.com/blog/my-post');
    expect(entry.images?.[0].loc).toBe('https://images.ctfassets.net/x.jpg');
  });
});

describe('mapSanityDocumentsToSitemap', () => {
  it('should support both string and object slug shapes', () => {
    const docs: SanityDocument[] = [
      { _id: 'a', _updatedAt: '2026-03-01T00:00:00.000Z', slug: { current: 'post-a' } },
      { _id: 'b', _updatedAt: '2026-03-02T00:00:00.000Z', slug: 'post-b' },
    ];

    const entries = mapSanityDocumentsToSitemap(docs, { baseUrl: 'https://example.com' });
    expect(entries.map((e) => e.url)).toEqual(['https://example.com/post-a', 'https://example.com/post-b']);
  });
});

describe('mapShopifyProductsToSitemap', () => {
  it('should default to the canonical /products/<handle> path and daily changefreq', () => {
    const products: ShopifyProduct[] = [{ handle: 'blue-shirt', updatedAt: '2026-04-01T00:00:00.000Z' }];

    const [entry] = mapShopifyProductsToSitemap(products, { baseUrl: 'https://shop.example.com' });

    expect(entry.url).toBe('https://shop.example.com/products/blue-shirt');
    expect(entry.changefreq).toBe('daily');
  });
});
