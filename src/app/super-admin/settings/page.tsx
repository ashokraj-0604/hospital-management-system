'use client';

import React, { useState, useEffect } from 'react';
import {
  Save, Shield, Bell, Globe, Database,
  Mail, KeyRound, Eye, EyeOff, Loader2, CheckCircle2
} from 'lucide-react';
import { BRAND } from '@/src/constants/brand.constants';
import { cn } from '@/src/lib/utils';
import apiClient from '@/src/lib/api-client';

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, description, children }: {
  title: React.ReactNode; description: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#D6EFF4] bg-[#F4FAFB]">
        <h2 className="text-sm font-semibold text-[#0D2F36] flex items-center gap-2">{title}</h2>
        <p className="text-xs text-[#8AACB3] mt-0.5">{description}</p>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="sm:w-56 shrink-0">
        <p className="text-sm font-medium text-[#0D2F36]">{label}</p>
        {hint && <p className="text-xs text-[#8AACB3] mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="relative">
      <input
        type={isPassword && show ? 'text' : type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3] transition-all"
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AACB3] hover:text-[#4A7C87]">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
}

function Toggle({ value, onChange, label }: {
  value: boolean; onChange: (v: boolean) => void; label?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(!value)}
        className={cn('relative h-5 w-9 rounded-full transition-colors duration-200', value ? 'bg-[#33ABC3]' : 'bg-[#D6EFF4]')}
      >
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200', value ? 'left-4' : 'left-0.5')} />
      </button>
      {label && <span className="text-sm text-[#4A7C87]">{label}</span>}
    </div>
  );
}

function SelectInput({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30"
    >
      {children}
    </select>
  );
}

// ─── Default settings shape ───────────────────────────────────────────────────

