import { AppShowcase } from '@/components/AppShowcase';
import { Header, Hero, BrandStrip, AudienceCards, CreatorMoment, Editorial, ExampleExperience, FAQ, FinalCTA, Footer } from '@/components/Marketing';
import { MarketingDemos } from '@/components/MarketingDemos';
import { EnquiryPopups } from '@/components/EnquiryPopups';
import { EnquiryPage } from '@/components/EnquiryPage';
export const dynamic = 'force-dynamic';
export default function Home() {
  return <EnquiryPopups creator={<EnquiryPage audience="creator" popup />} horeca={<EnquiryPage audience="horeca" popup />}><MarketingDemos><a className="skip-link" href="#main">Naar de inhoud</a><Header /><main id="main"><Hero /><BrandStrip /><AudienceCards /><CreatorMoment /><AppShowcase /><Editorial /><ExampleExperience /><FAQ /><FinalCTA /></main><Footer /></MarketingDemos></EnquiryPopups>;
}
