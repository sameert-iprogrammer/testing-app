import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, User, UserPlus } from 'lucide-react';

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormState: RegisterFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<RegisterFormState>(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const setField =
    (key: keyof RegisterFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const inputClassName =
    'block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <UserPlus className="text-white h-6 w-6" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">Create your account</h2>
            <p className="text-slate-400 text-center mb-8 text-sm">Enter your details to get started</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    value={form.name}
                    onChange={setField('name')}
                    className={inputClassName}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    value={form.email}
                    onChange={setField('email')}
                    className={inputClassName}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="register-password"
                    type="password"
                    value={form.password}
                    onChange={setField('password')}
                    className={inputClassName}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="register-confirm-password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={setField('confirmPassword')}
                    className={inputClassName}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200"
              >
                Create Account
              </button>
            </form>
          </div>

          <div className="p-6 bg-slate-800/30 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
