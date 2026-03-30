import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 max-w-md text-slate-400">The route you requested does not exist in the current RepoSage build.</p>
      <Link to="/" className="mt-8 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-slate-950">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;

