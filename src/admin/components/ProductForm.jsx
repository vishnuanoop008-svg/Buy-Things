import { useEffect, useState } from 'react';
import { productImages } from '../../assets/mockData';

const createForm = values => {
  const quantity =
    values.quantity != null
      ? Math.max(0, Number(values.quantity) || 0)
      : values.inStock === false
        ? 0
        : 10;

  return {
    name: values.name ?? '',
    price: values.price ?? '',
    description: values.description ?? '',
    category: values.category ?? '',
    image: values.image ?? 'image1',
    rating: values.rating ?? 5,
    quantity,
    active: values.active ?? true,
  };
};

const ProductForm = ({
  initialValues = {},
  onSubmit,
  submitLabel = 'Save product',
  busy = false,
}) => {
  const [form, setForm] = useState(() => createForm(initialValues));

  useEffect(() => {
    setForm(createForm(initialValues));
  }, [initialValues]);

  const update = event => {
    const { name, value, checked, type } = event.target;

    setForm(current => {
      if (name === 'quantity') {
        const quantity = Math.max(0, Number(value) || 0);

        return {
          ...current,
          quantity: value === '' ? '' : quantity,
          active: quantity === 0 ? false : current.active,
        };
      }

      return {
        ...current,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const submit = event => {
    event.preventDefault();

    const quantity = Math.max(0, Number(form.quantity) || 0);

    onSubmit({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      rating: Number(form.rating),
      quantity,
      inStock: quantity > 0,
      active: quantity > 0 && Boolean(form.active),
    });
  };

  const inputClassName =
    'mt-2 w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

  const imageSrc = productImages[form.image] || form.image;

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
          Quantity
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={update}
            required
            className={inputClassName}
            placeholder="Enter available quantity"
          />
          <span className="mt-1 block text-xs font-normal text-gray-500">
            Quantity 0 means out of stock. Quantities below 5 are low stock.
          </span>
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

      <label className="block text-sm font-semibold text-gray-700">
        Image
        <select
          name="image"
          value={form.image}
          onChange={update}
          className={inputClassName}
        >
          {Object.keys(productImages).map(imageKey => (
            <option key={imageKey} value={imageKey}>
              {imageKey}
            </option>
          ))}
        </select>
      </label>

      <label
        className={`flex items-center gap-3 text-sm font-medium ${
          Number(form.quantity) > 0 ? 'text-gray-700' : 'text-gray-400'
        }`}
      >
        <input
          name="active"
          type="checkbox"
          checked={Boolean(form.active) && Number(form.quantity) > 0}
          onChange={update}
          disabled={Number(form.quantity) <= 0}
          className="h-4 w-4 accent-emerald-800 disabled:cursor-not-allowed"
        />
        Active in store
      </label>

      <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-5">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${form.name || 'Product'} preview`}
            className="h-24 w-24 rounded-lg bg-[#f3f5f3] object-contain p-2"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-[#f3f5f3] text-xs text-gray-500">
            No image
          </div>
        )}

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