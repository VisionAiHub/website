'use server';

import { Resend } from 'resend';

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const FROM = 'VisionAiHub Website <noreply@visionaihub.com>';

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const honeypot = String(formData.get('website') ?? '').trim();

  // Honeypot field — real visitors don't fill it; bots usually do.
  if (honeypot) return { status: 'success' };

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in name, email, and message.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'That email address looks invalid.' };
  }
  if (message.length > 5000) {
    return { status: 'error', message: 'Message is too long (max 5000 characters).' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'contact@visionaihub.com';
  if (!apiKey) {
    console.error('RESEND_API_KEY missing');
    return { status: 'error', message: 'Server is not configured to send email yet.' };
  }

  const resend = new Resend(apiKey);
  const subject = `New inquiry from ${name}${company ? ` (${company})` : ''}`;

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    '',
    'Message:',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px;">
      <h2 style="margin: 0 0 16px; color: #131c36;">New inquiry from visionaihub.com</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 6px 12px 6px 0; color: #6b7898;">Name</td><td style="padding: 6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding: 6px 12px 6px 0; color: #6b7898;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${company ? `<tr><td style="padding: 6px 12px 6px 0; color: #6b7898;">Company</td><td style="padding: 6px 0;">${escapeHtml(company)}</td></tr>` : ''}
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
      return { status: 'error', message: 'Sending failed. Please email us directly.' };
    }
    return { status: 'success' };
  } catch (err) {
    console.error('Resend exception:', err);
    return { status: 'error', message: 'Sending failed. Please email us directly.' };
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
