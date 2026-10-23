import { useRef, useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CheckCircle2, Loader2, ArrowUpRight, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { quoteSchema, serviceNames, propertyTypes } from '@/lib/quote-schema';
import { submitQuote } from '@/lib/quotes.functions';

const fieldClass = 'w-full min-w-0 rounded-sm border border-input bg-card px-3 py-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring';
export function QuoteForm() {
  const send = useServerFn(submitQuote);
  const key = useRef<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    key.current ??= crypto.randomUUID();
    const parsed = quoteSchema.safeParse({ ...Object.fromEntries(form), privacy_consent: form.get('privacy_consent') === 'on', submission_key: key.current });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check your details.'); return; }
    setPending(true); setError('');
    try {
      const result = await send({ data: parsed.data });
      if (!result.success) { setError('Your request could not be saved. Please try again or call +234 814 128 2602.'); return; }
      setReference(result.reference);
    } catch { setError('We could not confirm your submission. Please retry; your request will not be duplicated.'); }
    finally { setPending(false); }
  }
  if (reference) return <div role="status" tabIndex={-1} className="border-t border-border py-10"><CheckCircle2 className="mb-5 size-10 text-primary" /><h3 className="text-3xl">Your request is saved.</h3><p className="mt-4 text-muted-foreground">Thank you for contacting MsTidy. Your enquiry has been securely received.</p><p className="mt-4 text-sm">Reference: {reference}</p><Button className="mt-6" variant="outline" onClick={() => { setReference(''); key.current = null; }}>Send another enquiry</Button></div>;
  return <form onSubmit={onSubmit} className="grid min-w-0 gap-5" aria-busy={pending}>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium">Full name<input required name="name" autoComplete="name" maxLength={100} className={fieldClass} /></label>
      <label className="grid gap-2 text-sm font-medium">Phone number<input required name="phone" type="tel" autoComplete="tel" minLength={7} maxLength={30} className={fieldClass} /></label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Email address<input required name="email" type="email" autoComplete="email" maxLength={255} className={fieldClass} /></label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Property location<input required name="property_location" maxLength={200} placeholder="Area and address in FCT, Abuja" className={fieldClass} /></label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Service required<select required name="service" className={fieldClass}><option value="">Select a service</option>{serviceNames.map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-medium">Property type<select required name="property_type" className={fieldClass}><option value="">Select property type</option>{propertyTypes.map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-medium">Preferred service date<input required type="date" name="preferred_date" className={fieldClass} /></label>
    </div>
    <label className="grid gap-2 text-sm font-medium">Job description<textarea required name="description" minLength={10} maxLength={3000} rows={4} placeholder="Property size, condition and areas needing attention" className={fieldClass} /></label>
    <label className="absolute -left-[10000px]" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="flex items-start gap-3 text-sm text-muted-foreground"><input required type="checkbox" name="privacy_consent" className="mt-1 size-4 shrink-0 accent-primary" /><span>I agree to MsTidy using my details to assess and respond to this enquiry. Details are stored securely and are not displayed publicly. Contact mstidycs@gmail.com to request access or deletion.</span></label>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" size="lg" disabled={pending} className="h-12 w-full">{pending ? <><Loader2 className="animate-spin" />Submitting…</> : <>Send quote request<ArrowUpRight /></>}</Button>
    <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3" />Your enquiry is private.</p>
  </form>;
}