export default function CompletedEventPanel() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800">
        Event Completed 🎉
      </h3>

      <p className="text-gray-600 mt-2">
        Payment has been settled and the event is successfully completed.
      </p>

      <div className="mt-4 flex gap-4">


        <button className="border px-4 py-2 rounded">
          View Photos
        </button>
      </div>
    </div>
  );
}
