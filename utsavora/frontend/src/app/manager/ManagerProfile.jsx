import { useState, useEffect } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";

export default function ManagerProfile() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState({
    company_name: "",
    city: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/accounts/manager/profile/");
        setProfile(res.data);
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const payload = {
        company_name: profile.company_name,
        city: profile.city,
      };
      const res = await api.put("/accounts/manager/profile/", payload);
      setProfile(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(handleApiError(err));
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
