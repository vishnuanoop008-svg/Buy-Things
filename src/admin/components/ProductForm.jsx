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
    active: initialValues.active ?? true,
  });

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setForm((current) => {
      const nextForm = { ...current, [name]: nextValue };

      // Out-of-stock products are automatically made inactive.
      if (name === 'inStock' && !checked) {
        nextForm.active = false;
      }

      return nextForm;
    });
  };

  const submit = (event) => {
    event.preventDefault();

    const inStock = Boolean(form.inStock);

    onSubmit({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      rating: Number(form.rating),
      inStock,
      active: inStock && Boolean(form.active),
    });
  };

  const inputClassName =
    'mt-2 w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

  return (
    <form
      onSubmit={submit}
      className="max-w-3xl space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <label className="block text-sm font-semibold text-gray-700">
        Product name
        <input
          name="name"
          value={form.name}
          onChange={update}
          required
          className={inputClassName}
          placeholder="Enter product name"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700">
          Price (₹)
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={update}
            required
            className={inputClassName}
            placeholder="Enter price"
          />
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Category
          <input
            name="category"
            value={form.category}
            onChange={update}
            placeholder="e.g. Watches"
            className={inputClassName}
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-gray-700">
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={update}
          rows={4}
          placeholder="Describe the product"
          className={`${inputClassName} resize-y`}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700">
          Image
          <select
            name="image"
            value={form.image}
            onChange={update}
            className={inputClassName}
          >
            {Object.keys(productImages).map((imageKey) => (
              <option key={imageKey} value={imageKey}>
                {imageKey}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Rating
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={update}
            className={inputClassName}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input
            name="inStock"
            type="checkbox"
            checked={Boolean(form.inStock)}
            onChange={update}
            className="h-4 w-4 accent-emerald-800"
          />
          In stock
        </label>

        <label
          className={`flex items-center gap-3 text-sm font-medium ${
            form.inStock ? 'text-gray-700' : 'text-gray-400'
          }`}
        >
          <input
            name="active"
            type="checkbox"
            checked={Boolean(form.active) && Boolean(form.inStock)}
            onChange={update}
            disabled={!form.inStock}
            className="h-4 w-4 accent-emerald-800 disabled:cursor-not-allowed"
          />
          Active in store
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-5">
        <img
          src={productImages[form.image] || form.image}
          alt="Product preview"
          className="h-24 w-24 rounded-lg bg-[#f3f5f3] object-contain p-2"
        />

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;