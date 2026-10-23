import { createServerFn } from '@tanstack/react-start';
import { quoteSchema } from './quote-schema';

export const submitQuote = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    // This public endpoint can only insert a validated enquiry, never read private enquiries.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { website: _trap, ...row } = data;
    const { error } = await supabaseAdmin.from('quote_requests').insert(row);
    // The same submission key makes a retry safe after an interrupted response.
    if (error && error.code !== '23505') return { success: false as const };
    return { success: true as const, reference: data.submission_key.slice(0, 8).toUpperCase() };
  });