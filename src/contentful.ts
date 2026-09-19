/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import type { SitemapEntry } from 'next-advanced-sitemap';
import { mapRecordsToSitemapEntries, GenericMappingOptions } from './common.js';

/** Shape of a single Contentful Delivery API entry. */
export interface ContentfulEntry {
  sys: { id: string; updatedAt: string };
  fields: Record<string, unknown>;
}

export interface ContentfulMappingOptions extends Partial<GenericMappingOptions<ContentfulEntry>> {
  baseUrl: string;
  /** Field name holding the URL slug (default: "slug"). */
  slugField?: string;
  pathPrefix?: string;
}

/**
 * Maps a Contentful Delivery API `entries.items` array to `SitemapEntry[]`.
 *
 * @example
 * const { items } = await contentfulClient.getEntries({ content_type: 'blogPost' });
 * const entries = mapContentfulEntriesToSitemap(items, { baseUrl: 'https://example.com', pathPrefix: '/blog' });
 */
export function mapContentfulEntriesToSitemap(entries: ContentfulEntry[], options: ContentfulMappingOptions): SitemapEntry[] {
  const slugField = options.slugField ?? 'slug';

  return mapRecordsToSitemapEntries(entries, {
    baseUrl: options.baseUrl,
    pathPrefix: options.pathPrefix,
    changefreq: options.changefreq,
    priority: options.priority,
    slugField: (entry) => String(entry.fields[slugField] ?? entry.sys.id),
    updatedAtField: (entry) => entry.sys.updatedAt,
    imageField:
      options.imageField ??
      ((entry) => {
        const image = entry.fields['coverImage'] as { fields?: { file?: { url?: string } } } | undefined;
        const url = image?.fields?.file?.url;
        return url ? (url.startsWith('//') ? `https:${url}` : url) : undefined;
      }),
  });
}
