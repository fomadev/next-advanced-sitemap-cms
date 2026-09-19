/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import type { SitemapEntry } from 'next-advanced-sitemap';
import { mapRecordsToSitemapEntries, GenericMappingOptions } from './common.js';

/** Shape of a single Strapi REST API v4 entry (`data[]` array item). */
export interface StrapiEntry {
  id: number;
  attributes: Record<string, unknown>;
}

export interface StrapiMappingOptions extends Partial<GenericMappingOptions<StrapiEntry>> {
  baseUrl: string;
  /** Attribute name holding the URL slug (default: "slug"). */
  slugAttribute?: string;
  /** Attribute name holding the last update timestamp (default: "updatedAt"). */
  updatedAtAttribute?: string;
  pathPrefix?: string;
}

/**
 * Maps a Strapi v4 REST API response (`{ data: StrapiEntry[] }`) to
 * `SitemapEntry[]`. Pass the already-fetched `data` array — this package
 * intentionally does not perform the HTTP call itself, so it never dictates
 * your Strapi authentication strategy.
 *
 * @example
 * const res = await fetch(`${STRAPI_URL}/api/articles?populate=cover`);
 * const { data } = await res.json();
 * const entries = mapStrapiEntriesToSitemap(data, { baseUrl: 'https://example.com', pathPrefix: '/blog' });
 */
export function mapStrapiEntriesToSitemap(entries: StrapiEntry[], options: StrapiMappingOptions): SitemapEntry[] {
  const slugAttribute = options.slugAttribute ?? 'slug';
  const updatedAtAttribute = options.updatedAtAttribute ?? 'updatedAt';

  return mapRecordsToSitemapEntries(entries, {
    baseUrl: options.baseUrl,
    pathPrefix: options.pathPrefix,
    changefreq: options.changefreq,
    priority: options.priority,
    slugField: (entry) => String(entry.attributes[slugAttribute] ?? entry.id),
    updatedAtField: (entry) => entry.attributes[updatedAtAttribute] as string | undefined,
    imageField:
      options.imageField ??
      ((entry) => {
        const cover = entry.attributes['cover'] as { data?: { attributes?: { url?: string } } } | undefined;
        return cover?.data?.attributes?.url;
      }),
  });
}
