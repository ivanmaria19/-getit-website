import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';
const bodyFont = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const displayFont = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
export const metadata: Metadata = {
  metadataBase: new URL('https://wearegetit.com'),
  title: { default: 'GetIt | Mooie plekken. Echte makers. Goede klik.', template: '%s | GetIt' },
  description: 'GetIt verbindt geselecteerde creators en modellen met bijzondere restaurants, cafés en bars. Voor ervaringen die je wilt delen. En plekken die gezien mogen worden. Binnenkort in Amsterdam.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', locale: 'nl_NL', siteName: 'GetIt', url: '/',
    title: 'GetIt | Mooie plekken. Echte makers. Goede klik.',
    description: 'Bijzondere horeca ontmoet geselecteerde makers. Een mooie ervaring, in ruil voor content. Binnenkort in Amsterdam.',
    images: [{ url: '/social/getit.jpg', width: 1200, height: 630, alt: 'Een sfeervolle tafel als sfeerbeeld voor GetIt' }],
  },
  twitter: { card: 'summary_large_image', title: 'GetIt | Good things. Worth sharing.', description: 'Bijzondere horeca ontmoet geselecteerde makers. Binnenkort in Amsterdam.', images: ['/social/getit.jpg'] },
  // Keep review builds unindexed. Change only during approved production launch.
  robots: { index: false, follow: false },
  // Keep translation tools from rewriting the DOM before React hydrates it.
  other: { google: 'notranslate' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl" translate="no" className={'notranslate ' + bodyFont.variable + ' ' + displayFont.variable}><body>{children}</body></html>;
}
