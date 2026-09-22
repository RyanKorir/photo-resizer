import Link from 'next/link'
import { Camera, ArrowLeft } from 'lucide-react'

const EFFECTIVE_DATE = 'September 22, 2025'
const CONTACT_EMAIL = 'ryankorir00@gmail.com'

export default function PrivacyPolicy() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh', overflowY: 'auto' }}>

      {/* Nav */}
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={13} color="white" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>PixelForge</span>
        </Link>
        <span style={{ color: 'var(--border)' }}>·</span>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={13} /> Back
        </Link>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 48 }}>Effective date: {EFFECTIVE_DATE}</p>

        <Prose>
          <h2>1. Overview</h2>
          <p>
            PixelForge (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a browser-based photo editor built and operated by Ryan Korir.
            This Privacy Policy explains what information we collect, how we use it, and what rights you have regarding it.
            We are committed to protecting your privacy. Because of how PixelForge is built, most of this policy
            is straightforward: we collect almost nothing.
          </p>

          <h2>2. No Photo Data Is Collected</h2>
          <p>
            <strong>Your photos never leave your device.</strong> All image processing in PixelForge — including
            crops, resizes, filters, adjustments, and exports — is performed entirely on your local device using the
            HTML5 Canvas API running in your web browser. No image data, metadata, or edited output is ever
            transmitted to any server, cloud storage, or third party.
          </p>
          <p>
            We do not have access to any photos you edit with PixelForge. We cannot access, view, store, or
            share your photos because they are processed entirely client-side and never leave your browser session.
          </p>

          <h2>3. Information We Do Collect</h2>
          <p>
            Because PixelForge is a static web application hosted on Vercel, the following minimal information
            may be processed:
          </p>
          <ul>
            <li><strong>Server logs:</strong> Vercel (our hosting provider) may collect standard server access logs, including your IP address, browser type, referring URL, and the pages you visit. This is standard hosting infrastructure behaviour.</li>
            <li><strong>Analytics (if enabled):</strong> We may use privacy-respecting, anonymised analytics (such as page view counts) to understand how the application is used. No personally identifiable information is collected for this purpose.</li>
          </ul>
          <p>
            We do <strong>not</strong> collect: your name, email address, account details, payment information,
            location data, device identifiers, or any information about the photos you edit.
          </p>

          <h2>4. No Account Required</h2>
          <p>
            PixelForge does not require you to create an account or provide any personal information to use the
            editor. The editor is fully functional without any registration.
          </p>

          <h2>5. Cookies</h2>
          <p>
            PixelForge does not use tracking cookies, advertising cookies, or third-party cookies. A session
            storage or local storage value may be used to preserve temporary editor state within your browser
            session only. This data never leaves your device.
          </p>

          <h2>6. Third-Party Services</h2>
          <p>
            The application is hosted on <strong>Vercel</strong>, whose privacy policy is available at
            {' '}<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>.
            No other third-party services, tracking scripts, or advertising networks are embedded in PixelForge.
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            PixelForge is not directed at children under the age of 13. We do not knowingly collect personal
            information from children. If you believe a child has provided us with personal information,
            please contact us at the address below.
          </p>

          <h2>8. Data Retention</h2>
          <p>
            Because we do not collect personal data about your usage of the editor, there is no personal
            data for us to retain or delete. Any server access logs retained by Vercel are subject to
            Vercel&apos;s own data retention policies.
          </p>

          <h2>9. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights under data protection laws (such as GDPR or Kenya&apos;s
            Data Protection Act 2019) including the right to access, correct, or delete personal data we hold
            about you. Since we collect no personal data through the editor itself, there is typically no data
            to access or delete. For any questions, contact us at the address below.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The effective date at the top of this page
            will reflect the date of the most recent revision. We encourage you to review this page periodically.
            Continued use of PixelForge after changes are posted constitutes your acceptance of the revised policy.
          </p>

          <h2>11. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </Prose>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
          <Link href="/terms" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service →</Link>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 15,
      lineHeight: 1.75,
      color: 'var(--text-secondary)',
    }}>
      <style>{`
        .prose-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 36px 0 12px;
          letter-spacing: -0.01em;
        }
        .prose-content p { margin: 0 0 16px; }
        .prose-content ul { margin: 0 0 16px; padding-left: 20px; }
        .prose-content li { margin-bottom: 8px; }
        .prose-content strong { color: var(--text-primary); font-weight: 600; }
        .prose-content a { color: var(--accent); text-decoration: none; }
        .prose-content a:hover { text-decoration: underline; }
      `}</style>
      <div className="prose-content">{children}</div>
    </div>
  )
}
