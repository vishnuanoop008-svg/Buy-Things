import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { createProduct } from '../services/adminApi';

const AddProduct = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async product => {
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
    <section>
      <Link to="/admin/products" className="text-sm text-purple-300 hover:text-white">
        ← Back to products
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-bold">Add product</h1>
      {error && <p className="mb-4 text-red-300">{error}</p>}
      <ProductForm onSubmit={handleSubmit} busy={busy} />
    </section>
  );
};

export default AddProduct;