'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact, type ContactFormState } from '@/app/actions/contact';

const initialState: ContactFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary mt-2 self-start disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Sending…' : 'Submit'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

  if (state.status === 'success') {
    return (
      <div className="card text-center">
        <h3 className="text-xl font-semibold text-ink-50">Thanks — message received.</h3>
        <p className="mt-3 text-ink-300">
          We&apos;ll get back to you at the email you provided, usually within one business day.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-ink-50">Send us a message</h3>
      <p className="mt-1 text-sm text-ink-300">
        Tell us about your project and we&apos;ll get back to you promptly
      </p>

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
            placeholder="Your name"
            className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
          />
        </div>
        <input
          type="text"
          name="company"
          placeholder="Company"
          className="rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us about your project"
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
