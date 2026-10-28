import { Brand } from './Brand';
import { EnquiryForm } from './EnquiryForm';
import { getEnquiryConfig } from '@/lib/server/enquiry-config';
import type { Audience } from '@/lib/enquiries/validation';

export function EnquiryPage({ audience, popup = false }: { audience: Audience; popup?: boolean }) {
  const config = getEnquiryConfig();
  const Container = popup ? 'section' : 'main';
  const Heading = popup ? 'h2' : 'h1';
  return <Container className={popup ? 'enquiry-page enquiry-popup-content' : 'wrap enquiry-page'}>{!popup && <Brand />}
    <div className="eyebrow">{popup ? audience === 'creator' ? 'Voor creators' : 'Voor horecazaken' : audience === 'creator' ? 'Voor creators & modellen' : 'Voor restaurants, cafés & bars'}</div>
    <Heading>{audience === 'creator' ? 'Goede smaak. Een eigen blik.' : 'Jouw zaak verdient het juiste publiek.'}</Heading>
    <p className="enquiry-intro">{audience === 'creator' ? 'Ontdek bijzondere horeca en maak content op jouw manier. Laat je profiel achter; we bekijken of jouw stijl bij GetIt past.' : 'Benieuwd hoe creators jouw restaurant, café of bar in beeld kunnen brengen? Vertel ons over je zaak. We nemen persoonlijk contact op om te bespreken wat past.'}</p>
    <EnquiryForm audience={audience} sendingEnabled={config.enabled} privacyUrl={config.privacyUrl || '/privacy'} popup={popup} />
    {!popup && <a className="textlink" href="/#meedoen">Terug naar GetIt <span aria-hidden="true">↗</span></a>}
  </Container>;
}
