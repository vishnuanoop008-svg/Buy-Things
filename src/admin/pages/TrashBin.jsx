import { useEffect, useState } from 'react';
import { FaTrashAlt, FaUndo } from 'react-icons/fa';

import AdminTable from '../components/AdminTable';
import { productImages } from '../../assets/mockData';
import { getTrashedProducts, restoreProduct } from '../services/adminApi';

const TrashBin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
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
        <button
          type="button"
          onClick={() => handleRestore(product)}
          disabled={busyId === product.id}
          className="inline-flex items-center gap-2 font-semibold text-emerald-800 hover:text-emerald-600 disabled:opacity-50"
        >
          <FaUndo aria-hidden="true" />
          {busyId === product.id ? 'Restoring…' : 'Restore'}
        </button>
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
        Restore products to make them available in your product list again.
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
    </section>
  );
};

export default TrashBin;