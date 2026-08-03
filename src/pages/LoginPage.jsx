import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { loginAdmin } from "../lib/api";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginAdmin(email, password);

      if (result && result.success === false) {
        throw new Error(result.message || "Invalid credentials");
      }

      onLogin();
    } catch (err) {
      const message = err?.message || "";

      if (message.includes("Failed to fetch") || message.includes("NetworkError") || message.includes("fetch")) {
        setError("Unable to reach the backend. Check the API URL and ensure the server is running with CORS enabled.");
        return;
      }

      setError(message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
            N
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Access</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage Nuges Pharmacy
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
                placeholder="admin@nugespharmacy.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;