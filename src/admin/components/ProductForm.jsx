import { useState } from 'react';
import { productImages } from '../../assets/mockData';

const ProductForm = ({
  initialValues = {},
  onSubmit,
  submitLabel = 'Save product',
  busy = false,
}) => {
  const [form, setForm] = useState({
    name: initialValues.name ?? '',
    price: initialValues.price ?? '',
    description: initialValues.description ?? '',
    category: initialValues.category ?? '',
    image: initialValues.image ?? 'image1',
    rating: initialValues.rating ?? 5,
    inStock: initialValues.inStock ?? true,
  });

  const update = event => {
    const { name, value, type, checked } = event.target;
    setForm(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = event => {
    event.preventDefault();
    onSubmit({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      rating: Number(form.rating),
      inStock: Boolean(form.inStock),
    });
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-3xl space-y-5 rounded-xl border border-white/10 bg-[#111114] p-5 sm:p-7"
    >
      <label className="block text-sm text-gray-300">
        Product name
        <input
          name="name"
          value={form.name}
          onChange={update}
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white outline-none focus:border-purple-500"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-gray-300">
          Price (₹)
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={update}
            required
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white outline-none focus:border-purple-500"
          />
        </label>

        <label className="block text-sm text-gray-300">
          Category
          <input
            name="category"
            value={form.category}
            onChange={update}
            placeholder="e.g. Watches"
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white outline-none focus:border-purple-500"
          />
        </label>
      </div>

      <label className="block text-sm text-gray-300">
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={update}
          rows="4"
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white outline-none focus:border-purple-500"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-gray-300">
          Image
          <select
            name="image"
            value={form.image}
            onChange={update}
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white outline-none focus:border-purple-500"
          >
            {Object.keys(productImages).map(imageKey => (
              <option key={imageKey} value={imageKey}>
                {imageKey}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-gray-300">
          Rating
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={update}
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white outline-none focus:border-purple-500"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-300">
        <input
          name="inStock"
          type="checkbox"
          checked={form.inStock}
          onChange={update}
          className="h-4 w-4 accent-purple-600"
        />
        In stock
      </label>

      <div className="flex items-center gap-4">
        <img
          src={productImages[form.image]}
          alt="Product preview"
          className="h-24 w-24 rounded-lg bg-white object-contain p-2"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white hover:bg-purple-600 disabled:opacity-60"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;