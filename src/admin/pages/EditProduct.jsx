import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ProductForm from '../components/ProductForm';
import { getProduct, updateProduct } from '../services/adminApi';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const result = await getProduct(id);
        if (isMounted) setProduct(result);
      } catch {
        if (isMounted) setError('Could not find this product.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (changes) => {
    setBusy(true);
    setError('');

    try {
      await updateProduct(id, changes);
      navigate('/admin/products');
    } catch {
      setError('Could not save product changes.');
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

      <h1 className="mb-6 mt-3 text-2xl font-extrabold">Edit product</h1>

      {loading && (
        <p className="text-gray-600">Loading product…</p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {product && (
        <ProductForm
          initialValues={product}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          busy={busy}
        />
      )}
    </section>
  );
};

export default EditProduct;