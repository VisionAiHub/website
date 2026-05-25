import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-bold text-ink-50">Page not found</h1>
        <p className="mt-3 text-ink-300">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary mt-8">Back to home</Link>
      </div>
    </section>
  );
}
