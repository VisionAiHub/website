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
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ContactForm } from '@/components/ContactForm';
import { routing, type Locale } from '@/i18n/routing';

const SERVICE_SLUGS = [
  'enterprise-knowledge-assistants',
  'information-extraction',
  'agent-automation',
  'multi-modal-ai',
  'customer-support',
  'privacy-compliant',
] as const;

const serviceIcons: Record<string, React.ReactNode> = {
  'enterprise-knowledge-assistants': <Bot className="h-6 w-6" />,
  'information-extraction': <FileSearch className="h-6 w-6" />,
  'agent-automation': <Workflow className="h-6 w-6" />,
  'multi-modal-ai': <Layers className="h-6 w-6" />,
  'customer-support': <MessagesSquare className="h-6 w-6" />,
  'privacy-compliant': <ShieldCheck className="h-6 w-6" />,
};

const WHY_KEYS = ['tailored', 'integration', 'expertise', 'compliance', 'kpis', 'agile'] as const;
const whyIcons = [Wrench, Zap, Brain, BadgeCheck, LineChart, Rocket];

const INDUSTRY_SLUGS = [
  'it',
  'legal-compliance',
  'finance',
  'marketing',
  'logistics',
  'manufacturing',
  'ecommerce',
] as const;

const TOOLS = ['OpenAI', 'Gemini', 'LLaMA', 'Anthropic', 'Mistral', 'Hugging Face'];

const OFFER_KEYS = ['strategy', 'data', 'dev', 'ops'] as const;
const offeringIcons = [Brain, Database, Code2, Activity];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const tHero = await getTranslations('hero');
  const tServices = await getTranslations('services');
  const tRibbon = await getTranslations('ribbon');
  const tAbout = await getTranslations('about');
  const tWhy = await getTranslations('why');
  const tIndustries = await getTranslations('industries');
  const tTools = await getTranslations('tools');
  const tOffer = await getTranslations('offer');
  const tContact = await getTranslations('contact');

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
        <div className="container-page relative py-12 lg:py-16 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="eyebrow">{tHero('eyebrow')}</p>
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-ink-50">
              <span className="text-brand-400">{tHero('titleHighlight')}</span>
              {tHero('titleRest')}
            </h1>
            <p className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-ink-50">
              {tHero('subtitle')}
            </p>
            <p className="mt-6 text-lg text-ink-200 max-w-xl">
              {tHero('bodyBefore')}
              <span className="text-brand-400 font-medium">{tHero('bodyHighlight')}</span>
              {tHero('bodyAfter')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-brand-300 transition-colors"
              >
                {tHero('primaryCta')}
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center justify-center rounded-full border-2 border-brand-400 bg-transparent px-7 py-3 text-sm font-semibold text-brand-400 hover:bg-brand-400/10 transition-colors"
              >
                {tHero('secondaryCta')}
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center">
            <Image
              src="/brand/hero.png"
              alt={tHero('robotAlt')}
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
            <p className="eyebrow">{tServices('eyebrow')}</p>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-ink-50">
              {tServices('heading')}
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_SLUGS.map((slug) => (
              <div
                key={slug}
                className="group overflow-hidden rounded-xl border border-ink-700 bg-ink-800/60 hover:border-brand-400/60 hover:bg-ink-800 transition-all"
              >
                <div className="relative aspect-[2/1] overflow-hidden">
                  <Image
                    src={`/services/${slug}.jpg`}
                    alt={tServices(`items.${slug}.title`)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg bg-brand-400 text-ink-900 shadow-lg">
                    {serviceIcons[slug]}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-ink-50">
                    {tServices(`items.${slug}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">
                    {tServices(`items.${slug}.summary`)}
                  </p>
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
                <p className="eyebrow">{tRibbon('eyebrow')}</p>
                <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-50">
                  {tRibbon('titleStart')}
                  <span className="text-brand-400">{tRibbon('titleHighlight')}</span>
                </h3>
                <p className="mt-3 text-ink-300">{tRibbon('body')}</p>
              </div>
              <div className="flex flex-wrap gap-3 lg:flex-nowrap lg:flex-shrink-0">
                <Link href="/#contact" className="btn-primary">
                  {tRibbon('primaryCta')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/#offer" className="btn-secondary">
                  {tRibbon('secondaryCta')}
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
            <p className="eyebrow">{tAbout('eyebrow')}</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-ink-50">
              {tAbout('heading')} <span className="text-brand-400">{tAbout('headingHighlight')}</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-5 text-ink-200 leading-relaxed">
              <p>{tAbout('p1')}</p>
              <p>{tAbout('p2')}</p>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="card text-center">
                  <div className="text-4xl font-bold text-brand-400">
                    {tAbout('stats.years.value')}
                  </div>
                  <div className="mt-2 text-sm text-ink-300">{tAbout('stats.years.label')}</div>
                </div>
                <div className="card text-center">
                  <div className="text-4xl font-bold text-brand-400">
                    {tAbout('stats.projects.value')}
                  </div>
                  <div className="mt-2 text-sm text-ink-300">{tAbout('stats.projects.label')}</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-400 to-brand-500 p-10 text-ink-900 shadow-xl shadow-brand-400/10">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-900/70">
                {tAbout('mission.eyebrow')}
              </p>
              <h3 className="mt-3 text-2xl font-bold">{tAbout('mission.title')}</h3>
              <p className="mt-4 text-ink-900/80 leading-relaxed">{tAbout('mission.body')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section bg-ink-900">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-50">
              {tWhy('heading')} <span className="text-brand-400">{tWhy('headingHighlight')}</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHY_KEYS.map((key, i) => {
              const Icon = whyIcons[i] ?? BadgeCheck;
              return (
                <div key={key} className="card hover:border-brand-400/60 transition-colors">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-400 text-ink-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-ink-50">{tWhy(`items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">
                    {tWhy(`items.${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Industries */}
          <div className="mt-20 text-center">
            <h3 className="text-xl font-semibold text-ink-50">{tIndustries('heading')}</h3>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {INDUSTRY_SLUGS.map((slug) => (
                <span
                  key={slug}
                  className="rounded-full border border-ink-700 bg-ink-800 px-5 py-2 text-sm text-ink-100"
                >
                  {tIndustries(`items.${slug}`)}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-ink-50">{tTools('heading')}</h3>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {TOOLS.map((t) => (
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
            <p className="eyebrow">{tOffer('eyebrow')}</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-ink-50">
              {tOffer('heading')} <span className="text-brand-400">{tOffer('headingHighlight')}</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {OFFER_KEYS.map((key, i) => {
              const Icon = offeringIcons[i] ?? Wrench;
              const items = tOffer.raw(`items.${key}.list`) as string[];
              return (
                <div key={key} className="card flex flex-col">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-400 text-ink-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-ink-50">{tOffer(`items.${key}.title`)}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-ink-300">
                    {items.map((item) => (
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
              {tContact('heading')}{' '}
              <span className="text-brand-400">{tContact('headingHighlight')}</span>
            </h2>
            <p className="mt-3 text-ink-300">{tContact('subtitle')}</p>
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <ContactForm locale={locale as Locale} />
          </div>
        </div>
      </section>
    </>
  );
}
