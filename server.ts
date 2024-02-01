import { logDevReady } from '@remix-run/cloudflare'
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages'
import * as build from '@remix-run/dev/server-build'
import { createShopifyApp } from '~/shopify.server'
import type { Context } from './cloudflare.env'

if (process.env.NODE_ENV === 'development') {
  logDevReady(build)
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: async (context: Context) => {
    const shopify = createShopifyApp(context.env)

    return {
      env: context.env,
      shopify,
    }
  },
  mode: build.mode,
})
