'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pill, UploadCloud } from 'lucide-react';
import { pharmacyApi, Medicine } from './pharmacy.api';
import { inventoryApi } from '../inventory/inventory.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

interface PurchaseRow {
  medicine_id: string; medicine_name: string; category_name: string;
  batch_no: string; expiry_month: string; mrp: string; batch_amount: string;
  sale_price: string; packing_qty: string; quantity: string; purchase_price: string; tax_percent: string;
}

const EMPTY_ROW: PurchaseRow = {
  medicine_id: '', medicine_name: '', category_name: '', batch_no: '', expiry_month: '',
  mrp: '', batch_amount: '', sale_price: '', packing_qty: '', quantity: '', purchase_price: '', tax_percent: '',
};

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [medForm, setMedForm] = useState({
    name: '', category_id: '', company_id: '', composition: '', group_id: '', unit_id: '',
    min_level: '', reorder_level: '', tax_percent: '', box_packing: '', vat_ac: '', rack_number: '', note: '',
  });
  const [medPhoto, setMedPhoto] = useState<File | null>(null);

  const [purchaseHeader, setPurchaseHeader] = useState({ supplier_id: '', bill_no: '', purchase_date: new Date().toISOString().slice(0, 16), note: '' });
  const [purchaseRows, setPurchaseRows] = useState<PurchaseRow[]>([{ ...EMPTY_ROW }]);
  const [purchaseDoc, setPurchaseDoc] = useState<File | null>(null);
  const [discount, setDiscount] = useState('0');
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  const [newCategory, setNewCategory] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const fetchMedicines = async () => {
    setIsLoading(true);
    setMedicines(await pharmacyApi.getMedicines(search || undefined));
    setIsLoading(false);
  };

  const fetchMasterData = async () => {
    const [c, co, g, u, s] = await Promise.all([
      pharmacyApi.getCategories(), pharmacyApi.getCompanies(), pharmacyApi.getGroups(),
      pharmacyApi.getUnits(), inventoryApi.getSuppliers(),
    ]);
    setCategories(c); setCompanies(co); setGroups(g); setUnits(u); setSuppliers(s);
  };

  useEffect(() => { fetchMedicines(); }, [search]);
  useEffect(() => { fetchMasterData(); }, []);

  const openAddMedicine = () => {
    setSubmitError(null);
    setMedForm({ name: '', category_id: '', company_id: '', composition: '', group_id: '', unit_id: '', min_level: '', reorder_level: '', tax_percent: '', box_packing: '', vat_ac: '', rack_number: '', note: '' });
    setMedPhoto(null);
    setShowAddMedicine(true);
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!medForm.name || !medForm.category_id || !medForm.unit_id || !medForm.box_packing) {
      setSubmitError('Please fill all required fields.'); return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(medForm).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (medPhoto) fd.append('photo', medPhoto);
      await pharmacyApi.createMedicine(fd);
      setShowAddMedicine(false);
      await fetchMedicines();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to add medicine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    await pharmacyApi.deleteMedicine(id);
    await fetchMedicines();
  };

  // ── Purchase row helpers ──
  const updateRow = (i: number, field: keyof PurchaseRow, value: string) => {
    const rows = [...purchaseRows];
    rows[i] = { ...rows[i], [field]: value };
    if (field === 'medicine_id') {
      const med = medicines.find((m) => m.medicine_id === value);
      if (med) {
        rows[i].medicine_name = med.name;
        rows[i].category_name = med.category_name ?? '';
        rows[i].tax_percent = med.category_id ? rows[i].tax_percent : rows[i].tax_percent;
      }
    }
    setPurchaseRows(rows);
  };
  const addRow = () => setPurchaseRows([...purchaseRows, { ...EMPTY_ROW }]);
  const removeRow = (i: number) => setPurchaseRows(purchaseRows.filter((_, idx) => idx !== i));

  const rowAmount = (row: PurchaseRow) => {
    const qty = Number(row.quantity) || 0;
    const price = Number(row.purchase_price) || 0;
    const tax = Number(row.tax_percent) || 0;
    const base = qty * price;
    return base + base * (tax / 100);
  };
  const subtotal = purchaseRows.reduce((sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.purchase_price) || 0), 0);
  const taxTotal = purchaseRows.reduce((sum, r) => {
    const base = (Number(r.quantity) || 0) * (Number(r.purchase_price) || 0);
    return sum + base * ((Number(r.tax_percent) || 0) / 100);
  }, 0);
  const netAmount = subtotal - (Number(discount) || 0) + taxTotal;

  const openPurchase = () => {
    setSubmitError(null);
    setPurchaseHeader({ supplier_id: '', bill_no: '', purchase_date: new Date().toISOString().slice(0, 16), note: '' });
    setPurchaseRows([{ ...EMPTY_ROW }]);
    setPurchaseDoc(null);
    setDiscount('0');
    setPaymentMode(''); setPaymentAmount(''); setPaymentNote('');
    setShowPurchase(true);
  };

  const handleSubmitPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const validRows = purchaseRows.filter((r) => r.medicine_id && r.batch_no && r.quantity && r.purchase_price);
    if (validRows.length === 0) { setSubmitError('Add at least one complete medicine line.'); return; }

    setIsSubmitting(true);
    try {
      const supplier = suppliers.find((s: any) => s.supplier_id === purchaseHeader.supplier_id);
      const fd = new FormData();
      fd.append('supplier_id', purchaseHeader.supplier_id);
      fd.append('supplier_name', supplier?.name ?? '');
      fd.append('bill_no', purchaseHeader.bill_no);
      fd.append('purchase_date', purchaseHeader.purchase_date);
      fd.append('note', purchaseHeader.note);
      fd.append('discount_amount', discount || '0');
      fd.append('payment_mode', paymentMode);
      fd.append('payment_amount', paymentAmount);
      fd.append('payment_note', paymentNote);
      fd.append('items', JSON.stringify(validRows.map((r) => ({
        medicine_id: r.medicine_id, medicine_name: r.medicine_name, category_name: r.category_name,
        batch_no: r.batch_no, expiry_month: r.expiry_month, mrp: Number(r.mrp) || 0,
        batch_amount: r.batch_amount ? Number(r.batch_amount) : undefined, sale_price: Number(r.sale_price) || 0,
        packing_qty: r.packing_qty ? Number(r.packing_qty) : undefined, quantity: Number(r.quantity),
        purchase_price: Number(r.purchase_price), tax_percent: Number(r.tax_percent) || 0,
      }))));
      if (purchaseDoc) fd.append('document', purchaseDoc);

      await pharmacyApi.createPurchase(fd);
      setShowPurchase(false);
      await fetchMedicines();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to save purchase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1500px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Medicines Stock</h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => setShowSetup(true)}>Manage Categories / Companies / Groups / Units</Button>
          <Button leftIcon={<Plus size={16} />} onClick={openAddMedicine}>Add Medicine</Button>
          <Button leftIcon={<UploadCloud size={16} />} onClick={openPurchase}>Purchase</Button>
        </div>
      </div>

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search medicine..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : medicines.length === 0 ? (
          <EmptyState icon={Pill} message="No medicines added yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Medicine Name</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Composition</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Group</th>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Available Qty</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m.medicine_id} className="border-b last:border-b-0" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.primary }}>{m.name}</td>
                  <td className="px-5 py-3">{m.company_name ?? '—'}</td>
                  <td className="px-5 py-3" style={{ color: BRAND.colors.textMid }}>{m.composition ?? '—'}</td>
                  <td className="px-5 py-3">{m.category_name}</td>
                  <td className="px-5 py-3">{m.group_name ?? '—'}</td>
                  <td className="px-5 py-3">{m.unit_name}</td>
                  <td className="px-5 py-3 font-medium">{m.available_qty}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDeleteMedicine(m.medicine_id)} className="text-red-500"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {/* Add Medicine Details */}
      {showAddMedicine && (
        <SlideOverPanel title="Add Medicine Details" onClose={() => setShowAddMedicine(false)} width={640}>
          <form onSubmit={handleAddMedicine} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}

            <div className="grid grid-cols-2 gap-3">
              <Input required label="Medicine Name *" value={medForm.name} onChange={(e) => setMedForm({ ...medForm, name: e.target.value })} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Medicine Category *</label>
                <select required value={medForm.category_id} onChange={(e) => setMedForm({ ...medForm, category_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {categories.map((c: any) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Medicine Company</label>
                <select value={medForm.company_id} onChange={(e) => setMedForm({ ...medForm, company_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {companies.map((c: any) => <option key={c.company_id} value={c.company_id}>{c.name}</option>)}
                </select>
              </div>
              <Input label="Medicine Composition" value={medForm.composition} onChange={(e) => setMedForm({ ...medForm, composition: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Medicine Group</label>
                <select value={medForm.group_id} onChange={(e) => setMedForm({ ...medForm, group_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {groups.map((g: any) => <option key={g.group_id} value={g.group_id}>{g.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Unit *</label>
                <select required value={medForm.unit_id} onChange={(e) => setMedForm({ ...medForm, unit_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {units.map((u: any) => <option key={u.unit_id} value={u.unit_id}>{u.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input type="number" label="Min Level" value={medForm.min_level} onChange={(e) => setMedForm({ ...medForm, min_level: e.target.value })} />
              <Input type="number" label="Re-Order Level" value={medForm.reorder_level} onChange={(e) => setMedForm({ ...medForm, reorder_level: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input type="number" label="Tax (%)" value={medForm.tax_percent} onChange={(e) => setMedForm({ ...medForm, tax_percent: e.target.value })} />
              <Input required label="Box/Packing *" value={medForm.box_packing} onChange={(e) => setMedForm({ ...medForm, box_packing: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="VAT A/C" value={medForm.vat_ac} onChange={(e) => setMedForm({ ...medForm, vat_ac: e.target.value })} />
              <Input label="Rack Number" value={medForm.rack_number} onChange={(e) => setMedForm({ ...medForm, rack_number: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Note</label>
              <textarea value={medForm.note} onChange={(e) => setMedForm({ ...medForm, note: e.target.value })}
                rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Medicine Photo (JPG | JPEG | PNG)</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setMedPhoto(e.target.files?.[0] ?? null)} className="text-sm" />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Save</Button>
          </form>
        </SlideOverPanel>
      )}

      {/* Purchase */}
      {showPurchase && (
        <SlideOverPanel title="Purchase" onClose={() => setShowPurchase(false)} width={900}>
          <form onSubmit={handleSubmitPurchase} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Select Supplier</label>
                <select value={purchaseHeader.supplier_id} onChange={(e) => setPurchaseHeader({ ...purchaseHeader, supplier_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {suppliers.map((s: any) => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
                </select>
              </div>
              <Input label="Bill No" value={purchaseHeader.bill_no} onChange={(e) => setPurchaseHeader({ ...purchaseHeader, bill_no: e.target.value })} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Date</label>
                <input type="datetime-local" value={purchaseHeader.purchase_date} onChange={(e) => setPurchaseHeader({ ...purchaseHeader, purchase_date: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Medicine Lines</p>
              {purchaseRows.map((row, i) => (
                <div key={i} className="rounded-xl border p-3 space-y-2" style={{ borderColor: BRAND.colors.border }}>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: BRAND.colors.textLight }}>Line {i + 1}</span>
                    {purchaseRows.length > 1 && (
                      <button type="button" onClick={() => removeRow(i)} className="text-red-500"><Trash2 size={14} /></button>
                    )}
                  </div>
                  <select value={row.medicine_id} onChange={(e) => updateRow(i, 'medicine_id', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }}>
                    <option value="">Select medicine</option>
                    {medicines.map((m) => <option key={m.medicine_id} value={m.medicine_id}>{m.name}</option>)}
                  </select>
                  <div className="grid grid-cols-4 gap-2">
                    <input placeholder="Batch No *" value={row.batch_no} onChange={(e) => updateRow(i, 'batch_no', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                    <input type="date" placeholder="Expiry" value={row.expiry_month} onChange={(e) => updateRow(i, 'expiry_month', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                    <input type="number" placeholder="MRP" value={row.mrp} onChange={(e) => updateRow(i, 'mrp', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                    <input type="number" placeholder="Sale Price *" value={row.sale_price} onChange={(e) => updateRow(i, 'sale_price', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <input type="number" placeholder="Packing Qty" value={row.packing_qty} onChange={(e) => updateRow(i, 'packing_qty', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                    <input type="number" placeholder="Quantity *" value={row.quantity} onChange={(e) => updateRow(i, 'quantity', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                    <input type="number" placeholder="Purchase Price *" value={row.purchase_price} onChange={(e) => updateRow(i, 'purchase_price', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                    <input type="number" placeholder="Tax %" value={row.tax_percent} onChange={(e) => updateRow(i, 'tax_percent', e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                  </div>
                  <p className="text-xs text-right" style={{ color: BRAND.colors.textLight }}>
                    Amount: ${rowAmount(row).toFixed(2)}
                  </p>
                </div>
              ))}
              <button type="button" onClick={addRow} className="text-sm font-medium" style={{ color: BRAND.colors.primary }}>
                + Add another medicine
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Note</label>
              <textarea value={purchaseHeader.note} onChange={(e) => setPurchaseHeader({ ...purchaseHeader, note: e.target.value })}
                rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Attach Document</label>
              <input type="file" onChange={(e) => setPurchaseDoc(e.target.files?.[0] ?? null)} className="text-sm" />
            </div>

            <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: BRAND.colors.border }}>
              <div className="flex justify-between text-sm"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between items-center text-sm">
                <span>Discount</span>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-28 rounded-lg border px-2 py-1 text-right text-sm" style={{ borderColor: BRAND.colors.border }} />
              </div>
              <div className="flex justify-between text-sm"><span>Tax</span><span>${taxTotal.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-sm" style={{ color: BRAND.colors.textDark }}><span>Net Amount</span><span>${netAmount.toFixed(2)}</span></div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <input placeholder="Payment Mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                <input type="number" placeholder="Payment Amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
              </div>
              <textarea placeholder="Payment Note" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} rows={2}
                className="w-full rounded-lg border px-2 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Save Purchase</Button>
          </form>
        </SlideOverPanel>
      )}

      {/* Manage master data */}
      {showSetup && (
        <SlideOverPanel title="Manage Categories / Companies / Groups / Units" onClose={() => setShowSetup(false)}>
          <div className="space-y-6">
            {[
              { label: 'Category', value: newCategory, setValue: setNewCategory, list: categories, key: 'category_id', add: async () => { await pharmacyApi.createCategory(newCategory); setNewCategory(''); await fetchMasterData(); } },
              { label: 'Company', value: newCompany, setValue: setNewCompany, list: companies, key: 'company_id', add: async () => { await pharmacyApi.createCompany(newCompany); setNewCompany(''); await fetchMasterData(); } },
              { label: 'Group', value: newGroup, setValue: setNewGroup, list: groups, key: 'group_id', add: async () => { await pharmacyApi.createGroup(newGroup); setNewGroup(''); await fetchMasterData(); } },
              { label: 'Unit', value: newUnit, setValue: setNewUnit, list: units, key: 'unit_id', add: async () => { await pharmacyApi.createUnit(newUnit); setNewUnit(''); await fetchMasterData(); } },
            ].map((section) => (
              <div key={section.label} className="space-y-2 border-t first:border-t-0 pt-4 first:pt-0" style={{ borderColor: BRAND.colors.border }}>
                <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Add {section.label}</p>
                <div className="flex gap-2">
                  <input value={section.value} onChange={(e) => section.setValue(e.target.value)} placeholder={`${section.label} name`}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                  <button onClick={() => { if (section.value.trim()) section.add(); }} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: BRAND.colors.primary }}>Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {section.list.map((item: any) => (
                    <span key={item[section.key]} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: BRAND.colors.iconBgTeal, color: BRAND.colors.primary }}>
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SlideOverPanel>
      )}
    </div>
  );
}