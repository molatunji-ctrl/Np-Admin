import { useState } from "react";
import { SITE_URL } from "../constants/site";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21.6 12.227c0-.68-.061-1.333-.175-1.959H12v3.712h5.4c-.232 1.253-1.007 2.314-2.15 3.03v2.518h3.47c2.033-1.873 3.21-4.633 3.21-7.301z" fill="#4285F4"/>
    <path d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.47-2.52c-.96.64-2.19 1.02-3.16 1.02-2.43 0-4.49-1.64-5.23-3.84H3.13v2.41C4.77 19.95 8.06 22 12 22z" fill="#34A853"/>
    <path d="M6.77 13.18A5.996 5.996 0 0 1 6 12c0-.33.04-.65.12-.96V8.63H3.13A9.002 9.002 0 0 0 3 12c0 1.45.33 2.82.9 4.03l2.87-2.85z" fill="#FBBC05"/>
    <path d="M12 6.2c1.47 0 2.8.5 3.84 1.48l2.87-2.87C16.96 2.98 14.7 2 12 2 8.06 2 4.77 4.05 3.13 7.04l2.87 2.41C7.51 7.84 9.57 6.2 12 6.2z" fill="#EA4335"/>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate actual authentication logic here
    alert(`Signing in as ${email}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      {/* Header / Brand Logo */}
      <header className="mb-6 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold">
            N
          </div>
          <div className="text-lg font-semibold text-slate-900">
            Nuges Pharmaceuticals
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to track orders and manage your profile.
            </p>
          </div>

          {/* OAuth Button */}
          <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors duration-200">
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center text-sm text-slate-300">
            <div className="flex-1 border-t" />
            <div className="mx-3 text-xs text-slate-400">or</div>
            <div className="flex-1 border-t" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all duration-200"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all duration-200"
              />
              <div className="mt-2 text-right">
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99] transition-all duration-200"
            >
              Sign in
            </button>
          </form>

          {/* Sign Up Redirect */}
          <div className="mt-6 text-center text-sm text-slate-500">
            New to Nuges?{" "}
            <a href="#" className="text-slate-900 font-medium hover:underline">
              Create account
            </a>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 flex justify-center">
          <a href={`${SITE_URL}/home`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default LoginPage;