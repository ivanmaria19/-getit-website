import 'server-only';
import { validEmail } from '../enquiries/validation';

export type DeliveryConfig = { enabled: boolean; formsApproved: boolean; privacyUrl: string; apiKey: string; from: string; to: string; origin: string; disabledReasons?: string[] };

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
  // Only fixed diagnostic codes, never environment values or credentials.
  const disabledReasons = [
    !formsApproved && 'ENQUIRY_FIELDS_APPROVED_not_true',
    !privacyUrl && 'ENQUIRY_PRIVACY_URL_missing_invalid_or_pending_policy',
    !origin && 'ENQUIRY_SITE_ORIGIN_missing_or_invalid',
    !apiKey && 'RESEND_API_KEY_missing',
    !validEmail(from) && 'ENQUIRY_FROM_EMAIL_missing_or_invalid',
    !validEmail(to) && 'ENQUIRY_TO_EMAIL_missing_or_invalid',
    process.env.ENQUIRY_SENDING_ENABLED !== 'true' && 'ENQUIRY_SENDING_ENABLED_not_true',
    process.env.ENQUIRY_RECIPIENT_CONFIRMED !== 'true' && 'ENQUIRY_RECIPIENT_CONFIRMED_not_true',
  ].filter((reason): reason is string => typeof reason === 'string');
  return { enabled, formsApproved, privacyUrl, apiKey, from, to, origin, disabledReasons };
}
