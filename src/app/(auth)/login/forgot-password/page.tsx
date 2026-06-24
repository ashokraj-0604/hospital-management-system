'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../login.api';
import { useTenant } from '../useTenant';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { branding } = useTenant();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const primaryColor = branding?.primary_color ?? '#2E75B6';
  const secondaryColor = branding?.secondary_color ?? '#1B3A5C';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await authService.forgotPassword({ email: values.email });
    } finally {
      // Always show success — prevents email enumeration
      setSubmittedEmail(values.email);
      setSubmitted(true);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ '--color-primary': primaryColor, '--color-secondary': secondaryColor } as React.CSSProperties}
    >
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col justify-between relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)` }}
      >
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {branding?.app_name ?? 'HMS Platform'}
              </h1>
              <p className="text-xs text-white/60 font-medium tracking-widest uppercase">
                v2.0 Multi-Tenant
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Forgot your<br />
              <span className="text-white/70">password?</span>
            </h2>
            <p className="text-base text-white/65 leading-relaxed max-w-md">
              No worries — it happens to the best of us. Enter your email and
              we'll send you a secure reset link.
            </p>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} HMS Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-[45%] xl:w-[40%] items-center justify-center bg-slate-50 p-6 sm:p-10">
        <div className="w-full max-w-[420px] space-y-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: primaryColor }}
            >
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">
              {branding?.app_name ?? 'HMS Platform'}
            </span>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
            {submitted ? (
              /* ── Success State ── */
              <div className="text-center space-y-4">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <CheckCircle2 size={32} style={{ color: primaryColor }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Check your email</h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    We sent a password reset link to{' '}
                    <span className="font-medium text-slate-700">{submittedEmail}</span>.
                    It expires in 1 hour.
                  </p>
                </div>
                <div className="pt-2 space-y-3">
                  <p className="text-xs text-slate-400">
                    Didn't receive it? Check your spam folder or{' '}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="underline hover:text-slate-600 transition-colors"
                    >
                      try again
                    </button>
                    .
                  </p>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to login
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Form State ── */
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Reset password</h2>
                  <p className="mt-1.5 text-sm text-slate-500">
                    Enter your account email and we'll send you a reset link.
                  </p>
                </div>

                <div className="mb-8 h-px bg-slate-100" />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="you@hospital.com"
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending reset link…
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </button>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to login
                  </Link>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-400">
            Having trouble?{' '}
            <a
              href={`mailto:${branding?.support_email ?? 'support@hms.app'}`}
              className="underline hover:text-slate-600 transition-colors"
            >
              Contact IT support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
