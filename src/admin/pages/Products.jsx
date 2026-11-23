import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminTable from '../components/AdminTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { productImages } from '../../assets/mockData';
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from '../services/adminApi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const loadProducts = async () => {
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
    loadProducts();
  }, []);

  const toggleActive = async (product) => {
    // Out-of-stock products are always inactive.
    if (product.inStock === false) return;

    const isActive = product.active !== false;
    setUpdatingId(product.id);
    setError('');

    try {
      const updatedProduct = await updateProduct(product.id, {
        active: !isActive,
      });

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, ...updatedProduct } : item
        )
      );
    } catch {
      setError('Could not update product status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError('');

    try {
      await deleteProduct(deleteTarget.id);
      setProducts((current) =>
        current.filter((product) => product.id !== deleteTarget.id)
      );
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
      render: (product) => (
        <div className="flex items-center gap-3">
          <img
            src={productImages[product.image] || product.image}
            alt={product.name}
            className="h-12 w-12 rounded bg-white object-contain p-1"
          />
          <span className="font-medium text-white">{product.name}</span>
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
      key: 'stock',
      label: 'Stock',
      render: (product) => {
        const hasStock = product.inStock !== false;

        return (
          <span className={hasStock ? 'text-emerald-300' : 'text-red-400'}>
            {hasStock ? 'In stock' : 'Out of stock'}
          </span>
        );
      },
    },
    {
      key: 'active',
      label: 'Store status',
      render: (product) => {
        const hasStock = product.inStock !== false;
        const isActive = hasStock && product.active !== false;

        return (
          <button
            type="button"
            onClick={() => toggleActive(product)}
            disabled={!hasStock || updatingId === product.id}
            aria-label={`Set ${product.name} ${
              isActive ? 'inactive' : 'active'
            }`}
            title={!hasStock ? 'Restock this product to activate it' : undefined}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
              isActive
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                : 'border-red-500/40 bg-red-500/15 text-red-400'
            }`}
          >
            {updatingId === product.id
              ? 'Saving…'
              : isActive
                ? 'Active'
                : 'Inactive'}
          </button>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product) => (
        <div className="flex gap-3">
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="text-purple-300 hover:text-purple-200"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(product)}
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
          <p className="mt-1 text-sm text-gray-400">
            Manage products and their visibility in your store.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="rounded-lg bg-purple-700 px-4 py-2.5 text-sm font-semibold hover:bg-purple-600"
        >
          Add product
        </Link>
      </div>

      {error && <p className="mt-5 text-sm text-red-300">{error}</p>}

      {loading ? (
        <p className="mt-6 text-gray-400">Loading products…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            columns={columns}
            rows={products}
            emptyMessage="No products yet."
          />
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