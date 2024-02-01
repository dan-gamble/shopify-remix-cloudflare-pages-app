/// <reference types="@cloudflare/workers-types" />

import type { createShopifyApp } from '~/utils/shopify.server'

interface Env {
  KV: KVNamespace;
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  SCOPES: string;
  SHOPIFY_APP_URL: string;
  SHOP_CUSTOM_DOMAIN?: string;
}

type Context = EventContext<Env, string, unknown>;

interface LoadContext {
  env: Env,
  shopify: ReturnType<typeof createShopifyApp>
}

declare module "@remix-run/server-runtime" {
  interface AppLoadContext extends LoadContext {}
}
