import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "How do I create an event on Utsavora?",
    a: "Register or log in as a User. From your dashboard, click 'Create Event' and fill in the event details including date, venue, and guest count. You can then hire a manager to help execute it."
  },
  {
    q: "How do I hire an event manager?",
    a: "After creating your event, go to the event detail page and click 'Hire Manager'. You'll see a list of verified managers in your city. Select a package that fits your budget and submit a booking request."
  },
  {
    q: "How does payment work?",
    a: "Payments are processed securely via Razorpay. Once a manager accepts your booking request, you'll be prompted to complete payment. Funds are held until the event is completed."
  },
  {
    q: "I'm a manager. How do I get approved?",
    a: "Register as a Manager, upload your credentials/certificate, and submit for verification. Our admin team reviews applications and approves qualified event managers. You'll receive an email notification."
  },
  {
    q: "Can a manager reject a booking?",
    a: "Yes. Managers review booking requests and can accept or reject based on availability. If rejected, you can hire a different manager for your event."
  },
  {
    q: "How do public events work?",
    a: "Any user can create a public event visible on the Utsavora Events page. People can register for public events without needing an account, using just their name, email, and phone number."
  },
  {
    q: "I forgot my password. How do I reset it?",
    a: "Click 'Forgot Password' on the login page. Enter your registered email and you'll receive an OTP to reset your password."
  },
  {
    q: "How do I contact support?",
    a: "Email us at support@utsavora.com or use the Contact page. We typically respond within 24 hours."
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left text-slate-800 font-medium hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        {open ? <ChevronUp size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-50 to-violet-50 py-16 px-6 text-center">
        <span className="text-5xl mb-4 block">💡</span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Help Center</h1>
        <p className="text-slate-600 max-w-md mx-auto">
          Find answers to common questions about Utsavora.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Frequently Asked Questions</h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl text-center">
          <p className="text-slate-600 font-medium mb-2">Still have questions?</p>
          <p className="text-slate-500 text-sm mb-4">Our support team is here to help.</p>
          <Link
            to="/contact"
            className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-indigo-600 hover:underline text-sm">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
