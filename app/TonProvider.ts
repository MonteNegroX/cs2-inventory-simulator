import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const TON_APP_MANIFEST_URL = 'http://localhost:3001/tonconnect-manifest.json';

export function TonProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={TON_APP_MANIFEST_URL}>
      {children}
    </TonConnectUIProvider>
  );
}
