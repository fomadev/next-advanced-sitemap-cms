/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import type { SitemapEntry } from 'next-advanced-sitemap';
import { mapRecordsToSitemapEntries, GenericMappingOptions } from './common.js';

/** Shape of a Shopify Storefront/Admin API product node. */
export interface ShopifyProduct {
  handle: string;
  updatedAt: string;
  images?: { edges?: { node?: { url?: string } }[] };
  [key: string]: unknown;
}

export interface ShopifyMappingOptions extends Partial<GenericMappingOptions<ShopifyProduct>> {
  baseUrl: string;
  /** URL path prefix (default: "/products", matching Shopify's canonical product path). */
  pathPrefix?: string;
}

/**
 * Maps Shopify Storefront API `products.edges[].node` items to
 * `SitemapEntry[]`, defaulting to Shopify's canonical `/products/<handle>`
 * URL structure.
 *
 * @example
 * const { data } = await storefrontClient.request(PRODUCTS_QUERY);
 * const products = data.products.edges.map((e) => e.node);
 * const entries = mapShopifyProductsToSitemap(products, { baseUrl: 'https://shop.example.com' });
 */
export function mapShopifyProductsToSitemap(products: ShopifyProduct[], options: ShopifyMappingOptions): SitemapEntry[] {
  return mapRecordsToSitemapEntries(products, {
    baseUrl: options.baseUrl,
    pathPrefix: options.pathPrefix ?? '/products',
    changefreq: options.changefreq ?? 'daily',
    priority: options.priority,
    slugField: (product) => product.handle,
    updatedAtField: (product) => product.updatedAt,
    imageField: options.imageField ?? ((product) => product.images?.edges?.[0]?.node?.url),
  });
}
