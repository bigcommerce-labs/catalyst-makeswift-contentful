import { NextRequest } from 'next/server';
import { parse as parseSetCookie } from 'set-cookie-parser';

import { MiddlewareFactory } from './compose-middlewares';

export const withMakeswift: MiddlewareFactory = (middleware) => {
  return async (request, event) => {
    /**
     * Check if the incoming request URL has a secret attached to it
     *
     * @todo either by query param _or_ URL?
     */
    const apiKey = request.nextUrl.searchParams.get('x-makeswift-draft-mode');

    /**
     * Check that the secret matches the given Makeswift API key
     */
    if (apiKey === process.env.MAKESWIFT_SITE_API_KEY) {
      /**
       * If it does, initiate a fetch request to an API endpoint. This endpoint
       * simply enables draft mode and then returns the response. We can also
       * attach other data to this response via cookies/headers as well
       */
      const response = await fetch(new URL('/api/makeswift/draft-mode', request.nextUrl.origin), {
        headers: {
          'x-makeswift-api-key': apiKey,
        },
      });

      /**
       * If the request to enable draft mode is successful, it will have the
       * `__prerender_bypass` value in its `Set-Cookie` header. We can extract
       * this value and attach it to the incoming request.
       */
      const cookies = parseSetCookie(response.headers.get('set-cookie') || '');
      const prerenderBypassValue = cookies.find((c) => c.name === '__prerender_bypass')?.value;

      /**
       * If the `__prerender_bypass` cookie is not found, continue to the next
       * middleware without modifying the request
       */
      if (!prerenderBypassValue) {
        return middleware(request, event);
      }

      const proxiedRequest = new NextRequest(request);

      proxiedRequest.cookies.set('__prerender_bypass', prerenderBypassValue);
      proxiedRequest.cookies.set(
        'x-makeswift-draft-data',
        JSON.stringify({ makeswift: true, siteVersion: 'Working' }),
      );

      /**
       * Continue to the next middleware with the modified request
       */
      return middleware(proxiedRequest, event);
    }

    /**
     * If incoming request URL does not have a secret attached to it,
     * continue to the next middleware without modifying the request
     */
    return middleware(request, event);
  };
};
