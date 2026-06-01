'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY > 600;
      const contact = document.getElementById('contact');
      const contactInView = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setVisible(scrolled && !contactInView);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <a
      href="#contact"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-3 text-sm font-semibold text-ink-900 shadow-xl shadow-brand-400/20 ring-1 ring-brand-300/40 transition-all duration-300 hover:bg-brand-300 ${
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'
      }`}
    >
      <Calendar className="h-4 w-4" />
      {t('floatingCta')}
    </a>
  );
}
