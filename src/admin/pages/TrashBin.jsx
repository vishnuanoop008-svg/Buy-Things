import { useEffect, useState } from 'react';
import { FaTrashAlt, FaUndo } from 'react-icons/fa';

import AdminTable from '../components/AdminTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { productImages } from '../../assets/mockData';
import {
  deleteProduct,
  getTrashedProducts,
  restoreProduct,
} from '../services/adminApi';

const TrashBin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTrash = async () => {
      try {
        setProducts(await getTrashedProducts());
        setError('');
      } catch {
        setError('Could not load trashed products.');
      } finally {
        setLoading(false);
      }
    };

    loadTrash();
  }, []);

  const handleRestore = async (product) => {
    setBusyId(product.id);
    setError('');

    try {
      await restoreProduct(product.id);
      setProducts((current) =>
        current.filter((item) => String(item.id) !== String(product.id))
      );
    } catch {
      setError(`Could not restore "${product.name}".`);
    } finally {
      setBusyId(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteTarget) return;

    setBusyId(deleteTarget.id);
    setError('');

    try {
      await deleteProduct(deleteTarget.id);
      setProducts((current) =>
        current.filter(
          (item) => String(item.id) !== String(deleteTarget.id)
        )
      );
      setDeleteTarget(null);
    } catch {
      setError(`Could not permanently delete "${deleteTarget.name}".`);
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: (product) => (
        <div className="flex items-center gap-3">
          <img
            src={productImages[product.image] || product.image}
            alt={product.name}
            className="h-12 w-12 rounded-lg bg-[#f3f5f3] object-contain p-1"
          />
          <span className="font-semibold">{product.name}</span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (product) => `₹${product.price}`,
    },
    {
      key: 'category',
      label: 'Category',
      render: (product) => product.category || '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product) => (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleRestore(product)}
            disabled={busyId === product.id}
            aria-label={`Restore ${product.name}`}
            title={busyId === product.id ? 'Restoring…' : 'Restore'}
            className="inline-flex items-center text-lg text-emerald-800 transition hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaUndo aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(product)}
            disabled={busyId === product.id}
            aria-label={`Permanently delete ${product.name}`}
            title="Permanently delete"
            className="inline-flex items-center text-lg text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTrashAlt aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="text-[#173b32]">
      <div className="flex items-center gap-3">
        <FaTrashAlt className="text-red-600" aria-hidden="true" />
        <h1 className="text-2xl font-extrabold">Trash Bin</h1>
      </div>

      <p className="mt-1 text-sm text-gray-600">
        Restore products or permanently delete them.
      </p>

      {error && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-gray-600">Loading Trash Bin…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            columns={columns}
            rows={products}
            emptyMessage="The Trash Bin is empty."
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Permanently delete product?"
        message={`Permanently delete “${deleteTarget?.name}”? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handlePermanentDelete}
        busy={busyId === deleteTarget?.id}
      />
    </section>
  );
};

export default TrashBin;