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
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return { title: t('title') };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('privacy');
  const websiteItems = t.raw('sections.website.items') as string[];
  const formItems = t.raw('sections.form.items') as string[];
  const sharingItems = t.raw('sections.sharing.items') as string[];
  const rightsItems = t.raw('sections.rights.items') as { label: string; body: string }[];

  return (
    <article className="container-page py-20 lg:py-24 max-w-3xl prose-custom">
      <h1 className="text-4xl font-bold text-ink-50">{t('title')}</h1>

      <div className="mt-10 space-y-6 text-ink-200 leading-relaxed">
        <p>{t('intro')}</p>

        <div className="card">
          <p className="font-semibold text-ink-50">{t('controller.name')}</p>
          <p>{t('controller.address')}</p>
          <p>{t('controller.managingDirector')}</p>
          <p>{t('controller.registry')}</p>
          <p>{t('controller.vat')}</p>
          <p className="mt-2">{t('controller.phone')}</p>
          <p>
            {t('controller.emailLabel')}{' '}
            <a
              href="mailto:contact@visionaihub.com"
              className="text-brand-400 hover:underline"
            >
              contact@visionaihub.com
            </a>
          </p>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">{t('sections.website.heading')}</h2>
          <p className="mt-3">{t('sections.website.intro')}</p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            {websiteItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="mt-3">
            <strong className="text-ink-50">{t('sections.website.purposeLabel')}</strong>{' '}
            {t('sections.website.purpose')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">{t('sections.form.heading')}</h2>
          <p className="mt-3">{t('sections.form.intro')}</p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            {formItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="mt-3">
            <strong className="text-ink-50">{t('sections.form.purposeLabel')}</strong>{' '}
            {t('sections.form.purpose')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">{t('sections.cookies.heading')}</h2>
          <p className="mt-3">{t('sections.cookies.intro')}</p>
          <p className="mt-3">
            <strong className="text-ink-50">{t('sections.cookies.purposeLabel')}</strong>{' '}
            {t('sections.cookies.purpose')}
          </p>
          <p className="mt-3">
            <strong className="text-ink-50">{t('sections.cookies.analyticsLabel')}</strong>{' '}
            {t('sections.cookies.analytics')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">{t('sections.sharing.heading')}</h2>
          <p className="mt-3">{t('sections.sharing.intro')}</p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            {sharingItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">{t('sections.rights.heading')}</h2>
          <p className="mt-3">{t('sections.rights.intro')}</p>
          <ul className="mt-3 list-disc pl-6 space-y-2">
            {rightsItems.map((item) => (
              <li key={item.label}>
                <strong className="text-ink-50">{item.label}</strong> {item.body}
              </li>
            ))}
          </ul>
          <p className="mt-3">{t('sections.rights.complaint')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">{t('sections.security.heading')}</h2>
          <p className="mt-3">{t('sections.security.body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">{t('sections.updates.heading')}</h2>
          <p className="mt-3">{t('sections.updates.body')}</p>
        </section>
      </div>
    </article>
  );
}
