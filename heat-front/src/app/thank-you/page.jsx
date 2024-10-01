"use client";

export default function ThankYouPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg mb-4">
        Your test and audio evaluation have been successfully submitted.
      </p>
      <p className="text-lg mb-4">
        You will be notified soon with the results. You can now close this
        window.
      </p>

      <button
        onClick={() => window.close()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Close Window
      </button>
    </div>
  );
}
