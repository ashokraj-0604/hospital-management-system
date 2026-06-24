'use client';

import React from 'react';
import Image from 'next/image';
import { Activity, Shield, Users, BarChart3 } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { MfaForm } from './components/MfaForm';
import { useAuth } from './useAuth'; import { useTenant } from './useTenant';
import type { LoginFormValues } from '@/src/lib/validation';

// ─── Feature Pills ─────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Activity, label: 'Real-time patient monitoring' },
  { icon: Shield, label: 'HIPAA-compliant & secure' },
  { icon: Users, label: 'Multi-role access control' },
  { icon: BarChart3, label: 'Analytics & reporting' },
] as const;

// ─── LoginPage ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { login, verifyMfa, error, clearError, requiresMfa, isLoading } = useAuth();
  const { branding } = useTenant();

  const handleLogin = async (values: LoginFormValues) => {
    await login(values);
  };

  const handleMfaVerify = async (otp: string) => {
    await verifyMfa(otp);
  };

  const handleBackToLogin = () => {
    clearError();
    // Re-mount handled by requiresMfa state resetting via auth hook
    window.location.reload();
  };

  const primaryColor = branding?.primary_color ?? '#2E75B6';
  const secondaryColor = branding?.secondary_color ?? '#1B3A5C';

  return (
    <div className="min-h-screen flex" style={{ '--color-primary': primaryColor, '--color-secondary': secondaryColor } as React.CSSProperties}>

      {/* ── Left Panel — Branding ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col justify-between relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,var(--color-secondary) 0%,var(--color-primary) 100%)` }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-16 h-48 w-48 rounded-full bg-white/5 -translate-y-1/2" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {branding?.logo_url ? (
              <Image
                src={branding.logo_url}
                alt={branding.app_name}
                width={48}
                height={48}
                className="rounded-xl"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Activity size={24} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {branding?.app_name ?? 'HMS Platform'}
              </h1>
              <p className="text-xs text-white/60 font-medium tracking-widest uppercase">
                v2.0 Multi-Tenant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 w-fit">
            <Activity size={14} className="text-white" />
            <span className="text-xs font-semibold text-white">
              System Online
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {/* Hero text */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Healthcare,<br />
                <span className="text-white/70">intelligently</span><br />
                managed.
              </h2>
              <p className="mt-4 text-base text-white/65 leading-relaxed max-w-md">
                {branding?.login_tagline ??
                  'Streamline every workflow — from patient registration to discharge — in one unified platform.'}
              </p>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4"
                >
                  <Icon size={18} className="text-white mb-2" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} HMS Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel — Auth Form ────────────────────────────────────────── */}
      <div className="flex w-full lg:w-[45%] xl:w-[40%] items-center justify-center p-6 sm:p-10" style={{ backgroundColor: '#F4FAFB' }}>
        <div className="w-full max-w-[460px] space-y-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: '#33ABC3' }}
            >
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#0D2F36]">
              {branding?.app_name ?? 'HMS Platform'}
            </span>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-[0_8px_24px_rgba(13,47,54,0.08)]  p-8">

            {/* Header */}
            <div className="mb-8">
              {requiresMfa ? (
                <>
                  <h2 className="text-2xl font-bold text-[#0D2F36]">Two-factor auth</h2>
                  <p className="mt-1.5 text-sm text-[#4A7C87]">
                    Verify your identity to continue
                  </p>
                </>
              ) : (
                <>
                 <h2 className="text-2xl font-bold text-[#0D2F36]">Welcome back</h2>
                  <p className="mt-1.5 text-sm text-[#4A7C87]">
                    Sign in to your{' '}
                    <span className="font-medium" style={{ color: primaryColor }}>
                      {branding?.hospital_name ?? 'hospital'}
                    </span>{' '}
                    account
                  </p>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="mb-8 h-px" style={{ backgroundColor: '#D6EFF4' }} />

            {/* Form */}
            {requiresMfa ? (
              <MfaForm
                onSubmit={handleMfaVerify}
                onBack={handleBackToLogin}
                error={error}
              />
            ) : (
              <LoginForm
                onSubmit={handleLogin}
                error={error}
                onClearError={clearError}
              />
            )}
          </div>

          {/* Help text */}
          <p className="text-center text-xs text-[#8AACB3]">
            Need assistance?{' '}
            <a
              href={`mailto:${branding?.support_email ?? 'support@hms.app'}`}
              className="font-medium text-[#33ABC3] hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
