import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

export function DashboardPage() {
  const { user, userError, isInitializing, retryUser, logout } = useAuth();

  if (isInitializing) {
    return <main className="p-8 text-center text-sm text-slate-600">Loading your profile...</main>;
  }

  if (!user && userError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-semibold text-slate-900">Profile unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">
            {getErrorMessage(userError)}
          </p>
          <button
            type="button"
            onClick={() => void retryUser()}
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  if (!user) {
    return <main className="p-8 text-center text-sm text-slate-600">Loading your profile...</main>;
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row">
          <div>
            <p className="text-sm font-medium text-indigo-600">Auth Forms App</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Your dashboard</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            Log out
          </button>
        </div>
        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-24 w-24 rounded-full border-4 border-indigo-50 bg-slate-100 object-cover"
          />
          <dl className="grid w-full gap-4 text-center sm:text-left">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">{user.firstName} {user.lastName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Username</dt>
              <dd className="mt-1 text-sm text-slate-700">{user.username}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 text-sm text-slate-700">{user.email}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
