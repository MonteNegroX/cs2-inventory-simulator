import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const TON_APP_MANIFEST_URL = 'http://localhost:3001/tonconnect-manifest.json';

interface TonProviderProps {
  children: React.ReactNode;
}

export function TonProvider({ children }: TonProviderProps) {
  return (
    <TonConnectUIProvider manifestUrl={TON_APP_MANIFEST_URL}>
      {children}
    </TonConnectUIProvider>
  );
}
