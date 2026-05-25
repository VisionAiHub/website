import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights from VisionAiHub on Generative AI, agents, and applied ML.',
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="bg-ink-950">
        <div className="container-page py-20">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-ink-50">Insights & writing</h1>
          <p className="mt-4 max-w-2xl text-ink-300">
            Practical perspectives on shipping AI in production.
          </p>
        </div>
      </section>

      <section className="section bg-ink-900">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-ink-300">No posts yet — check back soon.</p>
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
