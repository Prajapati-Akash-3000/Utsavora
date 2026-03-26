import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { PageLoader } from "../../components/ui/Loading";
import PageWrapper from "../../components/motion/PageWrapper";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { handleApiError } from "../../utils/handleApiError";

export default function EditUserProfile() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/accounts/profile/")
      .then((res) => {
        setProfile(res.data);
        setFullName(res.data.user?.full_name || "");
        setMobile(res.data.user?.mobile || "");
      })
      .catch((err) => {
        setError(handleApiError(err));
      })
      .finally(() => setLoading(false));
  }, []);



  const avatarInitials = useMemo(() => {
    const base = fullName || profile?.user?.email || "?";
    return base
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  }, [fullName, profile]);



  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      // mobile is optional; allow empty string
      if (mobile.trim()) formData.append("mobile", mobile.trim());


      const res = await api.put("/accounts/profile/", formData);

      const updatedUser = res.data?.user;
      if (updatedUser) {
        const access = localStorage.getItem("access");
        const refresh = localStorage.getItem("refresh");
        login({
          access,
          refresh,
          role: updatedUser.role,
          name: updatedUser.full_name || "",
          full_name: updatedUser.full_name || "",
          email: updatedUser.email,
          username: updatedUser.email,
          id: updatedUser.id,

        });
      }

      navigate("/user/profile");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900">Edit Profile</h1>
        <p className="text-gray-500 mt-2 font-medium">
          Update your full name and mobile number.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 font-bold text-sm">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-7">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center">
            <span className="text-indigo-700 font-black text-xl">{avatarInitials}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary font-semibold"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number (optional)</label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary font-semibold"
              placeholder="+91 9876543210"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="ghost"
            className="sm:w-auto w-full"
            onClick={() => navigate("/user/profile")}
          >
            Cancel
          </Button>
          <Button
            className="sm:w-auto w-full"
            disabled={saving}
            loading={saving}
            type="submit"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}

