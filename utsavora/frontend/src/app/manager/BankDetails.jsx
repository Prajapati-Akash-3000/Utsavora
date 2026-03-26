import React, { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Landmark, User, Hash, ArrowLeft, Save, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import PageWrapper from "../../components/common/PageWrapper";
import Loader from "../../components/common/Loader";

export default function BankDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    bank_details: {
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      bank_name: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/accounts/manager/profile/");
        setProfile(res.data);
      } catch (err) {
        toast.error("Failed to load bank details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        bank_details: profile.bank_details
      };
      await api.put("/accounts/manager/profile/", payload);
      toast.success("Bank details updated successfully!");
    } catch (err) {
      toast.error("Failed to update bank details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const bank = profile.bank_details || {};

  return (
    <PageWrapper className="py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition mb-8 group"
        >
          <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-indigo-500/5 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl border border-indigo-500/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Payment Settings</h1>
                  <p className="text-sm text-slate-500">Your financial data is encrypted and secure.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="account_holder_name"
                    value={bank.account_holder_name || ""}
                    onChange={handleBankChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none placeholder:text-slate-300"
                    placeholder="Enter name exactly as in bank"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Landmark size={14} className="text-slate-400" />
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={bank.bank_name || ""}
                    onChange={handleBankChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none placeholder:text-slate-300"
                    placeholder="e.g. State Bank of India"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                      <Hash size={14} className="text-slate-400" />
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="account_number"
                      value={bank.account_number || ""}
                      onChange={handleBankChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none placeholder:text-slate-300 font-mono"
                      placeholder="XXXX XXXX XXXX XXXX"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                      <Landmark size={14} className="text-slate-400" />
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifsc_code"
                      value={bank.ifsc_code || ""}
                      onChange={handleBankChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none placeholder:text-slate-300 font-mono uppercase"
                      placeholder="SBIN0001234"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-4 btn-primary !rounded-2xl !py-4 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70"
                >
                  {saving ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Save size={20} />
                      <span className="font-bold">Save Bank Details</span>
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                  <Shield size={18} className="text-emerald-500" />
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                  We follow strict PCI-DSS and industry standard security protocols to ensure your data is never compromised. Your details are used solely for payout settlements.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Preview */}
          <div className="lg:col-span-2 order-1 lg:order-2 sticky top-24">
            <p className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Card Preview</p>
            
            {/* Visual Bank Card */}
            <div className="relative w-full aspect-[1.58/1] rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-primary p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-indigo-500/30 ring-1 ring-white/20 select-none">
              {/* Decorative Mesh */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/20 blur-[80px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-300/20 blur-[80px] rounded-full" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Payout Account</p>
                  <h3 className="text-lg font-black text-white truncate max-w-[150px]">
                    {bank.bank_name || "YOUR BANK"}
                  </h3>
                </div>
                <CreditCard className="text-white/40" size={32} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-bold text-white/60 mb-2 uppercase tracking-[0.2em]">Account Number</p>
                <div className="flex gap-3 text-xl sm:text-2xl font-black text-white font-mono tracking-widest">
                  {bank.account_number 
                    ? bank.account_number.replace(/\s/g, '').match(/.{1,4}/g)?.map((chunk, i) => (
                        <span key={i}>{chunk}</span>
                      )) || bank.account_number
                    : "•••• •••• •••• ••••"}
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Account Holder</p>
                  <p className="text-sm font-bold text-white truncate max-w-[160px]">
                    {bank.account_holder_name || "YOUR FULL NAME"}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">IFSC</p>
                  <p className="text-sm font-black text-white tracking-widest">
                    {bank.ifsc_code || "XXXX0000XXX"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="mt-8 p-6 rounded-3xl bg-indigo-50 border border-indigo-100/50">
               <h4 className="text-sm font-black text-indigo-900 mb-2">Why we need this?</h4>
               <p className="text-xs text-indigo-700/70 leading-relaxed font-medium">
                 Your bank details are required to settle payments directly to your account. Payouts are usually processed within 48-72 hours of an event's completion.
               </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
