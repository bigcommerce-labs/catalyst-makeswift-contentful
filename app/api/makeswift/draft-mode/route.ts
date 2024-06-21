import { draftMode } from 'next/headers';
import { NextRequest } from 'next/server';

export const GET = (request: NextRequest) => {
  /**
   * This route is called by the withMakeswift middleware to enable draft mode.
   *
   * First, we check if the request has the Makeswift API key attached to it.
   * This is to prevent unauthorized access to the draft mode endpoint.
   */
  if (request.headers.get('x-makeswift-api-key') === process.env.MAKESWIFT_SITE_API_KEY) {
    /**
     * Then, we enable draft mode using `draftMode().enable()`.
     *
     * According to the Next.js docs on Draft Mode, `draftMode().enable()` does two things:
     * 1. Adds a 'Set-Cookie' header containing the `__prerender_bypass` cookie on the response
     * 2. If you request a page which has the cookie set, then data will be fetched at request
     * time (instead of at build time).
     */
    draftMode().enable();
  }

  /**
   * Finally, we return a 200 response with an empty body
   */
  return new Response(null);
};
