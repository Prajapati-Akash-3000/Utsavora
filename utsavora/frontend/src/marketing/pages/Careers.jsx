import { Link } from "react-router-dom";

const openings = [
  { role: "Full Stack Engineer", type: "Remote · Full-time", team: "Engineering" },
  { role: "UI/UX Designer", type: "Remote · Full-time", team: "Design" },
  { role: "Event Manager Partnerships", type: "Hybrid · Full-time", team: "Partnerships" },
  { role: "Customer Success Associate", type: "Remote · Part-time", team: "Support" },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-violet-50 py-20 px-6 text-center">
        <span className="text-5xl mb-6 block">🚀</span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          Join the Utsavora Team
        </h1>
        <p className="text-slate-600 text-lg max-w-xl mx-auto">
          We're building the future of event planning. Come shape experiences that bring people together.
        </p>
      </section>

      {/* Openings */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Open Positions</h2>
        <div className="flex flex-col gap-4">
          {openings.map((job, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{job.role}</h3>
                <p className="text-slate-500 text-sm mt-1">{job.team} · {job.type}</p>
              </div>
              <a
                href="mailto:careers@utsavora.com"
                className="inline-block px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl text-center">
          <p className="text-slate-600">Don't see the right role? Send your resume to{" "}
            <a href="mailto:careers@utsavora.com" className="text-indigo-600 font-medium hover:underline">
              careers@utsavora.com
            </a>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-indigo-600 hover:underline text-sm">&larr; Back to Home</Link>
        </div>
      </section>
    </div>
  );
}
