'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { site } from '@/lib/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === '/';

  const linkHref = (href: string) => (onHome || !href.startsWith('#') ? href : `/${href}`);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-800 bg-ink-900/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="VisionAiHub"
            width={44}
            height={44}
            priority
            className="h-10 w-10 object-contain"
          />
          <span className="leading-tight">
            <span className="block text-base font-bold text-ink-50">{site.name}</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-brand-400">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={linkHref(item.href)}
              className="text-sm font-medium text-ink-100 hover:text-brand-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href={onHome ? '#contact' : '/#contact'} className="hidden md:inline-flex btn-primary !py-2 !px-4">
          Get in touch
        </Link>

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
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={linkHref(item.href)}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-ink-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={onHome ? '#contact' : '/#contact'}
              className="btn-primary mt-3 !py-2"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
