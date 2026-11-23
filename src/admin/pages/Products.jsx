import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminTable from '../components/AdminTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { productImages } from '../../assets/mockData';
import { deleteProduct, getProducts } from '../services/adminApi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setProducts(await getProducts());
      setError('');
    } catch {
      setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts(current => current.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError('Could not delete product.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: product => (
        <div className="flex items-center gap-3">
          <img
            src={productImages[product.image] || product.image}
            alt=""
            className="h-12 w-12 rounded bg-white object-contain p-1"
          />
          <span className="font-medium text-white">{product.name}</span>
        </div>
      ),
    },
    { key: 'price', label: 'Price', render: row => `₹${row.price}` },
    { key: 'category', label: 'Category' },
    {
      key: 'stock',
      label: 'Stock',
      render: row => (row.inStock ? 'In stock' : 'Out of stock'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <div className="flex gap-3">
          <Link
            to={`/admin/products/${row.id}/edit`}
            className="text-purple-300 hover:text-purple-200"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="text-red-300 hover:text-red-200"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-gray-400">Manage store products.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-purple-700 px-4 py-2.5 text-sm font-semibold hover:bg-purple-600"
        >
          Add product
        </Link>
      </div>

      {loading && <p className="mt-6 text-gray-400">Loading products…</p>}
      {error && <p className="mt-6 text-red-300">{error}</p>}
      {!loading && !error && (
        <div className="mt-6">
          <AdminTable columns={columns} rows={products} emptyMessage="No products yet." />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product?"
        message={`Delete “${deleteTarget?.name}”? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </section>
  );
};

export default Products;