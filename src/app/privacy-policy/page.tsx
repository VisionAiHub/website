import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for VisionAiHub under GDPR.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="container-page py-20 lg:py-24 max-w-3xl prose-custom">
      <h1 className="text-4xl font-bold text-ink-50">Privacy Policy</h1>

      <div className="mt-10 space-y-6 text-ink-200 leading-relaxed">
        <p>
          Responsible under the General Data Protection Regulation (GDPR) and other national data
          protection laws of member states as well as other data protection regulations is:
        </p>

        <div className="card">
          <p className="font-semibold text-ink-50">VisionAiHub GmbH</p>
          <p>Mergenthalerallee 73-75, 65760 Eschborn</p>
          <p>Represented by the Managing Director: Yash Shah</p>
          <p>Registered: Amtsgericht Frankfurt am Main, HRB 141831</p>
          <p>VAT ID: DE460919226</p>
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
        </div>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">a) When Visiting the Website</h2>
          <p className="mt-3">
            When you visit my website, the browser used on your device automatically sends
            information to the server of my website. This information is temporarily stored in a
            so-called log file. The following information is collected without your intervention
            and stored until automated deletion:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>IP address of the requesting computer,</li>
            <li>Date and time of access,</li>
            <li>Name and URL of the retrieved file,</li>
            <li>Website from which access is made (referrer URL),</li>
            <li>
              Browser used and, if applicable, the operating system of your computer, and the name
              of your access provider.
            </li>
          </ul>
          <p className="mt-3">
            <strong className="text-ink-50">Purpose:</strong> These data are collected for the
            purpose of ensuring a smooth connection setup of the website, ensuring comfortable use
            of our website, evaluating system security and stability, and for other administrative
            purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">b) When Using a Contact Form</h2>
          <p className="mt-3">
            If you use a contact form to reach out to me, I collect the following personal data:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Name, email address, and other contact details</li>
          </ul>
          <p className="mt-3">
            <strong className="text-ink-50">Purpose:</strong> This data collection is necessary to
            answer your questions and handle your inquiries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">c) Cookies</h2>
          <p className="mt-3">
            This website may use cookies. Cookies are small files that are automatically created by
            your browser and stored on your device (laptop, tablet, smartphone, etc.) when you
            visit our site. They do not damage your device and do not contain viruses, trojans, or
            other malware.
          </p>
          <p className="mt-3">
            <strong className="text-ink-50">Purpose:</strong> The use of cookies serves to make the
            use of my services more pleasant for you. Some cookies are necessary to run basic
            website functions, while others may be used for statistical or marketing purposes.
          </p>
          <p className="mt-3">
            <strong className="text-ink-50">Google Analytics:</strong> This website may use Google
            Analytics, a web analysis service of Google Inc. Google Analytics uses cookies. You can
            find more details in Google&apos;s Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">Data Sharing</h2>
          <p className="mt-3">
            Your personal data will not be transferred to third parties for purposes other than
            those listed above, unless:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>You have given your explicit consent,</li>
            <li>The transfer is necessary for the fulfillment of a contract,</li>
            <li>The transfer is legally required,</li>
            <li>
              The transfer is necessary for asserting, exercising, or defending legal claims and
              there is no reason to assume that you have an overriding interest in not disclosing
              your data.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">Your Rights</h2>
          <p className="mt-3">
            Under the GDPR, you have the following rights regarding your personal data:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2">
            <li>
              <strong className="text-ink-50">Right to access:</strong> Obtain confirmation of
              whether your data is being processed and, if so, receive further details.
            </li>
            <li>
              <strong className="text-ink-50">Right to correction:</strong> Request the correction
              of incorrect or incomplete personal data.
            </li>
            <li>
              <strong className="text-ink-50">Right to deletion:</strong> Demand the deletion of
              your personal data, except when processing is required by law.
            </li>
            <li>
              <strong className="text-ink-50">Right to restrict processing:</strong> Request the
              limitation of processing if you contest the accuracy of the data.
            </li>
            <li>
              <strong className="text-ink-50">Right to data portability:</strong> Receive the
              personal data that you provided in a structured, commonly used, and
              machine-readable format.
            </li>
            <li>
              <strong className="text-ink-50">Right to withdraw consent:</strong> Withdraw your
              consent at any time.
            </li>
          </ul>
          <p className="mt-3">
            If you believe that the processing of your data violates data protection law, you have
            the right to lodge a complaint with a supervisory authority.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">Data Security</h2>
          <p className="mt-3">
            I use appropriate technical and organizational security measures to protect your data
            from accidental or intentional manipulation, partial or complete loss, destruction, or
            unauthorized access by third parties. My security measures are continuously improved
            in line with technological developments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-50">Updates to this Policy</h2>
          <p className="mt-3">
            I may update this Privacy Policy to reflect changes in legal requirements or changes to
            my services. The latest version is available on this website.
          </p>
        </section>
      </div>
    </article>
  );
}
