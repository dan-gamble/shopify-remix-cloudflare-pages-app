import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { KVSessionStorage } from '@shopify/shopify-app-session-storage-kv'
import type { Env } from '../cloudflare.env'

export function createShopifyApp (env: Env) {
  const shopify = shopifyApp({
    apiKey: env.SHOPIFY_API_KEY,
    apiSecretKey: env.SHOPIFY_API_SECRET || "",
    apiVersion: LATEST_API_VERSION,
    scopes: env.SCOPES?.split(","),
    appUrl: env.SHOPIFY_APP_URL || "",
    authPathPrefix: "/auth",
    sessionStorage: new KVSessionStorage(env.KV),
    distribution: AppDistribution.AppStore,
    restResources,
    webhooks: {
      APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/webhooks",
      },
    },
    hooks: {
      afterAuth: async ({ session }) => {
        shopify.registerWebhooks({ session });
      },
    },
    future: {
      v3_webhookAdminContext: true,
      v3_authenticatePublic: true,
      unstable_newEmbeddedAuthStrategy: true,
    },
    ...(env.SHOP_CUSTOM_DOMAIN
      ? { customShopDomains: [env.SHOP_CUSTOM_DOMAIN] }
      : {}),
  })

  return shopify
}
