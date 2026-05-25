import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostSlugs } from '@/lib/blog';
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const file = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
  if (!fs.existsSync(file)) return { title: 'Post not found' };
  const { data } = matter(fs.readFileSync(file, 'utf8'));
  return {
    title: data.title,
    description: data.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const file = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
  if (!fs.existsSync(file)) notFound();

  const { data } = matter(fs.readFileSync(file, 'utf8'));
  const Post = (await import(`@/../content/blog/${slug}.mdx`)).default;

  return (
    <article className="section">
      <div className="container-page max-w-3xl">
        <p className="text-xs uppercase tracking-wider text-ink-400">{data.date}</p>
        <h1 className="mt-3 text-4xl font-bold text-ink-50">{data.title}</h1>
        {data.description && (
          <p className="mt-3 text-lg text-ink-300">{data.description}</p>
        )}
        <div className="mt-10 prose-ai">
          <Post />
        </div>
      </div>
    </article>
  );
}
