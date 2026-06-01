import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'impressum' });
  return { title: t('title') };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('impressum');

  return (
    <article className="container-page py-20 lg:py-24 max-w-3xl">
      <h1 className="text-4xl font-bold text-ink-50">{t('title')}</h1>

      <div className="mt-10 space-y-6 text-ink-200 leading-relaxed">
        <p>{t('intro')}</p>

        <div className="card">
          <p className="font-semibold text-ink-50">{t('company.name')}</p>
          <p>{t('company.street')}</p>
          <p>{t('company.city')}</p>
          <p>{t('company.country')}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">{t('contact.heading')}</h2>
          <p className="mt-2">{t('contact.phone')}</p>
          <p>
            {t('contact.emailLabel')}{' '}
            <a
              href="mailto:contact@visionaihub.com"
              className="text-brand-400 hover:underline"
            >
              contact@visionaihub.com
            </a>
          </p>
          <p>
            {t('contact.websiteLabel')}{' '}
            <a href="https://www.visionaihub.com" className="text-brand-400 hover:underline">
              www.visionaihub.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">{t('representative.heading')}</h2>
          <p className="mt-2">{t('representative.name')}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">{t('registry.heading')}</h2>
          <p className="mt-2">{t('registry.registered')}</p>
          <p>{t('registry.court')}</p>
          <p>{t('registry.number')}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">{t('vat.heading')}</h2>
          <p className="mt-2">{t('vat.body')}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">{t('responsible.heading')}</h2>
          <p className="mt-2">{t('responsible.name')}</p>
          <p>{t('responsible.address')}</p>
        </div>
      </div>
    </article>
  );
}
