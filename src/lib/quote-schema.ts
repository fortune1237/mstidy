import { z } from 'zod';

export const serviceNames = ['Post-Construction Cleaning', 'Post-Renovation Cleaning', 'Property Transition Cleaning (Move-In/Move-Out)', 'Fumigation Services'] as const;
export const propertyTypes = ['Apartment', 'House', 'Office', 'Commercial property', 'Other'] as const;
export const quoteSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(100),
  phone: z.string().trim().min(7).max(30).regex(/^[+\d\s()-]+$/, 'Please enter a valid phone number.'),
  email: z.string().trim().email('Please enter a valid email.').max(255),
  property_location: z.string().trim().min(1, 'Please enter the property location.').max(200),
  service: z.enum(serviceNames),
  property_type: z.enum(propertyTypes),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a date.').refine(v => {
    const date = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === v;
  }, 'Please choose a valid date.'),
  description: z.string().trim().min(10, 'Please describe the job in at least 10 characters.').max(3000),
  privacy_consent: z.literal(true, { errorMap: () => ({ message: 'Please agree to the use of your details for this enquiry.' }) }),
  website: z.string().max(0, 'Unable to submit this request.'),
  submission_key: z.string().uuid(),
});
export type QuoteInput = z.infer<typeof quoteSchema>;