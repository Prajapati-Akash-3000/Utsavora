import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing and using Utsavora, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform."
  },
  {
    title: "2. Use of Service",
    body: "Utsavora provides an event management platform connecting users with professional event managers. You agree to use the platform only for lawful purposes and in accordance with these terms."
  },
  {
    title: "3. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use."
  },
  {
    title: "4. Events and Bookings",
    body: "Users create and manage events at their own responsibility. Utsavora acts as a platform facilitating connections and is not liable for the quality or execution of events or services provided by managers."
  },
  {
    title: "5. Payments",
    body: "All payments are processed securely through Razorpay. Utsavora charges a platform fee on bookings. Refund policies for specific bookings are governed by the agreed terms between users and managers."
  },
  {
    title: "6. Prohibited Activities",
    body: "You agree not to engage in fraudulent activity, misrepresentation, spamming, or any activity that interferes with the platform's operation or other users' experience."
  },
  {
    title: "7. Intellectual Property",
    body: "The Utsavora name, logo, and all related content are protected by copyright and trademark law. You may not reproduce, distribute, or create derivative works without our written permission."
  },
  {
    title: "8. Limitation of Liability",
    body: "Utsavora shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the fees paid by you in the past 12 months."
  },
  {
    title: "9. Changes to Terms",
    body: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms."
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">Terms of Service</h1>
        <p className="text-slate-500">Effective Date: January 1, 2025</p>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-slate-600 mb-10">
          Please read these Terms of Service carefully before using the Utsavora platform.
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
          <p className="text-slate-600 text-sm">Questions about our terms? Contact us at{" "}
            <a href="mailto:legal@utsavora.com" className="text-indigo-600 font-medium hover:underline">legal@utsavora.com</a>
          </p>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-indigo-600 hover:underline text-sm">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
