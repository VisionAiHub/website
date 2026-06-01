import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1 className="mt-3 text-4xl font-bold text-ink-50">{t('title')}</h1>
        <p className="mt-3 text-ink-300">{t('body')}</p>
        <Link href="/" className="btn-primary mt-8">{t('back')}</Link>
      </div>
    </section>
  );
}
