import type { Metadata } from 'next';
import { Brand } from '@/components/Brand';
import { getEnquiryConfig } from '@/lib/server/enquiry-config';

export const metadata: Metadata = { title: 'Privacy', description: 'Privacyinformatie van GetIt.', alternates: { canonical: '/privacy' } };
export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
  const { privacyUrl } = getEnquiryConfig();
  let externalPolicy = false;
  if (privacyUrl) {
    const url = new URL(privacyUrl);
    externalPolicy = !(['wearegetit.com', 'www.wearegetit.com', 'wearegetit.nl', 'www.wearegetit.nl'].includes(url.hostname) && url.pathname.replace(/\/$/, '') === '/privacy');
  }
  return <main className="wrap information-page"><Brand /><div className="eyebrow">GetIt</div><h1>Privacy</h1>
    {externalPolicy ? <><p>Lees hoe GetIt met je persoonsgegevens omgaat.</p><a className="textlink" href={privacyUrl}>Lees de privacyverklaring <span aria-hidden="true">↗</span></a></>
      : <><p>De definitieve privacyverklaring wordt hier binnenkort gepubliceerd.</p><p>Het interesseformulier is nog niet beschikbaar. Heb je een privacyvraag? Neem contact op via <a href="mailto:ivanspeakz@gmail.com">ivanspeakz@gmail.com</a>.</p></>}
    <nav className="information-links" aria-label="Meer informatie"><a href="/">Terug naar GetIt</a><a href="/contact">Contact</a></nav>
  </main>;
}
