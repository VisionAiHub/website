import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bot,
  FileSearch,
  Workflow,
  Layers,
  MessagesSquare,
  ShieldCheck,
  Wrench,
  Zap,
  Brain,
  BadgeCheck,
  LineChart,
  Rocket,
  Database,
  Code2,
  Activity,
} from 'lucide-react';
import { services, industries, whyChoose, offerings, tools, stats } from '@/lib/content';
import { site } from '@/lib/site';

const serviceIcons: Record<string, React.ReactNode> = {
  'enterprise-knowledge-assistants': <Bot className="h-6 w-6" />,
  'information-extraction': <FileSearch className="h-6 w-6" />,
  'agent-automation': <Workflow className="h-6 w-6" />,
  'multi-modal-ai': <Layers className="h-6 w-6" />,
  'customer-support': <MessagesSquare className="h-6 w-6" />,
  'privacy-compliant': <ShieldCheck className="h-6 w-6" />,
};

const whyIcons = [Wrench, Zap, Brain, BadgeCheck, LineChart, Rocket];

const offeringIcons = [Brain, Database, Code2, Activity];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 75% 30%, rgba(251,191,36,0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(37,99,235,0.18), transparent 50%)',
          }}
        />
        <div className="container-page relative py-24 lg:py-32 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="eyebrow">{site.tagline}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-ink-50">
              <span className="text-brand-400">Empower your team</span> with AI agents
            </h1>
            <p className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-ink-50">
              Tailored to your business
            </p>
            <p className="mt-6 text-lg text-ink-200 max-w-xl">
              We develop intelligent, scalable, and customized AI solutions that{' '}
              <span className="text-brand-400 font-medium">automate your work, ensure data privacy</span>
              , and help you stay one step ahead in a rapidly changing world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-brand-300 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-full border-2 border-brand-400 bg-transparent px-7 py-3 text-sm font-semibold text-brand-400 hover:bg-brand-400/10 transition-colors"
              >
                Discover Our Services
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center">
            <Image
              src="/brand/hero.png"
              alt="AI agent illustration"
              width={560}
              height={560}
              priority
              className="drop-shadow-[0_0_60px_rgba(251,191,36,0.15)]"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section bg-ink-900 scroll-mt-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto">
            <p className="eyebrow">AI solutions that deliver real value to your business</p>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-ink-50">
              Your Trusted Partner for AI Solutions and Business Automation
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.slug}
                className="group overflow-hidden rounded-xl border border-ink-700 bg-ink-800/60 hover:border-brand-400/60 hover:bg-ink-800 transition-all"
              >
                <div className="relative aspect-[2/1] overflow-hidden">
                  <Image
                    src={`/services/${s.slug}.jpg`}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg bg-brand-400 text-ink-900 shadow-lg">
                    {serviceIcons[s.slug]}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-ink-50">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">{s.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA ribbon */}
      <section className="bg-ink-900 pb-16 lg:pb-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl border border-brand-400/30 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-800 px-6 py-10 sm:px-12 sm:py-12">
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 90% 20%, rgba(251,191,36,0.18), transparent 55%)',
              }}
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow">Not sure which fits?</p>
                <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-50">
                  Curious which of these will move the needle for{' '}
                  <span className="text-brand-400">your business?</span>
                </h3>
                <p className="mt-3 text-ink-300">
                  Book a free 30-minute call. No slides — just a conversation about your highest-ROI
                  AI opportunities.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:flex-nowrap lg:flex-shrink-0">
                <Link href="#contact" className="btn-primary">
                  Get in touch <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="#offer" className="btn-secondary">
                  See what we offer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section bg-ink-950 scroll-mt-20">
        <div className="container-page">
          <div className="text-center">
            <p className="eyebrow">About</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-ink-50">
              About <span className="text-brand-400">VisionAiHub</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-5 text-ink-200 leading-relaxed">
              <p>
                VisionAiHub is a leading AI consulting company with over seven years of experience
                in successfully developing and implementing scalable AI solutions. Our goal is to
                give businesses efficient and practical access to the opportunities of modern AI –
                especially intelligent assistant systems.
              </p>
              <p>
                We focus not on technologies, but on measurable results and real business value.
                Over the past seven years, we&apos;ve helped numerous companies – from SMEs to
                global corporations – integrate AI in meaningful ways and create sustainable value.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-2">
                {stats.map((s) => (
                  <div key={s.label} className="card text-center">
                    <div className="text-4xl font-bold text-brand-400">{s.value}</div>
                    <div className="mt-2 text-sm text-ink-300">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-400 to-brand-500 p-10 text-ink-900 shadow-xl shadow-brand-400/10">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-900/70">Our Mission</p>
              <h3 className="mt-3 text-2xl font-bold">
                Empower teams with smart AI assistants and elevate your processes to the next level.
              </h3>
              <p className="mt-4 text-ink-900/80 leading-relaxed">
                We believe that AI should be accessible, practical, and transformative for every
                business, regardless of size or industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section bg-ink-900">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-50">
              Why Choose <span className="text-brand-400">VisionAiHub?</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((w, i) => {
              const Icon = whyIcons[i] ?? BadgeCheck;
              return (
                <div key={w.title} className="card hover:border-brand-400/60 transition-colors">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-400 text-ink-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-ink-50">{w.title}</h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">{w.description}</p>
                </div>
              );
            })}
          </div>

          {/* Industries */}
          <div className="mt-20 text-center">
            <h3 className="text-xl font-semibold text-ink-50">Industries We&apos;ve Served</h3>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {industries.map((i) => (
                <span
                  key={i.slug}
                  className="rounded-full border border-ink-700 bg-ink-800 px-5 py-2 text-sm text-ink-100"
                >
                  {i.title}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-ink-50">Tools We Use</h3>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {tools.map((t) => (
                <div
                  key={t}
                  className="rounded-lg border border-ink-700 bg-ink-800 px-4 py-4 text-center text-sm font-medium text-ink-100"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section id="offer" className="section bg-ink-950 scroll-mt-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto">
            <p className="eyebrow">End-to-End AI Solution Development</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-ink-50">
              What We <span className="text-brand-400">Offer</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {offerings.map((o, i) => {
              const Icon = offeringIcons[i] ?? Wrench;
              return (
                <div key={o.title} className="card flex flex-col">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-400 text-ink-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-ink-50">{o.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-ink-300">
                    {o.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-brand-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section bg-ink-900 scroll-mt-20">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-50">
              Get In <span className="text-brand-400">Touch</span>
            </h2>
            <p className="mt-3 text-ink-300">
              Ready to transform your business with AI? Let&apos;s talk.
            </p>
          </div>

          <div className="mt-12 max-w-2xl mx-auto card">
            <h3 className="text-lg font-semibold text-ink-50">Send us a message</h3>
            <p className="mt-1 text-sm text-ink-300">
              Tell us about your project and we&apos;ll get back to you promptly
            </p>
            <form
              className="mt-6 grid gap-4"
              action={`mailto:${site.email}`}
              method="post"
              encType="text/plain"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                />
              </div>
              <input
                type="text"
                name="company"
                placeholder="Company"
                className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
              />
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us about your project"
                className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
              />
              <button type="submit" className="btn-primary mt-2 self-start">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
