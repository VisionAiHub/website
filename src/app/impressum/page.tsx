import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Legal notice for VisionAiHub GmbH.',
};

export default function ImpressumPage() {
  return (
    <article className="container-page py-20 lg:py-24 max-w-3xl">
      <h1 className="text-4xl font-bold text-ink-50">Impressum</h1>

      <div className="mt-10 space-y-6 text-ink-200 leading-relaxed">
        <p>Service provider within the meaning of § 5 TMG:</p>

        <div className="card">
          <p className="font-semibold text-ink-50">VisionAiHub GmbH</p>
          <p>Mergenthalerallee 73-75</p>
          <p>65760 Eschborn</p>
          <p>Germany</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">Contact</h2>
          <p className="mt-2">Phone: +49-17687991987</p>
          <p>
            Email:{' '}
            <a
              href="mailto:contact@visionaihub.com"
              className="text-brand-400 hover:underline"
            >
              contact@visionaihub.com
            </a>
          </p>
          <p>
            Website:{' '}
            <a href="https://www.visionaihub.com" className="text-brand-400 hover:underline">
              www.visionaihub.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">Vertretungsberechtigter Geschäftsführer</h2>
          <p className="mt-2">Yash Shah</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">Registereintrag</h2>
          <p className="mt-2">Eingetragen im Handelsregister</p>
          <p>Registergericht: Amtsgericht Frankfurt am Main</p>
          <p>Registernummer: HRB 141831</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">Umsatzsteuer-ID</h2>
          <p className="mt-2">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE460919226
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-50">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p className="mt-2">Yash Shah</p>
          <p>Mergenthalerallee 73-75, 65760 Eschborn</p>
        </div>
      </div>
    </article>
  );
}
