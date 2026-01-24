import { useState, useEffect } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";

export default function ManagerProfile() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState({
    company_name: "",
    city: "",
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
        setLoading(false);
      } catch (err) { // eslint-disable-line no-unused-vars
        setMessage({ type: "error", text: "Failed to load profile." });
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

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
    setMessage(null);
    try {
      // Structure data correctly for serializer
      const payload = {
        company_name: profile.company_name,
        city: profile.city,
        bank_details: profile.bank_details
      };
      
      const res = await api.put("/accounts/manager/profile/", payload);
      setProfile(res.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) { // eslint-disable-line no-unused-vars
       setMessage({ type: "error", text: "Failed to update profile." });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manager Profile</h1>

      {message && <Message type={message.type} text={message.text} />}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Details */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={profile.company_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Bank Details (Confidential)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                name="account_holder_name"
                value={profile.bank_details?.account_holder_name || ""}
                onChange={handleBankChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                placeholder="Name as per Passbook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                name="bank_name"
                value={profile.bank_details?.bank_name || ""}
                onChange={handleBankChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                placeholder="e.g. HDFC Bank"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                name="account_number"
                value={profile.bank_details?.account_number || ""}
                onChange={handleBankChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input
                type="text"
                name="ifsc_code"
                value={profile.bank_details?.ifsc_code || ""}
                onChange={handleBankChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
