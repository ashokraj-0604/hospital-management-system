'use client';

import { useState } from 'react';
import { usePatients } from '@/src/hooks/hospital/useHospital';
import { RegisterPatientModal } from '@/src/components/hospital/RegisterPatientModal';
import { Search, UserPlus, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Patient } from '@/src/types/hospitals';

function PatientBadge({ status }: { status: Patient['status'] }) {
  const map = {
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    DISCHARGED: 'bg-gray-100 text-gray-600',
    DECEASED: 'bg-red-50 text-red-600',
  };
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', map[status])}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function calculateAge(dob: string) {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function PatientsPage() {
  const { patients, loading, search, handleSearch, registerPatient } = usePatients();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500">{patients.length} registered patients</p>
        </div>
        <button
          onClick={() => setShowRegister(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm"
          style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}
        >
          <UserPlus className="h-4 w-4" />
          Register Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, MRN, or phone…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-[var(--color-primary,#33ABC3)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary,#33ABC3)_15%,transparent)]"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Patient</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">MRN</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Age / Gender</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Phone</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Blood</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Last Visit</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-gray-100 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                  No patients found. {search && 'Try a different search.'}
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedPatient(p)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{p.firstName} {p.lastName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.mrn}</td>
                  <td className="px-4 py-3 text-gray-600">{calculateAge(p.dateOfBirth)} y · {p.gender.charAt(0)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                  <td className="px-4 py-3">
                    {p.bloodGroup ? (
                      <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">{p.bloodGroup}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><PatientBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Detail Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSelectedPatient(null)} />
          <div className="relative z-50 w-96 bg-white shadow-xl h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between px-5 py-4">
              <h2 className="font-semibold text-gray-900">Patient Details</h2>
              <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-white text-lg font-bold"
                  style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}>
                  {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                  <p className="text-sm text-gray-500 font-mono">{selectedPatient.mrn}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Date of Birth', new Date(selectedPatient.dateOfBirth).toLocaleDateString('en-IN')],
                  ['Age', `${calculateAge(selectedPatient.dateOfBirth)} years`],
                  ['Gender', selectedPatient.gender.charAt(0) + selectedPatient.gender.slice(1).toLowerCase()],
                  ['Blood Group', selectedPatient.bloodGroup || 'Unknown'],
                  ['Phone', selectedPatient.phone],
                  ['Email', selectedPatient.email || '—'],
                  ['City', selectedPatient.city],
                  ['Status', selectedPatient.status],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{k}</p>
                    <p className="mt-0.5 font-medium text-gray-700">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Address</p>
                <p className="text-sm text-gray-700">{selectedPatient.address}, {selectedPatient.city}</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3">
                <p className="text-xs font-medium text-orange-700 uppercase tracking-wide mb-1">Emergency Contact</p>
                <p className="text-sm font-medium text-orange-900">{selectedPatient.emergencyContactName}</p>
                <p className="text-sm text-orange-700">{selectedPatient.emergencyContactPhone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegister && (
        <RegisterPatientModal
          onClose={() => setShowRegister(false)}
          onSubmit={registerPatient}
        />
      )}
    </div>
  );
}