const DEFAULT: Record<string, any> = {
  platform_name: 'MedSocio HMS',
  support_email: 'support@medsocio.com',
  support_phone: '+91 1800 000 0000',
  primary_color: '#33ABC3',
  enforce_mfa: true,
  session_timeout_minutes: 60,
  max_login_attempts: 5,
  lockout_duration_minutes: 30,
  pw_require_uppercase: true,
  pw_require_number: true,
  pw_require_special: true,
  pw_prevent_reuse: false,
  notify_new_hospital: true,
  notify_subscription_expiring: true,
  notify_payment_overdue: true,
  notify_hospital_suspended: true,
  notify_failed_logins: false,
  notify_daily_summary: false,
  smtp_host: 'smtp.sendgrid.net',
  smtp_port: 587,
  smtp_user: 'apikey',
  smtp_password: '',
  smtp_from: 'noreply@medsocio.com',
  smtp_tls: true,
  default_timezone: 'Asia/Kolkata',
  default_currency: 'INR',
  date_format: 'DD/MM/YYYY',
  maintenance_mode: false,
  api_rate_limit: 300,
  audit_log_retention_days: 90,
  auto_suspend_on_expiry: true,
};

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [form, setForm]         = useState<Record<string, any>>(DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving]   = useState(false);
  const [saved, setSaved]         = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  // Load settings from backend
  useEffect(() => {
    apiClient.get('/settings')
      .then(res => setForm({ ...DEFAULT, ...res.data }))
      .catch(() => setForm(DEFAULT))
      .finally(() => setIsLoading(false));
  }, []);

  const set = (key: string) => (value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const str = (key: string) => String(form[key] ?? '');
  const bool = (key: string) => Boolean(form[key]);
  const num = (key: string) => String(form[key] ?? '');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.patch('/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      await apiClient.post('/settings/test-email', { to: form.support_email });
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 3000);
    } catch {
      alert('Failed to send test email.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="animate-spin text-[#33ABC3]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[900px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F36]">Platform Settings</h1>
          <p className="text-sm text-[#8AACB3] mt-0.5">
            Global configuration for the {BRAND.name} platform
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#33ABC3' }}
        >
          {isSaving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : saved ? (
            <CheckCircle2 size={15} />
          ) : (
            <Save size={15} />
          )}
          {saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* ── Platform Identity ── */}
      <Section title="Platform Identity" description="Branding shown to hospital admins on the super admin portal">
        <Field label="Platform Name">
          <TextInput value={str('platform_name')} onChange={set('platform_name')} />
        </Field>
        <Field label="Support Email" hint="Shown on login page">
          <TextInput value={str('support_email')} onChange={set('support_email')} type="email" />
        </Field>
        <Field label="Support Phone">
          <TextInput value={str('support_phone')} onChange={set('support_phone')} />
        </Field>
        <Field label="Primary Brand Color" hint="Used across the platform UI">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={str('primary_color')}
              onChange={e => set('primary_color')(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border border-[#D6EFF4] p-1"
            />
            <div className="flex-1">
              <TextInput value={str('primary_color')} onChange={set('primary_color')} />
            </div>
          </div>
        </Field>
      </Section>

      {/* ── Security ── */}
      <Section
        title={<><Shield size={14} className="text-[#33ABC3]" /> Security</>}
        description="Authentication and access control policies"
      >
        <Field label="Enforce MFA" hint="Require all super admins to use 2FA">
          <Toggle value={bool('enforce_mfa')} onChange={set('enforce_mfa')} label="Mandatory for super admin accounts" />
        </Field>
        <Field label="Session Timeout" hint="Auto-logout after inactivity">
          <SelectInput value={str('session_timeout_minutes')} onChange={v => set('session_timeout_minutes')(Number(v))}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="240">4 hours</option>
          </SelectInput>
        </Field>
        <Field label="Max Login Attempts" hint="Locks account after N failures">
          <TextInput value={num('max_login_attempts')} onChange={v => set('max_login_attempts')(Number(v))} />
        </Field>
        <Field label="Lockout Duration (min)">
          <TextInput value={num('lockout_duration_minutes')} onChange={v => set('lockout_duration_minutes')(Number(v))} />
        </Field>
        <Field label="Password Policy">
          <div className="space-y-2">
            <Toggle value={true} onChange={() => {}} label="Min 8 characters (always enforced)" />
            <Toggle value={bool('pw_require_uppercase')} onChange={set('pw_require_uppercase')} label="Require uppercase letter" />
            <Toggle value={bool('pw_require_number')} onChange={set('pw_require_number')} label="Require number" />
            <Toggle value={bool('pw_require_special')} onChange={set('pw_require_special')} label="Require special character" />
            <Toggle value={bool('pw_prevent_reuse')} onChange={set('pw_prevent_reuse')} label="Prevent last 5 passwords" />
          </div>
        </Field>
      </Section>

      {/* ── Notifications ── */}
      <Section
        title={<><Bell size={14} className="text-[#33ABC3]" /> Notifications</>}
        description="When to alert the super admin team"
      >
        {[
          { key: 'notify_new_hospital',            label: 'New hospital onboarded' },
          { key: 'notify_subscription_expiring',   label: 'Subscription expiring in 7 days' },
          { key: 'notify_payment_overdue',         label: 'Payment overdue' },
          { key: 'notify_hospital_suspended',      label: 'Hospital suspended' },
          { key: 'notify_failed_logins',           label: 'Failed login attempts (≥5)' },
          { key: 'notify_daily_summary',           label: 'Daily summary email' },
        ].map(({ key, label }) => (
          <Field key={key} label={label}>
            <Toggle value={bool(key)} onChange={set(key)} />
          </Field>
        ))}
      </Section>

      {/* ── SMTP ── */}
      <Section
        title={<><Mail size={14} className="text-[#33ABC3]" /> Email / SMTP</>}
        description="Outgoing mail configuration for system emails"
      >
        <Field label="SMTP Host">
          <TextInput value={str('smtp_host')} onChange={set('smtp_host')} />
        </Field>
        <Field label="SMTP Port">
          <TextInput value={num('smtp_port')} onChange={v => set('smtp_port')(Number(v))} />
        </Field>
        <Field label="SMTP User">
          <TextInput value={str('smtp_user')} onChange={set('smtp_user')} />
        </Field>
        <Field label="SMTP Password">
          <TextInput value={str('smtp_password')} onChange={set('smtp_password')} type="password" placeholder="••••••••••••" />
        </Field>
        <Field label="From Address">
          <TextInput value={str('smtp_from')} onChange={set('smtp_from')} type="email" />
        </Field>
        <Field label="TLS">
          <Toggle value={bool('smtp_tls')} onChange={set('smtp_tls')} label="Require TLS (STARTTLS)" />
        </Field>
        <div className="pt-2">
          <button
            onClick={handleTestEmail}
            className="rounded-xl border border-[#D6EFF4] px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
            style={{ color: testEmailSent ? '#059669' : '#33ABC3' }}
          >
            {testEmailSent ? <><CheckCircle2 size={14} /> Email sent!</> : 'Send test email'}
          </button>
        </div>
      </Section>

      {/* ── Regional ── */}
      <Section
        title={<><Globe size={14} className="text-[#33ABC3]" /> Regional Defaults</>}
        description="Default locale settings for new hospitals"
      >
        <Field label="Default Timezone">
          <SelectInput value={str('default_timezone')} onChange={set('default_timezone')}>
            <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST +04:00)</option>
            <option value="UTC">UTC</option>
          </SelectInput>
        </Field>
        <Field label="Default Currency">
          <SelectInput value={str('default_currency')} onChange={set('default_currency')}>
            <option value="INR">INR — Indian Rupee</option>
            <option value="USD">USD — US Dollar</option>
            <option value="AED">AED — UAE Dirham</option>
          </SelectInput>
        </Field>
        <Field label="Date Format">
          <SelectInput value={str('date_format')} onChange={set('date_format')}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </SelectInput>
        </Field>
      </Section>

      {/* ── Maintenance ── */}
      <Section
        title={<><Database size={14} className="text-[#33ABC3]" /> Maintenance</>}
        description="System-level controls"
      >
        <Field label="Maintenance Mode" hint="Prevents hospital logins, shows a maintenance page">
          <Toggle value={bool('maintenance_mode')} onChange={set('maintenance_mode')} label="Enable maintenance mode" />
        </Field>
        <Field label="API Rate Limit" hint="Requests per minute per hospital">
          <TextInput value={num('api_rate_limit')} onChange={v => set('api_rate_limit')(Number(v))} />
        </Field>
        <Field label="Audit Log Retention (days)">
          <TextInput value={num('audit_log_retention_days')} onChange={v => set('audit_log_retention_days')(Number(v))} />
        </Field>
        <Field label="Auto-suspend on expiry">
          <Toggle value={bool('auto_suspend_on_expiry')} onChange={set('auto_suspend_on_expiry')} label="Suspend hospital when subscription expires" />
        </Field>
        <div className="pt-2 flex gap-3">
          <button className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-100 transition-colors">
            Clear cache
          </button>
          <button className="rounded-xl border border-[#D6EFF4] px-4 py-2 text-sm text-[#4A7C87] font-medium hover:bg-[#F4FAFB] transition-colors flex items-center gap-1.5">
            <KeyRound size={14} /> Rotate API secret
          </button>
        </div>
      </Section>

    </div>
  );
}