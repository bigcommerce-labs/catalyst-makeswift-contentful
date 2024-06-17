'use client';

import { PropsWithChildren } from 'react';

import { CompareProductsProvider } from '~/app/contexts/compare-products-context';
import { MakeswiftProvider } from '~/makeswift/provider';

export function Providers({ children }: PropsWithChildren) {
  return (
    <MakeswiftProvider>
      <CompareProductsProvider>{children}</CompareProductsProvider>
    </MakeswiftProvider>
  );
}
