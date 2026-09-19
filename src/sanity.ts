/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import type { SitemapEntry } from 'next-advanced-sitemap';
import { mapRecordsToSitemapEntries, GenericMappingOptions } from './common.js';

/** Shape of a Sanity document projected with `slug`, `_updatedAt` and optional `mainImage`. */
export interface SanityDocument {
  _id: string;
  _updatedAt: string;
  slug?: { current?: string } | string;
  mainImage?: { asset?: { url?: string } };
  [key: string]: unknown;
}

export interface SanityMappingOptions extends Partial<GenericMappingOptions<SanityDocument>> {
  baseUrl: string;
  pathPrefix?: string;
}

/**
 * Maps Sanity documents (typically fetched via a GROQ query projecting
 * `slug`, `_updatedAt`, and `mainImage.asset->url`) to `SitemapEntry[]`.
 *
 * @example
 * const docs = await sanityClient.fetch(`*[_type == "post"]{ _id, _updatedAt, slug, "mainImage": mainImage.asset->{url} }`);
 * const entries = mapSanityDocumentsToSitemap(docs, { baseUrl: 'https://example.com', pathPrefix: '/blog' });
 */
export function mapSanityDocumentsToSitemap(documents: SanityDocument[], options: SanityMappingOptions): SitemapEntry[] {
  return mapRecordsToSitemapEntries(documents, {
    baseUrl: options.baseUrl,
    pathPrefix: options.pathPrefix,
    changefreq: options.changefreq,
    priority: options.priority,
    slugField: (doc) => (typeof doc.slug === 'string' ? doc.slug : doc.slug?.current ?? doc._id),
    updatedAtField: (doc) => doc._updatedAt,
    imageField: options.imageField ?? ((doc) => doc.mainImage?.asset?.url),
  });
}
