import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center transition-colors duration-300">
      <div className="max-w-md">
        <h1 className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-9xl font-black text-transparent animate-pulse">
          404
        </h1>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
          The dashboard link you are trying to access does not exist or has been relocated to another workspace path.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 active:scale-95 transition-all"
          >
            Back to Home
          </Link>
          <Link
            to="/admin"
            className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
