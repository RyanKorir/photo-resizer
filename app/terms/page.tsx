import Link from 'next/link'
import { Camera, ArrowLeft } from 'lucide-react'

const EFFECTIVE_DATE = 'September 22, 2025'
const CONTACT_EMAIL = 'ryankorir00@gmail.com'

export default function TermsOfService() {
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
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 48 }}>Effective date: {EFFECTIVE_DATE}</p>

        <Prose>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using PixelForge at pixelforge.app (the &quot;Service&quot;), you agree to be bound
            by these Terms of Service (&quot;Terms&quot;). If you do not agree with any part of these Terms,
            you may not use the Service. These Terms apply to all users of the Service.
          </p>
          <p>
            PixelForge is operated by Ryan Korir (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>

          <h2>2. Description of Service</h2>
          <p>
            PixelForge is a browser-based photo editing tool that allows you to crop, resize, rotate, apply filters,
            and adjust images entirely on your local device. No image data is transmitted to our servers.
            The Service is provided free of charge for personal and commercial use.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The PixelForge software, design, interface, branding, and all associated intellectual property
            are owned by Ryan Korir. You may not copy, reproduce, distribute, or create derivative works
            of PixelForge&apos;s interface or branding without prior written permission.
          </p>
          <p>
            <strong>Your content:</strong> You retain full ownership of all photos and images you process using
            PixelForge. We make no claim to any content you create or edit using the Service.
          </p>
          <p>
            <strong>Source code buyers:</strong> If you have purchased the PixelForge source code through Gumroad
            or another authorised channel, use is governed by the licence included with that purchase. Generally,
            you may use the source code to build and deploy your own products, but you may not resell the source
            code itself as a standalone product.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use PixelForge to:</p>
          <ul>
            <li>Process, distribute, or create images that violate any applicable law</li>
            <li>Create content that is defamatory, obscene, abusive, or infringes third-party intellectual property rights</li>
            <li>Attempt to reverse-engineer, decompile, or extract the underlying source code without authorisation</li>
            <li>Introduce malware, viruses, or any malicious code into the Service</li>
            <li>Use automated scripts or bots to access the Service in a way that could impair its availability or performance</li>
          </ul>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            either express or implied, including but not limited to warranties of merchantability, fitness for a
            particular purpose, or non-infringement.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.
            You use the Service at your own risk. We strongly recommend keeping backups of your original images
            before editing them.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Ryan Korir shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, including but not limited to loss of data,
            loss of profits, or loss of goodwill, arising out of or related to your use of or inability to use
            the Service, even if advised of the possibility of such damages.
          </p>
          <p>
            Our total liability to you for any claim arising out of or related to these Terms or the Service
            shall not exceed the amount you paid to us in the twelve months preceding the claim, or USD $10,
            whichever is greater.
          </p>

          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Ryan Korir and any affiliates, officers, or
            agents from and against any claims, liabilities, damages, losses, and expenses (including legal
            fees) arising out of or related to your use of the Service or your violation of these Terms.
          </p>

          <h2>8. Third-Party Links and Services</h2>
          <p>
            The Service may contain links to third-party websites (such as Gumroad or GitHub). These are
            provided for convenience only. We have no control over the content or practices of third-party
            sites and accept no responsibility for them.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will update the effective date at
            the top of this page when changes are made. Continued use of the Service after changes are posted
            constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.
          </p>

          <h2>10. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to the Service at any time, for any reason,
            without notice, including if we believe you have violated these Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya,
            without regard to its conflict of law provisions. Any disputes arising from these Terms shall be
            subject to the exclusive jurisdiction of the courts of Kenya.
          </p>

          <h2>12. Contact</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </Prose>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
          <Link href="/privacy" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy →</Link>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
      <style>{`
        .prose-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px; font-weight: 600;
          color: var(--text-primary);
          margin: 36px 0 12px; letter-spacing: -0.01em;
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
