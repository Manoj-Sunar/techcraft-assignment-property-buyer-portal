'use client';

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider, hydrate } from '@tanstack/react-query';

interface Props {
  children: ReactNode;
  dehydratedState?: unknown;
}

export default function ReactQueryProvider({ children, dehydratedState }: Props) {
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  );

  // ✅ Hydrate queries into QueryClient
  if (dehydratedState) {
    hydrate(queryClient, dehydratedState as any);
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}