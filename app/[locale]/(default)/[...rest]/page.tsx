import { Page as MakeswiftPage } from '@makeswift/runtime/next';
import { getSiteVersion } from '@makeswift/runtime/next/server';
import { notFound } from 'next/navigation';

import { locales } from '~/i18n';
import { client } from '~/integrations/makeswift/client';
import { MakeswiftProvider } from '~/integrations/makeswift/provider';

interface CatchAllParams {
  locale: string;
  rest: string[];
}

export async function generateStaticParams() {
  const pages = await client.getPages().toArray();

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      rest: page.path.split('/').filter((segment) => segment !== ''),
      locale,
    })),
  );
}

export default async function Page({ params }: { params: CatchAllParams }) {
  const path = `/${params.rest.join('/')}`;

  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
    locale: params.locale,
  });

  if (snapshot == null) return notFound();

  return (
    <MakeswiftProvider>
      <MakeswiftPage snapshot={snapshot} />
    </MakeswiftProvider>
  );
}

export const runtime = 'nodejs';
