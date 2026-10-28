import 'server-only';
import { validEmail } from '../enquiries/validation';

export type DeliveryConfig = { enabled: boolean; formsApproved: boolean; privacyUrl: string; apiKey: string; from: string; to: string; origin: string };

export function getEnquiryConfig(): DeliveryConfig {
  let privacyUrl = '';
  let origin = '';
  try {
    const url = new URL(process.env.ENQUIRY_PRIVACY_URL ?? '');
    const pendingLocalPolicy = ['wearegetit.com', 'www.wearegetit.com', 'wearegetit.nl', 'www.wearegetit.nl'].includes(url.hostname)
      && url.pathname.replace(/\/$/, '') === '/privacy';
    // /privacy is currently an honest pending-policy page, not an approved policy.
    if (url.protocol === 'https:' && !url.username && !url.password && !pendingLocalPolicy) privacyUrl = url.href;
  } catch { /* Unconfirmed legal links stay absent. */ }
  try {
    const url = new URL(process.env.ENQUIRY_SITE_ORIGIN ?? '');
    if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) origin = url.origin;
  } catch { /* Request origin is used for disabled local validation only. */ }
  const from = process.env.ENQUIRY_FROM_EMAIL?.trim() ?? '';
  const to = process.env.ENQUIRY_TO_EMAIL?.trim() ?? '';
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? '';
  const formsApproved = process.env.ENQUIRY_FIELDS_APPROVED === 'true';
  // Flags record decisions made outside the code; they are not evidence of approval.
  const enabled = formsApproved && !!privacyUrl && !!origin && !!apiKey && validEmail(from) && validEmail(to)
    && process.env.ENQUIRY_SENDING_ENABLED === 'true'
    && process.env.ENQUIRY_RECIPIENT_CONFIRMED === 'true';
  return { enabled, formsApproved, privacyUrl, apiKey, from, to, origin };
}
