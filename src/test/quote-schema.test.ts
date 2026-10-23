import { describe, expect, it } from 'vitest';
import { quoteSchema, serviceNames } from '@/lib/quote-schema';
const valid = { name: 'Test Enquiry', phone: '+234 814 128 2602', email: 'quote-test@example.com', property_location: 'FCT, Abuja', service: 'Post-Construction Cleaning', property_type: 'Apartment', preferred_date: '2026-11-20', description: 'Post construction cleaning for a two bedroom apartment.', privacy_consent: true, website: '', submission_key: 'a307f5d1-1642-49e0-8c58-5fd0e2a8f119' };
describe('Quote requirements', () => {
  it('accepts a complete enquiry', () => expect(quoteSchema.safeParse(valid).success).toBe(true));
  it('requires every requested field', () => {
    for (const key of ['name','phone','email','property_location','service','property_type','preferred_date','description']) {
      expect(quoteSchema.safeParse({ ...valid, [key]: '' }).success).toBe(false);
    }
  });
  it('offers exactly the five supplied services', () => expect(serviceNames).toEqual(['Post-Construction Cleaning','Post-Renovation Cleaning','Property Transition Cleaning (Move-In/Move-Out)','Deep Cleaning','Fumigation Services']));
  it('rejects submissions without privacy consent', () => expect(quoteSchema.safeParse({ ...valid, privacy_consent: false }).success).toBe(false));
  it('rejects the spam trap', () => expect(quoteSchema.safeParse({ ...valid, website: 'spam' }).success).toBe(false));
  it('rejects invalid calendar dates', () => expect(quoteSchema.safeParse({ ...valid, preferred_date: '2026-02-31' }).success).toBe(false));
});