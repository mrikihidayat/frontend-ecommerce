import React from 'react';
const ErrorPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow flex flex-col justify-center items-center text-center">
        <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
        <p className="text-gray-600 mb-8">
          Your visited page not found. You may go home page.
        </p>
      </main>

    </div>
  );
};

export default ErrorPage;
