'use client';

import React, { useState } from 'react';
import { X, Building2, MapPin, CreditCard, UserCircle, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getApiErrorMessage } from '@/src/lib/api-error';
import { SUBSCRIPTION_TIERS } from '@/src/constants/brand.constants';
import { Alert } from '@/src/components/ui/Alert';
import type { AddHospitalFormValues } from '@/src/types/super-admin.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULES = [
  { key: 'OPD',       label: 'OPD Management' },
  { key: 'IPD',       label: 'IPD / Inpatient' },
  { key: 'PHARMACY',  label: 'Pharmacy' },
  { key: 'LAB',       label: 'Laboratory' },
  { key: 'RADIOLOGY', label: 'Radiology' },
  { key: 'BILLING',   label: 'Billing & Finance' },
  { key: 'INVENTORY', label: 'Inventory' },
  { key: 'HR',        label: 'HR & Payroll' },
];

const STEPS = [
  { label: 'Hospital Info',    icon: Building2  },
  { label: 'Contact & Address',icon: MapPin     },
  { label: 'Subscription',     icon: CreditCard },
  { label: 'Admin Account',    icon: UserCircle },
];

const EMPTY: AddHospitalFormValues = {
  hospital_name: '', hospital_code: '', legal_entity_name: '', gstin: '', registration_no: '',
  address: '', city: '', state: '', pincode: '', primary_phone: '', primary_email: '', website_url: '',
  subscription_plan: 'BASIC', subscription_expires_at: '', mrn_prefix: '', total_beds: 0,
  modules: ['OPD', 'BILLING'],
  admin_name: '', admin_email: '', admin_password: '',
  primary_color: '#33ABC3', secondary_color: '#0D6778', app_name: '',
};

