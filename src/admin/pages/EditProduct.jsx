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
    getProduct(id)
      .then(setProduct)
      .catch(() => setError('Could not find this product.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async changes => {
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
    <section>
      <Link to="/admin/products" className="text-sm text-purple-300 hover:text-white">
        ← Back to products
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-bold">Edit product</h1>
      {loading && <p className="text-gray-400">Loading product…</p>}
      {error && <p className="mb-4 text-red-300">{error}</p>}
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