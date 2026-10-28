import { getEnquiryConfig } from '@/lib/server/enquiry-config';
import { deliverEnquiry } from '@/lib/server/enquiry-delivery';
import { createEnquiryHandler, createRateLimit } from '@/lib/server/enquiry-handler';

export const runtime = 'nodejs';
const allow = createRateLimit();
export const POST = createEnquiryHandler({ config: getEnquiryConfig, deliver: deliverEnquiry, allow });
