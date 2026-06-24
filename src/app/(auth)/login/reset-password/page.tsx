'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Activity, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../login.api';
import { useTenant } from '../useTenant';

const schema = z.object({
  new_password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[@$!%*?&]/, 'Must contain a special character (@$!%*?&)'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type FormValues = z.infer<typeof schema>;

// Password strength indicator
const getStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  return score;
};

const STRENGTH_LABELS = ['', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const { branding } = useTenant();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const primaryColor = branding?.primary_color ?? '#2E75B6';
  const secondaryColor = branding?.secondary_color ?? '#1B3A5C';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const passwordValue = watch('new_password') ?? '';
  const strength = getStrength(passwordValue);

  // Invalid link state
  if (!token || !email) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle size={32} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invalid link</h2>
          <p className="mt-2 text-sm text-slate-500">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Link
          href="/login/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-medium underline"
          style={{ color: primaryColor }}
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    try {
      await authService.resetPassword({
        token,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });
      setSuccess(true);
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ?? 'Something went wrong. Please try again.'
      );
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
              Create a<br />
              <span className="text-white/70">new password</span>
            </h2>
            <p className="text-base text-white/65 leading-relaxed max-w-md">
              Choose a strong password to keep your account secure.
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
            {success ? (
              /* ── Success ── */
              <div className="text-center space-y-4">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <CheckCircle2 size={32} style={{ color: primaryColor }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Password updated!</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Go to login
                </Link>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">New password</h2>
                  <p className="mt-1.5 text-sm text-slate-500">
                    Must be at least 8 characters with uppercase, number and special character.
                  </p>
                </div>

                <div className="mb-8 h-px bg-slate-100" />

                {serverError && (
                  <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
                    <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600">{serverError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">New password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('new_password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {passwordValue && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-all"
                              style={{
                                backgroundColor: i <= strength ? STRENGTH_COLORS[strength] : '#e2e8f0',
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: STRENGTH_COLORS[strength] }}>
                          {STRENGTH_LABELS[strength]}
                        </p>
                      </div>
                    )}
                    {errors.new_password && (
                      <p className="text-xs text-red-500">{errors.new_password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('confirm_password')}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-xs text-red-500">{errors.confirm_password.message}</p>
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
                        Updating password…
                      </>
                    ) : (
                      'Reset password'
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
