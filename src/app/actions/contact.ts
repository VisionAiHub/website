'use server';

import { Resend } from 'resend';
import { getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const FROM = 'VisionAiHub Website <noreply@visionaihub.com>';

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
  localeArg?: Locale,
): Promise<ContactFormState> {
  const locale: Locale = localeArg && routing.locales.includes(localeArg)
    ? localeArg
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'contact' });

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const honeypot = String(formData.get('website') ?? '').trim();

  // Honeypot field — real visitors don't fill it; bots usually do.
  if (honeypot) return { status: 'success' };

  if (!name || !email || !message) {
    return { status: 'error', message: t('errors.missingFields') };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: t('errors.invalidEmail') };
  }
  if (message.length > 5000) {
    return { status: 'error', message: t('errors.tooLong') };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'contact@visionaihub.com';
  if (!apiKey) {
    console.error('RESEND_API_KEY missing');
    return { status: 'error', message: t('errors.notConfigured') };
  }

  const resend = new Resend(apiKey);
  const subject = company
    ? t('email.subjectWithCompany', { name, company })
    : t('email.subject', { name });

  const labels = {
    name: t('email.name'),
    email: t('email.emailLabel'),
    company: t('email.company'),
  };

  const text = [
    `${labels.name}: ${name}`,
    `${labels.email}: ${email}`,
    company ? `${labels.company}: ${company}` : null,
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px;">
      <h2 style="margin: 0 0 16px; color: #131c36;">${escapeHtml(t('email.heading'))}</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 6px 12px 6px 0; color: #6b7898;">${labels.name}</td><td style="padding: 6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding: 6px 12px 6px 0; color: #6b7898;">${labels.email}</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${company ? `<tr><td style="padding: 6px 12px 6px 0; color: #6b7898;">${labels.company}</td><td style="padding: 6px 0;">${escapeHtml(company)}</td></tr>` : ''}
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #f3f5f9; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error('Resend error:', error);
      return { status: 'error', message: t('errors.sendFailed') };
    }
    return { status: 'success' };
  } catch (err) {
    console.error('Resend exception:', err);
    return { status: 'error', message: t('errors.sendFailed') };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
