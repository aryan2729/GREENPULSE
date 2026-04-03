import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Green Pulse — Smart Parks for Delhi',
  description: 'Intelligent citizen-centric platform for public green spaces in Delhi',
  icons: {
    icon: '/green-pulse.png',
    shortcut: '/green-pulse.png',
    apple: '/green-pulse.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
