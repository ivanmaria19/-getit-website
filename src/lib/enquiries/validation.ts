export type Audience = 'creator' | 'horeca';
export type FieldName = 'name' | 'email' | 'profile' | 'venue' | 'message';
export type FieldErrors = Partial<Record<FieldName | '_form', string>>;
export type Enquiry = { audience: Audience; name: string; email: string; message: string; profile?: string; venue?: string };
type Field = { name: FieldName; label: string; type: 'text' | 'email' | 'url' | 'textarea'; required: boolean; maxLength: number; autoComplete?: string };

// Remaining field lists are provisional; user confirmed profile/portfolio is optional.
export function fieldsFor(audience: Audience): Field[] {
  return [
    { name: 'name', label: audience === 'creator' ? 'Naam' : 'Naam contactpersoon', type: 'text', required: true, maxLength: 100, autoComplete: 'name' },
    { name: 'email', label: 'E-mailadres', type: 'email', required: true, maxLength: 254, autoComplete: 'email' },
    audience === 'creator'
      ? { name: 'profile', label: 'Link naar sociaal profiel of portfolio', type: 'url', required: false, maxLength: 2048, autoComplete: 'url' }
      : { name: 'venue', label: 'Naam horecazaak', type: 'text', required: true, maxLength: 150, autoComplete: 'organization' },
    { name: 'message', label: audience === 'creator' ? 'Vertel iets over jezelf' : 'Wat zou je voor jouw zaak willen bereiken?', type: 'textarea', required: false, maxLength: 2000 },
  ];
}

export function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(value);
}

export function validateEnquiry(input: unknown): { ok: true; data: Enquiry } | { ok: false; errors: FieldErrors } {
  const formError = { ok: false as const, errors: { _form: 'Controleer het formulier en probeer het opnieuw.' } };
  if (!input || typeof input !== 'object' || Array.isArray(input)) return formError;
  const raw = input as Record<string, unknown>;
  if (raw.audience !== 'creator' && raw.audience !== 'horeca') return formError;
  const fields = fieldsFor(raw.audience);
  const allowed = new Set(['audience', 'faxNumber', ...fields.map(f => f.name)]);
  if (Object.keys(raw).some(key => !allowed.has(key)) || (raw.faxNumber !== undefined && raw.faxNumber !== '')) return formError;
  const errors: FieldErrors = {};
  const values: Record<string, string> = {};
  for (const field of fields) {
    const value = raw[field.name];
    if (value !== undefined && typeof value !== 'string') { errors[field.name] = 'Vul een geldige waarde in.'; continue; }
    const text = (value as string | undefined)?.trim() ?? '';
    values[field.name] = text;
    if (field.required && !text) errors[field.name] = 'Vul dit veld in.';
    else if (text.length > field.maxLength) errors[field.name] = `Gebruik maximaal ${field.maxLength} tekens.`;
    else if (/\p{Cc}/u.test(text.replace(field.type === 'textarea' ? /[\n\r\t]/g : /$^/g, ''))) errors[field.name] = 'Verwijder ongeldige tekens.';
    else if (text && field.type === 'email' && !validEmail(text)) errors[field.name] = 'Vul een geldig e-mailadres in.';
    else if (text && field.type === 'url') {
      try {
        const url = new URL(text);
        if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error();
      } catch { errors[field.name] = 'Vul een volledige http- of https-link in.'; }
    }
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { audience: raw.audience, ...values } as Enquiry };
}
