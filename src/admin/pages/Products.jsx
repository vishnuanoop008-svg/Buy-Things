import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import AdminTable from '../components/AdminTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { productImages } from '../../assets/mockData';
import {
  getProducts,
  trashProduct,
  updateProduct,
} from '../services/adminApi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.category, product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [products, searchTerm]);

  const toggleActive = async (product) => {
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
          String(item.id) === String(product.id)
            ? { ...item, ...updatedProduct }
            : item
        )
      );
    } catch {
      setError('Could not update product status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const moveToTrash = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError('');

    try {
      await trashProduct(deleteTarget.id);

      setProducts((current) =>
        current.filter(
          (product) => String(product.id) !== String(deleteTarget.id)
        )
      );

      setDeleteTarget(null);
    } catch {
      setError('Could not move the product to the Trash Bin.');
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
            className="h-12 w-12 rounded-lg bg-[#f3f5f3] object-contain p-1"
          />
          <span className="font-semibold text-[#173b32]">{product.name}</span>
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
          <span
            className={
              hasStock
                ? 'font-medium text-emerald-700'
                : 'font-medium text-red-600'
            }
          >
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
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border-red-200 bg-red-50 text-red-700'
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
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="font-medium text-emerald-800 transition hover:text-emerald-600"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => setDeleteTarget(product)}
            aria-label={`Move ${product.name} to Trash Bin`}
            title="Move to Trash Bin"
            className="inline-flex items-center text-red-600 transition hover:text-red-800"
          >
            <FaTrashAlt aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="text-[#173b32]">
      <label className="mb-5 flex max-w-md items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-emerald-700">
        <FaSearch className="shrink-0 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search products by name or category…"
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#173b32] outline-none placeholder:text-gray-400"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage products and their visibility in your store.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Add product
        </Link>
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-gray-600">Loading products…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            columns={columns}
            rows={filteredProducts}
            emptyMessage={
              searchTerm.trim()
                ? 'No products match your search.'
                : 'No products yet.'
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Move product to Trash Bin?"
        message={`Move “${deleteTarget?.name}” to the Trash Bin? You can restore it later.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={moveToTrash}
        busy={deleting}
      />
    </section>
  );
};

export default Products;