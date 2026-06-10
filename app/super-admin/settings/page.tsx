'use client';

import React, { useState } from 'react';
import { Save, Shield, Bell, Globe, Database, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { BRAND } from '@/src/constants/brand.constants';
import { cn } from '@/src/lib/utils';

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-[#D6EFF4] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#D6EFF4] bg-[#F4FAFB]">
        <h2 className="text-sm font-semibold text-[#0D2F36]">{title}</h2>
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

function TextInput({ defaultValue, placeholder, type = 'text' }: { defaultValue?: string; placeholder?: string; type?: string }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="relative">
      <input
        type={isPassword && show ? 'text' : type}
        defaultValue={defaultValue}
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

function Toggle({ defaultChecked, label }: { defaultChecked?: boolean; label?: string }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setOn(v => !v)}
        className={cn('relative h-5 w-9 rounded-full transition-colors duration-200', on ? 'bg-[#33ABC3]' : 'bg-[#D6EFF4]')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200', on ? 'left-4' : 'left-0.5')} />
      </button>
      {label && <span className="text-sm text-[#4A7C87]">{label}</span>}
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-[900px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2F36]">Platform Settings</h1>
          <p className="text-sm text-[#8AACB3] mt-0.5">Global configuration for the {BRAND.name} platform</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#33ABC3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D8FA8] shadow-sm transition-colors">
          <Save size={15} /> Save Changes
        </button>
      </div>

      {/* ── Platform Identity ──────────────────────────────────────────────── */}
      <Section title="Platform Identity" description="Branding shown to hospital admins on the super admin portal">
        <Field label="Platform Name">
          <TextInput defaultValue={BRAND.name} />
        </Field>
        <Field label="Support Email" hint="Shown on login page">
          <TextInput defaultValue="support@medsocio.com" type="email" />
        </Field>
        <Field label="Support Phone">
          <TextInput defaultValue="+91 1800 000 0000" />
        </Field>
        <Field label="Primary Brand Color" hint="Used across the platform UI">
          <div className="flex items-center gap-3">
            <input type="color" defaultValue={BRAND.colors.primary}
              className="h-10 w-16 cursor-pointer rounded-lg border border-[#D6EFF4] p-1" />
            <TextInput defaultValue={BRAND.colors.primary} />
          </div>
        </Field>
      </Section>

      {/* ── Security ──────────────────────────────────────────────────────── */}
      <Section
        title={<span className="flex items-center gap-2"><Shield size={14} className="text-[#33ABC3]" />Security</span> as unknown as string}
        description="Authentication and access control policies"
      >
        <Field label="Enforce MFA" hint="Require all super admins to use 2FA">
          <Toggle defaultChecked={true} label="Mandatory for super admin accounts" />
        </Field>
        <Field label="Session Timeout" hint="Auto-logout after inactivity">
          <select className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30">
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option selected>60 minutes</option>
            <option>4 hours</option>
          </select>
        </Field>
        <Field label="Max Login Attempts" hint="Locks account after N failures">
          <TextInput defaultValue="5" />
        </Field>
        <Field label="Lockout Duration (min)">
          <TextInput defaultValue="30" />
        </Field>
        <Field label="Password Policy">
          <div className="space-y-2">
            {[
              { label: 'Min 8 characters', checked: true },
              { label: 'Require uppercase letter', checked: true },
              { label: 'Require number', checked: true },
              { label: 'Require special character', checked: true },
              { label: 'Prevent last 5 passwords', checked: false },
            ].map(({ label, checked }) => (
              <Toggle key={label} defaultChecked={checked} label={label} />
            ))}
          </div>
        </Field>
      </Section>

      {/* ── Notifications ──────────────────────────────────────────────────── */}
      <Section
        title={<span className="flex items-center gap-2"><Bell size={14} className="text-[#33ABC3]" />Notifications</span> as unknown as string}
        description="When to alert the super admin team"
      >
        {[
          { label: 'New hospital onboarded',         checked: true },
          { label: 'Subscription expiring in 7 days', checked: true },
          { label: 'Payment overdue',                 checked: true },
          { label: 'Hospital suspended',              checked: true },
          { label: 'Failed login attempts (≥5)',      checked: false },
          { label: 'Daily summary email',             checked: false },
        ].map(({ label, checked }) => (
          <Field key={label} label={label}>
            <Toggle defaultChecked={checked} />
          </Field>
        ))}
      </Section>

      {/* ── Email / SMTP ───────────────────────────────────────────────────── */}
      <Section
        title={<span className="flex items-center gap-2"><Mail size={14} className="text-[#33ABC3]" />Email / SMTP</span> as unknown as string}
        description="Outgoing mail configuration for system emails"
      >
        <Field label="SMTP Host">
          <TextInput defaultValue="smtp.sendgrid.net" />
        </Field>
        <Field label="SMTP Port">
          <TextInput defaultValue="587" />
        </Field>
        <Field label="SMTP User">
          <TextInput defaultValue="apikey" />
        </Field>
        <Field label="SMTP Password">
          <TextInput type="password" placeholder="••••••••••••" />
        </Field>
        <Field label="From Address">
          <TextInput defaultValue="noreply@medsocio.com" type="email" />
        </Field>
        <Field label="TLS">
          <Toggle defaultChecked={true} label="Require TLS (STARTTLS)" />
        </Field>
        <div className="pt-2">
          <button className="rounded-xl border border-[#D6EFF4] px-4 py-2 text-sm text-[#33ABC3] font-medium hover:bg-[#E8F8FB] transition-colors">
            Send test email
          </button>
        </div>
      </Section>

      {/* ── Regional ──────────────────────────────────────────────────────── */}
      <Section
        title={<span className="flex items-center gap-2"><Globe size={14} className="text-[#33ABC3]" />Regional Defaults</span> as unknown as string}
        description="Default locale settings for new hospitals"
      >
        <Field label="Default Timezone">
          <select className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 w-full">
            <option selected>Asia/Kolkata (IST +05:30)</option>
            <option>Asia/Dubai (GST +04:00)</option>
            <option>UTC</option>
          </select>
        </Field>
        <Field label="Default Currency">
          <select className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 w-full">
            <option selected>INR — Indian Rupee</option>
            <option>USD — US Dollar</option>
            <option>AED — UAE Dirham</option>
          </select>
        </Field>
        <Field label="Date Format">
          <select className="rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 w-full">
            <option selected>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
      </Section>

      {/* ── Maintenance ───────────────────────────────────────────────────── */}
      <Section
        title={<span className="flex items-center gap-2"><Database size={14} className="text-[#33ABC3]" />Maintenance</span> as unknown as string}
        description="System-level controls"
      >
        <Field label="Maintenance Mode" hint="Prevents hospital logins, shows a maintenance page">
          <Toggle defaultChecked={false} label="Enable maintenance mode" />
        </Field>
        <Field label="API Rate Limit" hint="Requests per minute per hospital">
          <TextInput defaultValue="300" />
        </Field>
        <Field label="Audit Log Retention (days)">
          <TextInput defaultValue="90" />
        </Field>
        <Field label="Auto-suspend on expiry">
          <Toggle defaultChecked={true} label="Suspend hospital when subscription expires" />
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