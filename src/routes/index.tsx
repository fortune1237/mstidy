import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteForm } from "@/components/QuoteForm";
import hero from "@/assets/hero.jpg";
import work from "@/assets/work.jpg";
import office from "@/assets/office.jpg";
import mopAsset from "@/assets/mstidy-mop.png.asset.json";
import windowAsset from "@/assets/mstidy-window-detail.jpg.asset.json";

const TITLE = "MsTidy Abuja — Post-Construction & Property Turnover Cleaning";
const DESC =
  "MsTidy provides premium post-construction, renovation, property transition, deep cleaning and fumigation across FCT, Abuja. Request a tailored quote.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  { n: "01", t: "Post-Construction Cleaning", d: "Removal of dust, debris, paint splatter and residue so newly built spaces are ready for handover." },
  { n: "02", t: "Post-Renovation Cleaning", d: "Detailed cleaning after remodels — fixtures, surfaces, floors and fine dust in every corner." },
  { n: "03", t: "Property Transition Cleaning (Move-In/Move-Out)", d: "Property transition cleaning that leaves homes and offices fresh for the next occupant." },
  { n: "04", t: "Deep Cleaning", d: "Top-to-bottom, inside-and-out cleaning for residential and commercial properties." },
  { n: "05", t: "Fumigation Services", d: "Pest treatment tailored to the property and identified pest concerns, with preparation and re-entry guidance." },
];

const steps = [
  ["Request a quote", "Tell us about the property, its size and condition."],
  ["Site assessment", "We review the scope and agree a plan and timeline."],
  ["Meticulous clean", "Our team cleans, details and fumigates as required."],
  ["Move-in ready", "A final walkthrough so the space is ready for occupancy."],
];

