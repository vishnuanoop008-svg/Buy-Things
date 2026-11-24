import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ProductForm from '../components/ProductForm';
import { createProduct } from '../services/adminApi';

const AddProduct = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (product) => {
    setBusy(true);
    setError('');

    try {
      await createProduct(product);
      navigate('/admin/products');
    } catch {
      setError('Could not create product.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="text-[#173b32]">
      <Link
        to="/admin/products"
        className="text-sm font-semibold text-emerald-800 transition hover:text-emerald-600"
      >
        ← Back to products
      </Link>

      <h1 className="mb-6 mt-3 text-2xl font-extrabold">Add product</h1>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        busy={busy}
        submitLabel="Add product"
      />
    </section>
  );
};

export default AddProduct;