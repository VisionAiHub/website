import Image from 'next/image';
import { Mail, MapPin, Linkedin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { site } from '@/lib/site';

export async function Footer() {
  const t = await getTranslations('footer');
  const tSite = await getTranslations('site');
  const tLang = await getTranslations('languageSwitcher');
  void tLang;

  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="container-page py-16 grid gap-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="VisionAiHub"
              width={56}
              height={56}
              className="h-12 w-12 object-contain"
            />
            <span className="leading-tight">
              <span className="block text-xl font-extrabold tracking-tight text-ink-50">
                {site.name}
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
                {tSite('tagline')}
              </span>
            </span>
          </div>
          <p className="mt-6 text-base font-semibold text-brand-400">
            {site.name} – {tSite('legalTagline')}
          </p>
          <p className="mt-3 text-sm text-ink-300 leading-relaxed">{tSite('description')}</p>
        </div>

        <div className="lg:pl-12">
          <h4 className="text-base font-semibold text-brand-400">{t('aboutHeading')}</h4>
          <ul className="mt-5 space-y-4 text-sm text-ink-200">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
              <span>{site.locations.join(', ')}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
              <a href={`mailto:${site.email}`} className="hover:text-brand-400 underline">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Linkedin className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-400"
              >
                {t('linkedin')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-page py-6 text-xs text-ink-400 flex flex-col md:flex-row md:justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {site.name}. {t('rights')}
          </span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-brand-400">
              {t('privacy')}
            </Link>
            <Link href="/impressum" className="hover:text-brand-400">
              {t('legal')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
