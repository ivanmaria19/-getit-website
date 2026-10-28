import type { Metadata } from 'next';
import { Brand } from '@/components/Brand';

export const metadata: Metadata = { title: 'Contact', description: 'Neem contact op met GetIt.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return <main className="wrap information-page"><Brand /><div className="eyebrow">GetIt</div><h1>Contact</h1>
    <p>Een vraag over GetIt of een samenwerking? We horen graag van je.</p>
    <a className="textlink" href="mailto:ivanspeakz@gmail.com">ivanspeakz@gmail.com <span aria-hidden="true">↗</span></a>
    <p>GetIt brengt geselecteerde creators en bijzondere restaurants, cafés en bars samen.</p>
    <nav className="information-links" aria-label="Meer informatie"><a href="/">Terug naar GetIt</a><a href="/privacy">Privacy</a></nav>
  </main>;
}
