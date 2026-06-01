'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { submitContact, type ContactFormState } from '@/app/actions/contact';
import type { Locale } from '@/i18n/routing';

const initialState: ContactFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('contact');
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary mt-2 self-start disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? t('submitting') : t('submit')}
    </button>
  );
}

export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations('contact');
  const [state, formAction] = useActionState(
    (prev: ContactFormState, formData: FormData) => submitContact(prev, formData, locale),
    initialState,
  );

  if (state.status === 'success') {
    return (
      <div className="card text-center">
        <h3 className="text-xl font-semibold text-ink-50">{t('successTitle')}</h3>
        <p className="mt-3 text-ink-300">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-ink-50">{t('formTitle')}</h3>
      <p className="mt-1 text-sm text-ink-300">{t('formSubtitle')}</p>

      <form action={formAction} className="mt-6 grid gap-4">
        {/* Honeypot — hidden from real users, bots fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            required
            placeholder={t('fields.name')}
            className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            required
            placeholder={t('fields.email')}
            className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
          />
        </div>
        <input
          type="text"
          name="company"
          placeholder={t('fields.company')}
          className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
        <textarea
          name="message"
          rows={5}
          required
          placeholder={t('fields.message')}
          className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />

        {state.status === 'error' && (
          <p className="text-sm text-red-400">{state.message}</p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
