import type { Metadata } from 'next';
import { EnquiryPage } from '@/components/EnquiryPage';
export const metadata: Metadata = {
  title: 'Interesse als creator',
  description: 'Laat je interesse zien als creator of model bij GetIt. Bijzondere horeca en geselecteerde makers ontmoeten elkaar in Amsterdam.',
  alternates: { canonical: '/interesse/creator' },
  openGraph: { title: 'Interesse als creator | GetIt', url: '/interesse/creator', locale: 'nl_NL', siteName: 'GetIt', description: "Bijzondere horeca en geselecteerde makers ontmoeten elkaar in Amsterdam.", type: 'website', images: [{ url: '/social/getit.jpg', width: 1200, height: 630, alt: 'Een sfeervolle tafel als sfeerbeeld voor GetIt' }] },
  twitter: { card: 'summary_large_image', title: "Interesse als creator | GetIt", description: "Bijzondere horeca en geselecteerde makers ontmoeten elkaar in Amsterdam.", images: ['/social/getit.jpg'] },
};
export const dynamic = 'force-dynamic';
export default function Page() { return <EnquiryPage audience="creator" />; }
