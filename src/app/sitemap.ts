import type { MetadataRoute } from "next";
import { SITE_URL } from "~/utils/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date() }];
}
