export default function RegistrationSuccess({ event }) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-semibold text-green-600">
        Registration Successful 🎉
      </h2>

      <p className="mt-4 text-gray-600">
        You have successfully registered for:
      </p>

      <p className="mt-2 font-semibold">{event.title}</p>

      <p className="text-sm text-gray-500 mt-4">
        A confirmation email with your ticket has been sent.
      </p>
    </div>
  );
}
