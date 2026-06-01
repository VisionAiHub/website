import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllPosts } from '@/lib/blog';
import { Link } from '@/i18n/navigation';
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
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('title'), description: t('description') };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('blog');
  const posts = getAllPosts();

  return (
    <>
      <section className="bg-ink-950">
        <div className="container-page py-20">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-ink-50">{t('heading')}</h1>
          <p className="mt-4 max-w-2xl text-ink-300">{t('subtitle')}</p>
        </div>
      </section>

      <section className="section bg-ink-900">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-ink-300">{t('empty')}</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block rounded-xl border border-ink-700 bg-ink-800/60 p-6 hover:border-brand-400/60 transition-colors"
                  >
                    <p className="text-xs uppercase tracking-wider text-ink-400">{p.date}</p>
                    <h2 className="mt-2 text-xl font-semibold text-ink-50">{p.title}</h2>
                    <p className="mt-2 text-sm text-ink-300">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