// ─── Small helpers ────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#4A7C87] mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function TInput({ field, form, setForm, placeholder, type = 'text', required }:
  { field: keyof AddHospitalFormValues; form: AddHospitalFormValues; setForm: React.Dispatch<React.SetStateAction<AddHospitalFormValues>>; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      value={String(form[field])}
      onChange={e => setForm(prev => ({ ...prev, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
      className="w-full rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] placeholder-[#8AACB3] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30 focus:border-[#33ABC3] transition-all"
    />
  );
}

// ─── AddHospitalModal ─────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddHospitalFormValues) => Promise<void>;
}

export const AddHospitalModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<AddHospitalFormValues>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  if (!open) return null;

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
      setDone(true);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Unable to create hospital. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(0);
    setForm(EMPTY);
    setDone(false);
    setError(null);
    onClose();
  };

  const toggleModule = (key: string) => {
    setForm(prev => ({
      ...prev,
      modules: prev.modules.includes(key)
        ? prev.modules.filter(m => m !== key)
        : [...prev.modules, key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6EFF4] shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#0D2F36]">Onboard New Hospital</h2>
            <p className="text-xs text-[#8AACB3] mt-0.5">Step {step + 1} of 4 — {STEPS[step].label}</p>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-[#8AACB3] hover:bg-[#F4FAFB] hover:text-[#0D2F36] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex border-b border-[#D6EFF4] shrink-0">
          {STEPS.map(({ label, icon: Icon }, i) => (
            <div key={i} className={cn('flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
              i === step ? 'text-[#33ABC3] border-b-2 border-[#33ABC3]' :
              i < step   ? 'text-emerald-600' : 'text-[#8AACB3]')}>
              <Icon size={16} />
              <span className="hidden sm:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && !done && (
            <Alert
              variant="error"
              title="Could not create hospital"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}

          {/* ── Success screen ─────────────────────────────────────────────── */}
          {done ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Check size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-[#0D2F36]">Hospital Onboarded!</h3>
              <p className="text-sm text-[#4A7C87] max-w-sm">
                <strong>{form.hospital_name}</strong> has been created. The admin account for{' '}
                <strong>{form.admin_email}</strong> is ready to use.
              </p>
              <button onClick={handleClose}
                className="mt-2 rounded-xl bg-[#33ABC3] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1D8FA8] transition-colors">
                Done
              </button>
            </div>

          ) : step === 0 ? (
            /* ── Step 1: Hospital Info ──────────────────────────────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label required>Hospital Name</Label>
                <TInput field="hospital_name" form={form} setForm={setForm} placeholder="Apollo Hospitals Chennai" required />
              </div>
              <div>
                <Label required>Hospital Code</Label>
                <TInput field="hospital_code" form={form} setForm={setForm} placeholder="APOLLO-CHN" required />
                <p className="text-[10px] text-[#8AACB3] mt-1">Unique short identifier (no spaces)</p>
              </div>
              <div>
                <Label required>MRN Prefix</Label>
                <TInput field="mrn_prefix" form={form} setForm={setForm} placeholder="APL" required />
                <p className="text-[10px] text-[#8AACB3] mt-1">Prefix for patient record numbers</p>
              </div>
              <div className="sm:col-span-2">
                <Label>Legal Entity Name</Label>
                <TInput field="legal_entity_name" form={form} setForm={setForm} placeholder="Apollo Hospitals Enterprise Ltd." />
              </div>
              <div>
                <Label>GSTIN</Label>
                <TInput field="gstin" form={form} setForm={setForm} placeholder="29AABCA1234A1Z5" />
              </div>
              <div>
                <Label>Registration No.</Label>
                <TInput field="registration_no" form={form} setForm={setForm} placeholder="MH/2024/12345" />
              </div>
              <div>
                <Label>Total Beds</Label>
                <TInput field="total_beds" form={form} setForm={setForm} type="number" placeholder="250" />
              </div>
              <div>
                <Label>App Name</Label>
                <TInput field="app_name" form={form} setForm={setForm} placeholder="Apollo HMS" />
                <p className="text-[10px] text-[#8AACB3] mt-1">Shown in the hospital&apos;s login portal</p>
              </div>
              <div>
                <Label>Brand Primary Color</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.primary_color}
                    onChange={e => setForm(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="h-10 w-16 cursor-pointer rounded-lg border border-[#D6EFF4] p-1" />
                  <input value={form.primary_color}
                    onChange={e => setForm(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="flex-1 rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30" />
                </div>
              </div>
              <div>
                <Label>Secondary Color</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.secondary_color}
                    onChange={e => setForm(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="h-10 w-16 cursor-pointer rounded-lg border border-[#D6EFF4] p-1" />
                  <input value={form.secondary_color}
                    onChange={e => setForm(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="flex-1 rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] px-4 py-2.5 text-sm text-[#0D2F36] focus:outline-none focus:ring-2 focus:ring-[#33ABC3]/30" />
                </div>
              </div>
            </div>

          ) : step === 1 ? (
            /* ── Step 2: Contact & Address ──────────────────────────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label required>Street Address</Label>
                <TInput field="address" form={form} setForm={setForm} placeholder="21 Greams Lane, Thousand Lights" required />
              </div>
              <div>
                <Label required>City</Label>
                <TInput field="city" form={form} setForm={setForm} placeholder="Chennai" required />
              </div>
              <div>
                <Label required>State</Label>
                <TInput field="state" form={form} setForm={setForm} placeholder="Tamil Nadu" required />
              </div>
              <div>
                <Label required>Pincode</Label>
                <TInput field="pincode" form={form} setForm={setForm} placeholder="600006" required />
              </div>
              <div>
                <Label required>Primary Phone</Label>
                <TInput field="primary_phone" form={form} setForm={setForm} placeholder="+91 44 2829 0200" required />
              </div>
              <div className="sm:col-span-2">
                <Label required>Primary Email</Label>
                <TInput field="primary_email" form={form} setForm={setForm} type="email" placeholder="info@hospital.com" required />
              </div>
              <div className="sm:col-span-2">
                <Label>Website URL</Label>
                <TInput field="website_url" form={form} setForm={setForm} placeholder="https://www.hospital.com" />
              </div>
            </div>

          ) : step === 2 ? (
            /* ── Step 3: Subscription & Modules ────────────────────────── */
            <div className="space-y-5">
              <div>
                <Label required>Subscription Plan</Label>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {SUBSCRIPTION_TIERS.map(plan => (
                    <button key={plan} type="button"
                      onClick={() => setForm(prev => ({ ...prev, subscription_plan: plan }))}
                      className={cn('rounded-xl border-2 p-4 text-sm font-semibold transition-all',
                        form.subscription_plan === plan
                          ? 'border-[#33ABC3] bg-[#E8F8FB] text-[#33ABC3]'
                          : 'border-[#D6EFF4] text-[#8AACB3] hover:border-[#33ABC3]/40')}>
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Subscription Expires At</Label>
                <TInput field="subscription_expires_at" form={form} setForm={setForm} type="date" />
              </div>
              <div>
                <Label>Enabled Modules</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {MODULES.map(({ key, label }) => {
                    const active = form.modules.includes(key);
                    return (
                      <button key={key} type="button" onClick={() => toggleModule(key)}
                        className={cn('flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm text-left transition-all',
                          active ? 'border-[#33ABC3] bg-[#E8F8FB] text-[#0D2F36]' : 'border-[#D6EFF4] text-[#8AACB3] hover:border-[#33ABC3]/40')}>
                        <div className={cn('h-4 w-4 rounded shrink-0 border flex items-center justify-center',
                          active ? 'bg-[#33ABC3] border-[#33ABC3]' : 'border-[#D6EFF4]')}>
                          {active && <Check size={10} className="text-white" />}
                        </div>
                        {label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#8AACB3] mt-2">{form.modules.length} modules selected</p>
              </div>
            </div>

          ) : (
            /* ── Step 4: Admin Account ──────────────────────────────────── */
            <div className="space-y-4">
              <div className="rounded-xl bg-[#E8F8FB] border border-[#33ABC3]/20 px-4 py-3 text-xs text-[#4A7C87]">
                This creates the first <strong>HOSPITAL_ADMIN</strong> account. They can then create other staff accounts.
              </div>
              <div>
                <Label required>Full Name</Label>
                <TInput field="admin_name" form={form} setForm={setForm} placeholder="Dr. Ravi Kumar" required />
              </div>
              <div>
                <Label required>Email Address</Label>
                <TInput field="admin_email" form={form} setForm={setForm} type="email" placeholder="admin@hospital.com" required />
              </div>
              <div>
                <Label required>Temporary Password</Label>
                <TInput field="admin_password" form={form} setForm={setForm} type="password" placeholder="Min 8 chars, upper, number, special" required />
                <p className="text-[10px] text-[#8AACB3] mt-1">Admin will be asked to change on first login</p>
              </div>

              {/* Summary preview */}
              <div className="mt-4 rounded-xl border border-[#D6EFF4] bg-[#F4FAFB] p-4 space-y-2">
                <p className="text-xs font-semibold text-[#0D2F36] mb-2">Review Summary</p>
                {[
                  ['Hospital',  form.hospital_name  || '—'],
                  ['Code',      form.hospital_code  || '—'],
                  ['City',      form.city            || '—'],
                  ['Plan',      form.subscription_plan],
                  ['Modules',   `${form.modules.length} enabled`],
                  ['Admin',     form.admin_email     || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-[#8AACB3]">{k}</span>
                    <span className="font-medium text-[#0D2F36]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#D6EFF4] bg-[#F4FAFB] shrink-0">
            <button onClick={back} disabled={step === 0}
              className="rounded-xl border border-[#D6EFF4] bg-white px-4 py-2 text-sm font-medium text-[#4A7C87] disabled:opacity-40 hover:bg-white/80 transition-colors">
              Back
            </button>
            <div className="flex items-center gap-1">
              {STEPS.map((_, i) => (
                <span key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-5 bg-[#33ABC3]' : i < step ? 'w-1.5 bg-emerald-400' : 'w-1.5 bg-[#D6EFF4]')} />
              ))}
            </div>
            {step < 3 ? (
              <button onClick={next}
                className="flex items-center gap-1.5 rounded-xl bg-[#33ABC3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D8FA8] transition-colors">
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-1.5 rounded-xl bg-[#33ABC3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D8FA8] disabled:opacity-60 transition-colors">
                {loading ? 'Creating…' : 'Create Hospital'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
