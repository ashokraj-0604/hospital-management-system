'use client';

import React, { useMemo, useState } from 'react';
import { Package, UserPlus } from 'lucide-react';
import { useInventoryManagers } from './useInventoryManager';
import { getApiErrorMessage } from '@/src/lib/api-error';
import { BRAND } from '@/src/constants/brand.constants';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';

export default function InventoryManagersPage() {
  const { inventoryManagers, isLoading, error, addInventoryManager } = useInventoryManagers();
  const [search, setSearch] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    warehouse_location: '',
    experience_years: '',
    phone: '',
  });

  const filteredInventoryManagers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return inventoryManagers;

    return inventoryManagers.filter((manager) =>
      [manager.name, manager.email, manager.department, manager.warehouse_location]
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [inventoryManagers, search]);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      department: '',
      warehouse_location: '',
      experience_years: '',
      phone: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await addInventoryManager({
        ...form,
        experience_years: form.experience_years ? Number(form.experience_years) : 0,
      });
      setShowPanel(false);
      resetForm();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Unable to add inventory manager.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Inventory Managers</h1>
          <p className="text-sm" style={{ color: BRAND.colors.textLight }}>{inventoryManagers.length} inventory managers</p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={() => setShowPanel(true)}>Add Inventory Manager</Button>
      </div>

      {error && <Alert variant="error" message={error} />}

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, department, warehouse..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredInventoryManagers.length === 0 ? (
          <EmptyState icon={Package} message="No inventory managers found." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Warehouse Location</th>
                <th className="px-5 py-3 font-medium">Experience</th>
                <th className="px-5 py-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventoryManagers.map((manager) => (
                <tr key={manager.inventory_manager_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.textDark }}>{manager.name}</td>
                  <td className="px-5 py-3">{manager.email}</td>
                  <td className="px-5 py-3">{manager.department}</td>
                  <td className="px-5 py-3">{manager.warehouse_location}</td>
                  <td className="px-5 py-3">{manager.experience_years} yrs</td>
                  <td className="px-5 py-3">{manager.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {showPanel && (
        <SlideOverPanel title="Add Inventory Manager" onClose={() => setShowPanel(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}
            <Input required label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input required type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input required type="password" label="Set login password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input required label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <Input required label="Warehouse Location" placeholder="e.g. Central Store, Block B" value={form.warehouse_location} onChange={(e) => setForm({ ...form, warehouse_location: e.target.value })} />
            <Input type="number" min={0} label="Years of experience" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
            <Input required label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" fullWidth isLoading={isSubmitting}>Create Inventory Manager</Button>
          </form>
        </SlideOverPanel>
      )}
    </div>
  );
}