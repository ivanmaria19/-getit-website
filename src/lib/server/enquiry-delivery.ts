import type { Enquiry } from '../enquiries/validation';
import type { DeliveryConfig } from './enquiry-config';

export class DeliveryUnavailable extends Error {}
export class DeliveryFailed extends Error {}

export async function deliverEnquiry(data: Enquiry, config: DeliveryConfig, idempotencyKey: string, fetcher: typeof fetch = fetch): Promise<void> {
  if (!config.enabled || !config.apiKey || !config.from || !config.to) throw new DeliveryUnavailable();
  const text = [
    data.audience === 'creator' ? 'Interesse als creator/model' : 'Interesse als horecazaak',
    `Naam: ${data.name}`, `E-mailadres: ${data.email}`,
    data.audience === 'creator' ? `Profiel/portfolio: ${data.profile || '(niet opgegeven)'}` : `Horecazaak: ${data.venue}`,
    `Bericht: ${data.message || '(geen bericht)'}`,
  ].join('\n');
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `getit-${data.audience}-${idempotencyKey}` },
      body: JSON.stringify({ from: config.from, to: [config.to], reply_to: data.email,
        subject: data.audience === 'creator' ? 'GetIt: interesse als creator/model' : 'GetIt: interesse als horecazaak', text }),
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    // Do not forward provider responses, credentials or visitor details to the browser/logs.
    if (!response.ok) throw new DeliveryFailed();
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id) throw new DeliveryFailed();
  } catch { throw new DeliveryFailed(); }
}
