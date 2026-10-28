import type { Metadata } from 'next';
import { EnquiryPage } from '@/components/EnquiryPage';
export const metadata: Metadata = {
  title: 'Interesse als horecazaak',
  description: 'Laat je interesse zien als restaurant, café of bar bij GetIt. Ontmoet passende creators en modellen in Amsterdam.',
  alternates: { canonical: '/interesse/horeca' },
  openGraph: { title: 'Interesse als horecazaak | GetIt', url: '/interesse/horeca', locale: 'nl_NL', siteName: 'GetIt', description: "Ontmoet passende creators en modellen voor jouw restaurant, café of bar in Amsterdam.", type: 'website', images: [{ url: '/social/getit.jpg', width: 1200, height: 630, alt: 'Een sfeervolle tafel als sfeerbeeld voor GetIt' }] },
  twitter: { card: 'summary_large_image', title: "Interesse als horecazaak | GetIt", description: "Ontmoet passende creators en modellen voor jouw restaurant, café of bar in Amsterdam.", images: ['/social/getit.jpg'] },
};
export const dynamic = 'force-dynamic';
export default function Page() { return <EnquiryPage audience="horeca" />; }
