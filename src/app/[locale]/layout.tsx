import type { Metadata } from 'next';
import { Questrial } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';
import { routing, type Locale } from '@/i18n/routing';
import { site } from '@/lib/site';

const questrial = Questrial({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-questrial',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t('title'),
      template: `%s | ${site.name}`,
    },
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('description'),
      url: `${site.url}/${locale}`,
      siteName: site.name,
      type: 'website',
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      alternateLocale: locale === 'de' ? ['en_US'] : ['de_DE'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('description'),
    },
    alternates: {
      canonical: `${site.url}/${locale}`,
      languages: {
        de: `${site.url}/de`,
        en: `${site.url}/en`,
        'x-default': `${site.url}/de`,
      },
    },
  };
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  vatID: site.registry.vatId,
  description: site.description,
  sameAs: [site.social.linkedin],
  contactPoint: {
    '@type': 'ContactPoint',
    email: site.email,
    telephone: site.phone,
    contactType: 'customer support',
    areaServed: 'DE',
    availableLanguage: ['English', 'German'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressCountry: site.address.country,
  },
  areaServed: site.locations.map((city) => ({
    '@type': 'City',
    name: city,
  })),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <html lang={locale} className={questrial.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCTA />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
