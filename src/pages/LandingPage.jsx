import { Suspense, lazy } from "react";
import { ArrowRight, BrainCircuit, DatabaseZap, Github, GitFork } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ParticleField = lazy(() => import("../components/3d/ParticleField"));

const features = [
  {
    title: "Index Any Repo",
    description: "Connect GitHub, select a repository, and build a semantic index over its code.",
    icon: DatabaseZap
  },
  {
    title: "Semantic Code Search",
    description: "Use natural language to find architecture details, business logic, and implementation paths.",
    icon: BrainCircuit
  },
  {
    title: "Understand Structure",
    description: "Turn unfamiliar repositories into an explorable knowledge base for faster onboarding.",
    icon: GitFork
  }
];

function LandingPage() {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative overflow-hidden">
      <Suspense fallback={<div className="pointer-events-none fixed inset-0 -z-10 animate-ambient-gradient bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_35%),linear-gradient(180deg,rgba(248,250,252,0.72),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_35%),linear-gradient(180deg,rgba(3,7,18,0.35),rgba(3,7,18,1))]" />}>
        <ParticleField />
      </Suspense>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%),linear-gradient(180deg,rgba(248,250,252,0.3),rgba(248,250,252,0.9))] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_35%),linear-gradient(180deg,rgba(3,7,18,0.35),rgba(3,7,18,1))]" />
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-20">
        <div className="max-w-3xl">
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-6xl">
            Ask your codebase anything.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            RepoSage indexes GitHub repositories and gives you a production-grade chat interface for understanding any codebase.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button type="button" onClick={login} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              <Github size={18} />
              Login with GitHub
            </button>
            <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ArrowRight size={16} />
              Connect, index, and chat with your repos
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-500">
            First sign-in opens GitHub&apos;s authorization screen. The app name shown there comes from your configured GitHub OAuth app.
          </p>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-6 px-6 pb-14 md:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="mb-4 inline-flex rounded-2xl border border-indigo-200 bg-indigo-50 p-3 text-indigo-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Icon size={22} />
            </div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
          </article>
        ))}
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-8 shadow-sm dark:border-white/10 dark:bg-[#0b1120]">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">How It Works</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {["Connect GitHub", "Index Repository", "Ask Questions"].map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/60">
                <p className="text-sm text-indigo-600 dark:text-emerald-300">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-medium text-slate-950 dark:text-white">{step}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  {index === 0 && "Authenticate with GitHub OAuth and securely connect your account."}
                  {index === 1 && "Prepare the repository for retrieval by building a semantic vector index."}
                  {index === 2 && "Use natural language to inspect code, architecture, and implementation details."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
