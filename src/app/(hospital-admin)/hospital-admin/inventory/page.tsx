'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { inventoryApi, ItemStock, StockStats, CreateStockPayload } from './inventory.api';
import { Button, Input, Alert } from '@/src/core';
import { SlideOverPanel } from '@/src/core/SlideOverPanel';
import { TableCard } from '@/src/core/table/TableCard';
import { TableToolbar } from '@/src/core/table/TableToolbar';
import { SearchInput } from '@/src/core/table/SearchInput';
import { EmptyState } from '@/src/core/table/EmptyState';
import { LoadingSpinner } from '@/src/core/table/TableLoading';
import { BRAND } from '@/src/constants/brand.constants';

export default function InventoryPage() {
  const [stock, setStock] = useState<ItemStock[]>([]);
  const [stats, setStats] = useState<StockStats | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showSetupPanel, setShowSetupPanel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    category_id: '', item_id: '', supplier_id: '', store_id: '',
    quantity: '', purchase_price: '', purchase_date: new Date().toISOString().slice(0, 10), description: '',
  });

  const [newCategory, setNewCategory] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [newStore, setNewStore] = useState('');
  const [newItem, setNewItem] = useState({ category_id: '', name: '' });

  const fetchStock = async () => {
    setIsLoading(true);
    const [s, st] = await Promise.all([inventoryApi.getStock(search || undefined), inventoryApi.getStats()]);
    setStock(s);
    setStats(st);
    setIsLoading(false);
  };

  const fetchMasterData = async () => {
    const [c, sup, sto, it] = await Promise.all([
      inventoryApi.getCategories(), inventoryApi.getSuppliers(), inventoryApi.getStores(), inventoryApi.getItems(),
    ]);
    setCategories(c);
    setSuppliers(sup);
    setStores(sto);
    setItems(it);
  };

  useEffect(() => { fetchStock(); }, [search]);
  useEffect(() => { fetchMasterData(); }, []);

  const filteredItems = form.category_id ? items.filter((i) => i.category_id === form.category_id) : items;

  const openAddPanel = () => {
    setSubmitError(null);
    setForm({ category_id: '', item_id: '', supplier_id: '', store_id: '', quantity: '', purchase_price: '', purchase_date: new Date().toISOString().slice(0, 10), description: '' });
    setShowAddPanel(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!form.category_id || !form.item_id || !form.supplier_id || !form.quantity || !form.purchase_price) {
      setSubmitError('Please fill all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: CreateStockPayload = {
        category_id: form.category_id,
        item_id: form.item_id,
        supplier_id: form.supplier_id,
        store_id: form.store_id || undefined,
        quantity: Number(form.quantity),
        purchase_price: Number(form.purchase_price),
        purchase_date: form.purchase_date,
        description: form.description || undefined,
      };
      await inventoryApi.createStock(payload);
      setShowAddPanel(false);
      await fetchStock();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Unable to add item stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (stockId: string) => {
    await inventoryApi.deleteStock(stockId);
    await fetchStock();
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await inventoryApi.createCategory(newCategory.trim());
    setNewCategory('');
    await fetchMasterData();
  };
  const handleAddSupplier = async () => {
    if (!newSupplier.trim()) return;
    await inventoryApi.createSupplier(newSupplier.trim());
    setNewSupplier('');
    await fetchMasterData();
  };
  const handleAddStore = async () => {
    if (!newStore.trim()) return;
    await inventoryApi.createStore(newStore.trim());
    setNewStore('');
    await fetchMasterData();
  };
  const handleAddItem = async () => {
    if (!newItem.category_id || !newItem.name.trim()) return;
    await inventoryApi.createItem(newItem.category_id, newItem.name.trim());
    setNewItem({ category_id: '', name: '' });
    await fetchMasterData();
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold" style={{ color: BRAND.colors.textDark }}>Item Stock List</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowSetupPanel(true)}>Manage Categories / Suppliers / Stores / Items</Button>
          <Button leftIcon={<Plus size={16} />} onClick={openAddPanel}>Add Item Stock</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Distinct Items" value={stats?.total_items ?? 0} />
        <StatCard label="Total Quantity" value={stats?.total_quantity ?? 0} />
        <StatCard label="Total Stock Value" value={`₹${(stats?.total_value ?? 0).toLocaleString('en-IN')}`} />
      </div>

      <TableCard>
        <TableToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by item or category..." />
        </TableToolbar>

        {isLoading ? (
          <LoadingSpinner />
        ) : stock.length === 0 ? (
          <EmptyState icon={Package} message="No item stock recorded yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left" style={{ color: BRAND.colors.textLight }}>
              <tr className="border-b" style={{ borderColor: BRAND.colors.border }}>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Store</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Total Quantity</th>
                <th className="px-5 py-3 font-medium">Generated By</th>
                <th className="px-5 py-3 font-medium">Purchase Price ($)</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <tr key={s.stock_id} className="border-b last:border-b-0 align-top" style={{ borderColor: BRAND.colors.border }}>
                  <td className="px-5 py-3 font-medium" style={{ color: BRAND.colors.primary }}>{s.item_name}</td>
                  <td className="px-5 py-3">{s.category_name}</td>
                  <td className="px-5 py-3">{s.supplier_name}</td>
                  <td className="px-5 py-3">{s.store_name ?? '—'}</td>
                  <td className="px-5 py-3">{new Date(s.purchase_date).toLocaleDateString('en-GB').split('/').join('-')}</td>
                  <td className="px-5 py-3 max-w-[220px]" style={{ color: BRAND.colors.textMid }}>{s.description ?? '—'}</td>
                  <td className="px-5 py-3">{s.total_quantity}</td>
                  <td className="px-5 py-3">{s.generated_by_name}</td>
                  <td className="px-5 py-3">{Number(s.purchase_price).toFixed(2)}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(s.stock_id)} className="text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {/* Add Item Stock */}
      {showAddPanel && (
        <SlideOverPanel title="Add Item Stock" onClose={() => setShowAddPanel(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <Alert variant="error" message={submitError} />}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Item Category *</label>
                <select required value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value, item_id: '' })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Item *</label>
                <select required value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {filteredItems.map((i) => <option key={i.item_id} value={i.item_id}>{i.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Supplier *</label>
                <select required value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Store</label>
                <select value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }}>
                  <option value="">Select</option>
                  {stores.map((s) => <option key={s.store_id} value={s.store_id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input required type="number" label="Quantity *" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              <Input required type="number" label="Purchase Price *" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Date</label>
                <input type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: BRAND.colors.textDark }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: BRAND.colors.border }} />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>Save</Button>
          </form>
        </SlideOverPanel>
      )}

      {/* Manage master data */}
      {showSetupPanel && (
        <SlideOverPanel title="Manage Categories / Suppliers / Stores / Items" onClose={() => setShowSetupPanel(false)}>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Add Category</p>
              <div className="flex gap-2">
                <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                <button onClick={handleAddCategory} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: BRAND.colors.primary }}>Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => <span key={c.category_id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: BRAND.colors.iconBgTeal, color: BRAND.colors.primary }}>{c.name}</span>)}
              </div>
            </div>

            <div className="space-y-2 border-t pt-4" style={{ borderColor: BRAND.colors.border }}>
              <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Add Supplier</p>
              <div className="flex gap-2">
                <input value={newSupplier} onChange={(e) => setNewSupplier(e.target.value)} placeholder="Supplier name"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                <button onClick={handleAddSupplier} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: BRAND.colors.primary }}>Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suppliers.map((s) => <span key={s.supplier_id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: BRAND.colors.iconBgTeal, color: BRAND.colors.primary }}>{s.name}</span>)}
              </div>
            </div>

            <div className="space-y-2 border-t pt-4" style={{ borderColor: BRAND.colors.border }}>
              <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Add Store</p>
              <div className="flex gap-2">
                <input value={newStore} onChange={(e) => setNewStore(e.target.value)} placeholder="Store name"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                <button onClick={handleAddStore} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: BRAND.colors.primary }}>Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {stores.map((s) => <span key={s.store_id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: BRAND.colors.iconBgTeal, color: BRAND.colors.primary }}>{s.name}</span>)}
              </div>
            </div>

            <div className="space-y-2 border-t pt-4" style={{ borderColor: BRAND.colors.border }}>
              <p className="font-medium text-sm" style={{ color: BRAND.colors.textDark }}>Add Item</p>
              <select value={newItem.category_id} onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
              </select>
              <div className="flex gap-2">
                <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: BRAND.colors.border }} />
                <button onClick={handleAddItem} className="px-3 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: BRAND.colors.primary }}>Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((i) => <span key={i.item_id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F1F3F5', color: BRAND.colors.textMid }}>{i.name}</span>)}
              </div>
            </div>
          </div>
        </SlideOverPanel>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl border p-4" style={{ borderColor: BRAND.colors.border }}>
      <p className="text-xs uppercase font-medium" style={{ color: BRAND.colors.textLight }}>{label}</p>
      <p className="text-xl font-bold mt-1" style={{ color: BRAND.colors.textDark }}>{value}</p>
    </div>
  );
}