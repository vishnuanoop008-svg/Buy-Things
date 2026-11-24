import { useEffect, useState } from 'react';

import AdminTable from '../components/AdminTable';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  createCategory,
  deleteCategory,
  getCategories,
} from '../services/adminApi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setCategories(await getCategories());
      setError('');
    } catch {
      setError('Could not load categories. Add a categories array to db.json.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setBusy(true);

    try {
      const category = await createCategory({ name: name.trim() });
      setCategories((current) => [...current, category]);
      setName('');
      setError('');
    } catch {
      setError('Could not add category.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;

    setBusy(true);

    try {
      await deleteCategory(deleteTarget.id);
      setCategories((current) =>
        current.filter((item) => item.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch {
      setError('Could not delete category.');
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Category' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          type="button"
          onClick={() => setDeleteTarget(row)}
          className="font-medium text-red-600 transition hover:text-red-800"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <section className="text-[#173b32]">
      <h1 className="text-2xl font-extrabold">Categories</h1>
      <p className="mt-1 text-sm text-gray-600">
        Add and remove product categories.
      </p>

      <form onSubmit={add} className="mt-6 flex max-w-xl gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Category name"
          aria-label="Category name"
          required
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[#173b32] outline-none placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-800 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Adding…' : 'Add'}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-gray-600">Loading categories…</p>
      ) : (
        <div className="mt-6">
          <AdminTable columns={columns} rows={categories} />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        message={`Delete “${deleteTarget?.name}”?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
        busy={busy}
      />
    </section>
  );
};

export default Categories;