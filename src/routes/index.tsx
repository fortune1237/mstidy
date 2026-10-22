import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import hero from "@/assets/hero.jpg";
import work from "@/assets/work.jpg";

const TITLE = "MsTidy — Post-Construction & Property Turnover Cleaning";
const DESC =
  "Premium post-construction, post-renovation, move-in/move-out, deep cleaning and fumigation for homes and businesses.";

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
  { n: "03", t: "Move-In / Move-Out", d: "Property transition cleaning that leaves homes and offices fresh for the next occupant." },
  { n: "04", t: "Deep Cleaning", d: "Top-to-bottom, inside-and-out cleaning for residential and commercial properties." },
  { n: "05", t: "Fumigation", d: "Pest control treatment to deliver a hygienic, safe, and refreshed space." },
];

const steps = [
  ["Request a quote", "Tell us about the property, its size and condition."],
  ["Site assessment", "We review the scope and agree a plan and timeline."],
  ["Meticulous clean", "Our team cleans, details and fumigates as required."],
  ["Move-in ready", "A final walkthrough so the space is ready for occupancy."],
];

function Index() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-primary-foreground">
          <a href="#" className="font-display text-2xl font-semibold">MsTidy<span className="text-brass">.</span></a>
          <div className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#services" className="hover:text-brass">Services</a>
            <a href="#process" className="hover:text-brass">Process</a>
            <a href="#about" className="hover:text-brass">About</a>
          </div>
          <a href="#quote" className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90">Get a quote</a>
        </nav>
      </header>

      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img src={hero} alt="Spotless newly finished living room" width={1600} height={1104} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 text-primary-foreground">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-brass">Post-Construction & Property Turnover Specialists</p>
          <h1 className="max-w-4xl text-5xl leading-[1.05] md:text-7xl">From construction dust to <em className="text-brass">move-in ready.</em></h1>
          <p className="mt-6 max-w-xl text-lg opacity-90">Premium cleaning for newly built, renovated and transitioning properties — meticulous, reliable and hygienic.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#quote" className="rounded-sm bg-accent px-7 py-3.5 font-semibold text-accent-foreground hover:opacity-90">Request a free quote</a>
            <a href="#services" className="rounded-sm border border-primary-foreground/40 px-7 py-3.5 font-semibold hover:bg-primary-foreground/10">Our services</a>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl text-4xl md:text-5xl">Specialist cleaning for every property transition.</h2>
          <p className="max-w-sm text-muted-foreground">Homeowners, developers, contractors and businesses trust MsTidy to prepare spaces for occupancy.</p>
        </div>
        <div className="grid border-t border-border md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.n} className="group border-b border-border p-8 transition-colors hover:bg-card md:[&:nth-child(odd)]:border-r lg:border-r">
              <span className="font-display text-brass">{s.n}</span>
              <h3 className="mt-6 text-2xl">{s.t}</h3>
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
          <img src={work} alt="MsTidy cleaner wiping a new window" loading="lazy" width={1200} height={1408} className="aspect-[4/5] w-full rounded-sm object-cover" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">About MsTidy</p>
            <h2 className="mt-5 text-4xl md:text-5xl">Detail is the whole job.</h2>
            <p className="mt-6 text-lg opacity-85">MsTidy is a premium property cleaning company specializing in post-construction, post-renovation, and property transition cleaning. We help homeowners and businesses prepare newly built, renovated and transitioning properties for occupancy through meticulous cleaning, deep cleaning and fumigation.</p>
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

      <section id="quote" className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 md:grid-cols-2">
          <div>
            <h2 className="text-4xl md:text-5xl">Request a free quote.</h2>
            <p className="mt-5 max-w-md text-muted-foreground">Share a few details about your property and we'll get back to you with a tailored plan.</p>
          </div>
          {sent ? (
            <div className="rounded-sm bg-card p-10">
              <h3 className="text-2xl">Thank you!</h3>
              <p className="mt-3 text-muted-foreground">We've received your request and will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 rounded-sm bg-card p-8">
              {[["name", "Full name", "text"], ["phone", "Phone number", "tel"], ["email", "Email", "email"]].map(([n, l, t]) => (
                <label key={n} className="grid gap-1.5 text-sm font-medium">{l}
                  <input required name={n} type={t} className="rounded-sm border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
                </label>
              ))}
              <label className="grid gap-1.5 text-sm font-medium">Service
                <select name="service" className="rounded-sm border border-input bg-background px-4 py-3">
                  {services.map((s) => <option key={s.n}>{s.t}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">Property details
                <textarea name="details" rows={4} className="rounded-sm border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
              </label>
              <button className="mt-2 rounded-sm bg-primary px-6 py-3.5 font-semibold text-primary-foreground hover:opacity-90">Send request</button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-10 text-sm md:flex-row">
          <span className="font-display text-xl">MsTidy<span className="text-brass">.</span></span>
          <span className="opacity-70">© {new Date().getFullYear()} MsTidy. Post-Construction & Property Turnover Specialists.</span>
        </div>
      </footer>
    </div>
  );
}
