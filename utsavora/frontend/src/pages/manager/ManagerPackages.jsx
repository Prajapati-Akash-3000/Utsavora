import { useState, useEffect } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

export default function ManagerPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPkg, setCurrentPkg] = useState(null); // null = create mode

  useEffect(() => {
      const fetchPackages = async () => {
        try {
          const res = await api.get("/manager/packages/");
          setPackages(res.data);
          setLoading(false);
        } catch (err) { // eslint-disable-line no-unused-vars
          setLoading(false);
          toast.error("Failed to load packages");
        }
      };
      fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/manager/packages/${id}/`);
      setPackages(packages.filter((p) => p.id !== id));
      toast.success("Package deleted.");
    } catch (err) { // eslint-disable-line no-unused-vars
       toast.error("Failed to delete package.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (currentPkg) {
        // Update
        const res = await api.put(`/manager/packages/${currentPkg.id}/`, data);
        setPackages(packages.map(p => p.id === currentPkg.id ? res.data : p));
        toast.success("Package updated.");
      } else {
        // Create
        const res = await api.post("/manager/packages/", data);
        setPackages([...packages, res.data]);
        toast.success("Package created.");
      }
      setShowModal(false);
      setCurrentPkg(null);
    } catch (err) { // eslint-disable-line no-unused-vars
      toast.error("Failed to save package.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Service Packages</h1>
        <button
          onClick={() => { setCurrentPkg(null); setShowModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white p-6 shadow rounded-lg border">
            <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
            <p className="text-gray-600 mb-4">{pkg.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">₹{pkg.price}</span>
              <span className="text-sm text-gray-500">{pkg.duration_hours} Hours</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setCurrentPkg(pkg); setShowModal(true); }}
                className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentPkg ? "Edit Package" : "New Package"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                name="title"
                defaultValue={currentPkg?.title}
                placeholder="Package Title (e.g. Wedding Alpha)"
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                defaultValue={currentPkg?.description}
                placeholder="Description"
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex gap-4">
                <input
                  name="price"
                  type="number"
                  defaultValue={currentPkg?.price}
                  placeholder="Price (₹)"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="duration_hours"
                  type="number"
                  defaultValue={currentPkg?.duration_hours}
                  placeholder="Hours"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