const highlights = [
  { title: "Residential Property Preparation", service: "Post-Construction Cleaning", type: "Newly completed residential property", image: hero, alt: "Illustrative newly finished living room", description: "After construction, fine dust and residue can remain throughout a property. A detailed clean focuses on floors, surfaces and windows to prepare the space for occupancy.", scope: ["Fine-dust and residue removal", "Floor and surface care", "Window detailing"] },
  { title: "Renovation Cleanup", service: "Post-Renovation Cleaning", type: "Renovated home or office", image: office, alt: "Illustrative refreshed office interior", description: "Renovation can leave dust and marks in easily overlooked places. Attention to finishing details helps prepare the renovated space for its next use.", scope: ["Post-renovation dust removal", "Fixtures and glass detailing", "Finishing surface clean"] },
  { title: "Property Transition Service", service: "Move-In / Move-Out Cleaning", type: "Residential property transition", image: null, alt: "Cleaning supplies arranged in a bucket", description: "A thorough property transition clean helps prepare a home for an incoming occupant or leave it presentable after a tenancy ends.", scope: ["Frequently used spaces", "Floors and accessible surfaces", "Property handover preparation"] },
  { title: "Detailed Property Cleaning", service: "Deep Cleaning", type: "Residential or commercial property", image: windowAsset.url, alt: "Gloved hands detailing glass with a spray and cloth", description: "When routine cleaning is not enough, a detailed clean gives extra attention to corners, surfaces, fixtures and frequently used spaces.", scope: ["Corners and finishing details", "Fixtures and surface care", "Glass and window cleaning"] },
  { title: "Property Fumigation", service: "Fumigation Services", type: "Residential or commercial property", image: mopAsset.url, alt: "Mop in a bucket of soapy water, illustrating general property care, not pest treatment", description: "Where pest treatment is required, fumigation can form part of a property's preparation plan, based on the specific needs of the premises.", scope: ["Review of identified pest concerns", "Property-specific treatment planning", "Preparation and re-entry guidance"] },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-4">Skip to content</a>
      <header className="absolute inset-x-0 top-0 z-10">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 text-primary-foreground md:px-6">
          <a href="#" className="font-display text-2xl font-semibold">MsTidy<span className="text-brass">.</span></a>
          <div className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#services" className="hover:text-brass">Services</a>
            <a href="#process" className="hover:text-brass">Process</a>
            <a href="#about" className="hover:text-brass">About</a>
            <a href="#portfolio" className="hover:text-brass">Portfolio</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+2348141282602" className="hidden items-center gap-2 text-xs lg:flex"><Phone className="size-4" />+234 814 128 2602</a>
            <Button asChild className="hidden bg-accent text-accent-foreground hover:bg-accent/90 md:inline-flex"><a href="#quote">Request a quote</a></Button>
            <Button variant="ghost" size="icon" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </nav>
        {menuOpen && <nav id="mobile-menu" aria-label="Mobile navigation" className="mx-5 grid gap-4 rounded-sm bg-card p-6 text-foreground md:hidden">{[['services','Services'],['process','Process'],['about','About'],['portfolio','Portfolio'],['quote','Request a quote']].map(([id,label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}<a href="tel:+2348141282602">+234 814 128 2602</a></nav>}
      </header>

      <main id="main">
      <section className="relative flex min-h-[min(760px,88svh)] items-end overflow-hidden pt-36">
        <img src={hero} alt="Spotless newly finished living room" width={1600} height={1104} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 text-primary-foreground md:px-6 md:pb-16">
          <p className="mb-4 text-xs font-semibold uppercase text-brass">Post-Construction & Property Turnover Specialists</p>
          <h1 className="text-6xl leading-tight md:text-7xl">MsTidy<span className="text-brass">.</span></h1>
          <p className="mt-4 max-w-3xl font-display text-3xl leading-tight md:text-5xl">From construction dust to <em className="text-brass">move-in ready.</em></p>
          <p className="mt-5 max-w-xl text-base opacity-90 md:text-lg">Premium cleaning for newly built, renovated and transitioning properties across FCT, Abuja.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90"><a href="#quote">Request a free quote<ArrowUpRight /></a></Button>
            <Button asChild size="lg" variant="ghost" className="h-12 border border-primary-foreground/40"><a href="#services">Our services</a></Button>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl text-4xl md:text-5xl">Specialist cleaning for every property transition.</h2>
          <p className="max-w-sm text-muted-foreground">Homeowners, developers, contractors and businesses trust MsTidy to prepare spaces for occupancy.</p>
        </div>
        <div className="grid border-t border-border md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.n} className="group border-b border-border p-8 transition-colors hover:bg-card md:[&:nth-child(odd)]:border-r lg:border-r">
              <span className="font-display text-brass">{s.n}</span>
              <h3 className="mt-6 break-words text-2xl">{s.t}</h3>
              <p className="mt-3 text-muted-foreground">{s.d}</p>
            </article>
          ))}
          <a href="#quote" className="flex flex-col justify-between bg-primary p-8 text-primary-foreground">
            <span className="text-sm uppercase tracking-widest text-brass">Not sure what you need?</span>
            <span className="mt-10 font-display text-3xl">Talk to us &rarr;</span>
          </a>
        </div>
      </section>

      <section id="about" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 md:grid-cols-2">
          <figure><img src={work} alt="Illustrative image of a cleaner detailing a window" loading="lazy" width={1200} height={1408} className="aspect-[4/5] w-full rounded-sm object-cover" /><figcaption className="mt-2 text-xs opacity-70">Illustrative image</figcaption></figure>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">About MsTidy</p>
            <h2 className="mt-5 text-4xl md:text-5xl">Detail is the whole job.</h2>
            <p className="mt-6 text-lg opacity-85">MsTidy is a premium property cleaning company specializing in post-construction, post-renovation, and property transition cleaning services. We help homeowners and businesses prepare newly built, renovated, and transitioning properties for occupancy through detailed cleaning, deep cleaning, and fumigation services. Our commitment to professionalism, reliability, quality, and attention to detail ensures clean, hygienic, refreshed, and move-in-ready spaces.</p>
            <ul className="mt-10 grid grid-cols-2 gap-6">
              {["Professionalism", "Reliability", "Quality", "Attention to detail"].map((v) => (
                <li key={v} className="border-l-2 border-brass pl-4 font-display text-xl">{v}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-6 py-28">
        <h2 className="text-4xl md:text-5xl">How it works</h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t}>
              <span className="font-display text-6xl text-brass">{i + 1}</span>
              <h3 className="mt-4 text-xl">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="portfolio" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
           <p className="text-xs font-semibold uppercase text-muted-foreground">How we help</p>
           <h2 className="mt-4 text-4xl md:text-5xl">Our Services in Action</h2>
           <p className="mt-5 max-w-2xl text-muted-foreground">Five example scopes for preparing your property for its next chapter. These are illustrative service highlights, not completed MsTidy projects or customer testimonials. Photos illustrate spaces and general cleaning, not verified project results.</p>
           <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
             {highlights.map((p, i) => (
               <article key={p.title} className="min-w-0 border-b border-border pb-8">
                 {p.image ? (
                  <figure>
                    <img src={p.image} alt={p.alt} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                    <figcaption className="mt-3 text-xs text-muted-foreground">{i === 4 ? "Illustrative cleaning photo · Not a fumigation procedure" : "Illustrative image · Not a verified MsTidy project"}</figcaption>
                  </figure>
                ) : (
                  <div className="flex aspect-[3/2] w-full flex-col justify-end border border-border bg-secondary p-6">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Illustrative service highlight</p>
                    <p className="mt-2 font-display text-2xl leading-tight">{p.service}</p>
                  </div>
                )}
                 <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
                   <span className="font-display text-3xl text-brass">{String(i + 1).padStart(2, "0")}</span>
                   <div className="min-w-0">
                     <p className="text-xs font-semibold uppercase text-muted-foreground">{p.service}</p>
                     <h3 className="mt-2 break-words text-3xl">{p.title}</h3>
                     <p className="mt-3 text-sm text-muted-foreground">{p.type}</p>
                   </div>
                 </div>
                 <p className="mt-5 leading-relaxed text-muted-foreground">{p.description}</p>
                 <p className="mt-6 text-xs font-semibold uppercase">Example scope</p>
                 <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">{p.scope.map(item => <li key={item} className="border-l-2 border-brass pl-3">{item}</li>)}</ul>
                 <Button asChild variant="link" className="mt-5 h-auto p-0"><a href="#quote">Discuss a similar property<ArrowUpRight className="size-4" /></a></Button>
               </article>
             ))}
           </div>
        </div>
      </section>
      <section id="quote" className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 md:grid-cols-2">
          <div>
            <h2 className="text-4xl md:text-5xl">Request a free quote.</h2>
            <p className="mt-5 max-w-md text-muted-foreground">Share a few details about your property and we'll get back to you with a tailored plan.</p>
            <address className="mt-10 grid gap-5 text-sm not-italic">
              <a href="tel:+2348141282602" className="flex items-center gap-3"><Phone className="size-5" />+234 814 128 2602</a>
              <a href="https://wa.me/2348141282602" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">WhatsApp MsTidy<ArrowUpRight className="size-4" /></a>
              <a href="mailto:mstidycs@gmail.com" className="flex items-center gap-3"><Mail className="size-5" />mstidycs@gmail.com</a>
              <p className="flex items-start gap-3"><MapPin className="size-5 shrink-0" />Federal Capital Territory (FCT), Abuja, Nigeria</p>
            </address>
            <p className="mt-8 max-w-md text-sm text-muted-foreground">Serving residential and commercial clients across FCT, Abuja.</p>
            <p className="mt-4 text-sm text-muted-foreground">Social media: @MsTidy</p>
          </div>
          <QuoteForm />
        </div>
      </section>
      </main>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-10 text-sm md:flex-row">
          <span className="font-display text-xl">MsTidy<span className="text-brass">.</span></span>
          <span className="opacity-70">© {new Date().getFullYear()} MsTidy. Post-Construction & Property Turnover Specialists.</span>
        </div>
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-center justify-between gap-3 border-t border-border bg-card px-5 md:hidden"><Button asChild variant="ghost"><a href="tel:+2348141282602"><Phone />Call MsTidy</a></Button><Button asChild><a href="#quote">Request a quote<ArrowUpRight /></a></Button></div>
    </div>
  );
}
