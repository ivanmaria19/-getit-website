import { validateEnquiry, type Enquiry } from '../enquiries/validation';
import type { DeliveryConfig } from './enquiry-config';

const MAX_BYTES = 12 * 1024;
const unavailable = 'Versturen is op dit moment niet beschikbaar. Je gegevens blijven in het formulier staan. Probeer het later opnieuw.';

// Short-lived process-wide counters only: no IP, visitor data or enquiry retention.
// Each server instance has its own budget; assess host-level limits before launch.
export function createRateLimit(limit = 20, duration = 60000) {
  let start = 0, count = 0;
  return () => {
    const now = Date.now();
    if (now - start >= duration) { start = now; count = 0; }
    return ++count <= limit;
  };
}

export function createEnquiryHandler(deps: {
  config: () => DeliveryConfig;
  deliver: (data: Enquiry, config: DeliveryConfig, key: string) => Promise<void>;
  allow: () => boolean;
}) {
  return async function POST(request: Request): Promise<Response> {
    const reply = (status: number, body: object, headers?: Record<string, string>) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
    const config = deps.config();
    const origin = request.headers.get('origin');
    let allowedOrigin = origin === (config.origin || new URL(request.url).origin);
    // Next may normalize its internal local URL to localhost while the browser uses
    // 127.0.0.1. Permit equivalent loopback hosts only for disabled local review.
    if (!allowedOrigin && origin && !config.enabled && !config.origin) {
      try {
        const browser = new URL(origin), server = new URL(request.url);
        const loopback = ['localhost', '127.0.0.1', '[::1]'];
        allowedOrigin = loopback.includes(browser.hostname) && loopback.includes(server.hostname)
          && browser.port === server.port && browser.protocol === server.protocol;
      } catch { /* Invalid origins are rejected. */ }
    }
    if (!origin || !allowedOrigin || request.headers.get('sec-fetch-site') === 'cross-site') return reply(403, { message: 'Dit formulier kan alleen vanaf de GetIt-website worden verstuurd.' });
    if (!deps.allow()) return reply(429, { message: 'Er zijn te veel aanvragen. Wacht een minuut en probeer opnieuw.' }, { 'Retry-After': '60' });
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, { message: 'Ongeldig formulierformaat.' });
    if (Number(request.headers.get('content-length')) > MAX_BYTES) return reply(413, { message: 'Het formulier is te groot. Maak je bericht korter.' });
    let raw: unknown;
    try {
      const reader = request.body?.getReader();
      if (!reader) return reply(400, { message: 'Controleer het formulier.' });
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > MAX_BYTES) { await reader.cancel(); return reply(413, { message: 'Het formulier is te groot. Maak je bericht korter.' }); }
          chunks.push(value);
        }
      } finally { reader.releaseLock(); }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      raw = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    } catch { return reply(400, { message: 'Controleer het formulier en probeer opnieuw.' }); }
    const result = validateEnquiry(raw);
    if (!result.ok) return reply(422, { message: 'Controleer de aangegeven velden.', errors: result.errors });
    const key = request.headers.get('idempotency-key') ?? '';
    if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(key)) return reply(400, { message: 'Vernieuw de pagina en probeer opnieuw.' });
    if (!config.enabled) return reply(503, { message: unavailable });
    try {
      await deps.deliver(result.data, config, key);
      return reply(200, { ok: true, message: 'Bedankt! Je interesse is verstuurd naar GetIt.' });
    } catch { return reply(502, { message: 'Versturen is niet gelukt. Je gegevens blijven staan. Probeer opnieuw; controleer je verbinding als het probleem blijft bestaan.' }); }
  };
}
