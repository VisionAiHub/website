import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Linkedin } from 'lucide-react';
import { site } from '@/lib/site';

export function Footer() {
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
              <span className="block text-xl font-bold text-ink-50">{site.name}</span>
              <span className="block text-xs uppercase tracking-[0.18em] text-brand-400">
                {site.tagline}
              </span>
            </span>
          </div>
          <p className="mt-6 text-base font-semibold text-brand-400">
            {site.name} – {site.legalTagline}
          </p>
          <p className="mt-3 text-sm text-ink-300 leading-relaxed">{site.description}</p>
        </div>

        <div className="lg:pl-12">
          <h4 className="text-base font-semibold text-brand-400">About Us</h4>
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
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-page py-6 text-xs text-ink-400 flex flex-col md:flex-row md:justify-between gap-2">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-brand-400">Privacy Policy</Link>
            <Link href="/impressum" className="hover:text-brand-400">Legal Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
