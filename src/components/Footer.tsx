import Link from 'next/link';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="container-page py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-400 text-ink-900 font-bold">V</span>
            <span className="text-lg font-bold text-ink-50">{site.name}</span>
          </div>
          <p className="mt-4 text-sm font-semibold text-brand-400">
            {site.name} – {site.legalTagline}
          </p>
          <p className="mt-3 text-sm text-ink-300 max-w-sm">{site.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-50">Locations</h4>
          <p className="mt-3 text-sm text-ink-300">{site.locations.join(', ')}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-50">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="text-ink-300 hover:text-brand-400">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-ink-300 hover:text-brand-400"
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
