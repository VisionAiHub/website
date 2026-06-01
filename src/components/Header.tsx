'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { site } from '@/lib/site';

const NAV_KEYS = ['services', 'about', 'offer', 'contact'] as const;
const NAV_TARGETS: Record<(typeof NAV_KEYS)[number], string> = {
  services: '/#services',
  about: '/#about',
  offer: '/#offer',
  contact: '/#contact',
};

export function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('nav');
  const tLang = useTranslations('languageSwitcher');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-800 bg-ink-900/85 backdrop-blur">
      <div className="container-page flex h-24 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="VisionAiHub"
            width={72}
            height={72}
            priority
            className="h-14 w-14 object-contain"
          />
          <span className="leading-tight">
            <span className="block text-2xl font-extrabold tracking-tight text-ink-50">
              {site.name}
            </span>
            <span className="block text-sm font-medium text-ink-200">Innovative AI Solutions</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={NAV_TARGETS[key]}
              className="text-base font-medium text-ink-100 hover:text-brand-400 transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div
            className="flex items-center rounded-full border border-ink-700 bg-ink-800/60 p-1"
            role="group"
            aria-label={tLang('label')}
          >
            {routing.locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                aria-current={l === locale ? 'true' : undefined}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  l === locale
                    ? 'bg-brand-400 text-ink-900'
                    : 'text-ink-200 hover:text-brand-400'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full bg-brand-400 px-6 py-3 text-sm font-semibold text-ink-900 hover:bg-brand-300 transition-colors"
          >
            {t('cta')}
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-ink-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-800 bg-ink-900">
          <nav className="container-page flex flex-col py-4">
            {NAV_KEYS.map((key) => (
              <Link
                key={key}
                href={NAV_TARGETS[key]}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-ink-100"
              >
                {t(key)}
              </Link>
            ))}
            <div
              className="mt-3 flex items-center gap-2 self-start rounded-full border border-ink-700 bg-ink-800/60 p-1"
              role="group"
              aria-label={tLang('label')}
            >
              {routing.locales.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setOpen(false);
                    switchLocale(l);
                  }}
                  aria-current={l === locale ? 'true' : undefined}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    l === locale
                      ? 'bg-brand-400 text-ink-900'
                      : 'text-ink-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="/#contact"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-brand-400 px-6 py-3 text-sm font-semibold text-ink-900"
              onClick={() => setOpen(false)}
            >
              {t('cta')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
