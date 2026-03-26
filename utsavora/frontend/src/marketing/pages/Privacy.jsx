import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us when you register, create events, or contact us. This includes your name, email address, phone number, and payment information."
  },
  {
    title: "2. How We Use Your Information",
    body: "We use the information we collect to provide, maintain, and improve our services, process transactions, send event-related notifications, and communicate with you about updates or offers."
  },
  {
    title: "3. Information Sharing",
    body: "We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our platform, subject to confidentiality agreements."
  },
  {
    title: "4. Data Security",
    body: "We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits to protect your personal data against unauthorized access."
  },
  {
    title: "5. Cookies",
    body: "We use cookies and similar tracking technologies to enhance your experience. You can instruct your browser to refuse all cookies, but this may limit some features of Utsavora."
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access, update, or delete your personal data at any time. Contact us at privacy@utsavora.com to exercise your rights."
  },
  {
    title: "7. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date."
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">Privacy Policy</h1>
        <p className="text-slate-500">Effective Date: January 1, 2025</p>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-slate-600 mb-10">
          At Utsavora, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our platform.
        </p>

        <div className="flex flex-col gap-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h2>
              <p className="text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-5 bg-indigo-50 rounded-2xl">
          <p className="text-slate-600 text-sm">Questions about our privacy practices? Email us at{" "}
            <a href="mailto:privacy@utsavora.com" className="text-indigo-600 font-medium hover:underline">privacy@utsavora.com</a>
          </p>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-indigo-600 hover:underline text-sm">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
