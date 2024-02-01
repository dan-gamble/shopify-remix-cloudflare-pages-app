import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  await context.shopify.authenticate.admin(request);

  return null;
};
