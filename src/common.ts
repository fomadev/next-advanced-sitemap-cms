/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import type { SitemapEntry, SitemapImage } from 'next-advanced-sitemap';

/** Resolves a dot-notation path (e.g. "attributes.seo.title") against a record. */
export function getByPath(record: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined;
    return (value as Record<string, unknown>)[key];
  }, record);
}

export interface GenericMappingOptions<TRecord = unknown> {
  /** Absolute base URL of the site, e.g. "https://example.com" (no trailing slash). */
  baseUrl: string;
  /** URL path prefix prepended to the slug, e.g. "/blog" (default: ""). */
  pathPrefix?: string;
  /** Dot-notation path (or accessor function) resolving the record's URL slug. */
  slugField: string | ((record: TRecord) => string);
  /** Dot-notation path (or accessor function) resolving the last-modified date. */
  updatedAtField?: string | ((record: TRecord) => string | Date | undefined);
  /** Dot-notation path (or accessor function) resolving a cover/featured image URL. */
  imageField?: string | ((record: TRecord) => string | undefined);
  /** Static changefreq applied to every generated entry. */
  changefreq?: SitemapEntry['changefreq'];
  /** Static priority applied to every generated entry. */
  priority?: SitemapEntry['priority'];
}

function resolve<TRecord>(record: TRecord, field: string | ((record: TRecord) => unknown) | undefined): unknown {
  if (!field) return undefined;
  return typeof field === 'function' ? field(record) : getByPath(record, field);
}

/**
 * Generic record -> SitemapEntry mapper shared by every CMS-specific adapter
 * in this package. Each adapter (strapi.ts, contentful.ts, ...) is a thin,
 * opinionated wrapper around this function with sensible default field paths
 * for that CMS's typical response shape.
 */
export function mapRecordsToSitemapEntries<TRecord>(
  records: TRecord[],
  options: GenericMappingOptions<TRecord>
): SitemapEntry[] {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const prefix = options.pathPrefix ? `/${options.pathPrefix.replace(/^\/+|\/+$/g, '')}` : '';

  return records.map((record) => {
    const slug = String(resolve(record, options.slugField) ?? '').replace(/^\/+/, '');
    const updatedAtRaw = resolve(record, options.updatedAtField) as string | Date | undefined;
    const imageUrl = resolve(record, options.imageField) as string | undefined;

    const entry: SitemapEntry = {
      url: `${baseUrl}${prefix}/${slug}`,
      changefreq: options.changefreq,
      priority: options.priority,
    };

    if (updatedAtRaw) {
      entry.lastmod = updatedAtRaw;
    }

    if (imageUrl) {
      const image: SitemapImage = { loc: imageUrl };
      entry.images = [image];
    }

    return entry;
  });
}
