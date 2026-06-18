'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Users, Building2, Save } from 'lucide-react';

const TABS = [
  { id: 'hospital', label: 'Hospital Info', icon: Building2 },
  { id: 'staff', label: 'Staff & Roles', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function HospitalSettingsPage() {
  const [activeTab, setActiveTab] = useState('hospital');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage hospital configuration and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${
                activeTab === id ? 'text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === id ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 rounded-xl border bg-white shadow-sm p-6 space-y-5">
          {activeTab === 'hospital' && (
            <>
              <h2 className="font-semibold text-gray-900">Hospital Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Hospital Name', placeholder: 'City General Hospital' },
                  { label: 'Registration Number', placeholder: 'MH-2018-00123' },
                  { label: 'MRN Prefix', placeholder: 'MRN' },
                  { label: 'GSTIN', placeholder: '27AABC...' },
                  { label: 'Contact Phone', placeholder: '044-1234-5678' },
                  { label: 'Contact Email', placeholder: 'info@hospital.com' },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary,#33ABC3)]"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary,#33ABC3)] resize-none"
                  placeholder="Full hospital address"
                />
              </div>
            </>
          )}

          {activeTab === 'staff' && (
            <>
              <h2 className="font-semibold text-gray-900">Staff & Role Management</h2>
              <p className="text-sm text-gray-500">Role-based access control for hospital staff members.</p>
              <div className="rounded-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3 text-left font-medium">Role</th>
                      <th className="px-4 py-3 text-left font-medium">Access Areas</th>
                      <th className="px-4 py-3 text-left font-medium">Users</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { role: 'Hospital Admin', areas: 'All modules', users: 2 },
                      { role: 'Doctor', areas: 'OPD, IPD, Lab orders, Prescriptions', users: 8 },
                      { role: 'Nurse', areas: 'IPD, Vitals, Lab collection', users: 15 },
                      { role: 'Receptionist', areas: 'Patients, Appointments, Billing', users: 4 },
                      { role: 'Pharmacist', areas: 'Pharmacy, Drug inventory', users: 3 },
                      { role: 'Lab Technician', areas: 'Laboratory', users: 4 },
                    ].map(({ role, areas, users }) => (
                      <tr key={role} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{role}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{areas}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{users}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { label: 'Abnormal Lab Results', desc: 'Alert doctors when abnormal values are reported' },
                  { label: 'ICU Alerts', desc: 'Critical notifications for ICU patient changes' },
                  { label: 'Appointment Reminders', desc: 'SMS reminders to patients 1 hour before appointment' },
                  { label: 'Bed Availability', desc: 'Notify when bed occupancy exceeds 90%' },
                  { label: 'Payment Due', desc: 'Alert accounts when bills are overdue by 7 days' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-[var(--color-primary,#33ABC3)] transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <h2 className="font-semibold text-gray-900">Security Settings</h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                  <p className="text-xs text-gray-400 mb-3 mt-0.5">Automatically log out inactive users</p>
                  <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary,#33ABC3)]">
                    <option>15 minutes</option>
                    <option defaultValue="30 minutes">30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                  </select>
                </div>
                <div className="rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400 mt-0.5">Require MFA for all admin accounts</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-[var(--color-primary,#33ABC3)] transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                  </label>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-sm font-medium text-gray-900">Audit Log Retention</p>
                  <p className="text-xs text-gray-400 mb-3 mt-0.5">How long to keep security audit logs</p>
                  <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary,#33ABC3)]">
                    <option>3 months</option>
                    <option>6 months</option>
                    <option selected>1 year</option>
                    <option>3 years</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}