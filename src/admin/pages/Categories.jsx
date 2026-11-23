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

  const add = async event => {
    event.preventDefault();
    if (!name.trim()) return;

    setBusy(true);
    try {
      const category = await createCategory({ name: name.trim() });
      setCategories(current => [...current, category]);
      setName('');
      setError('');
    } catch {
      setError('Could not add category.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories(current =>
        current.filter(item => item.id !== deleteTarget.id)
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
      render: row => (
        <button
          type="button"
          onClick={() => setDeleteTarget(row)}
          className="text-red-300 hover:text-red-200"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <section>
      <h1 className="text-2xl font-bold">Categories</h1>
      <p className="mt-1 text-sm text-gray-400">Add and remove product categories.</p>

      <form onSubmit={add} className="mt-6 flex max-w-xl gap-3">
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Category name"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#111114] px-3 py-2.5 text-white outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-purple-700 px-4 py-2.5 font-semibold hover:bg-purple-600 disabled:opacity-60"
        >
          Add
        </button>
      </form>

      {error && <p className="mt-4 text-red-300">{error}</p>}
      {loading ? (
        <p className="mt-6 text-gray-400">Loading categories…</p>
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