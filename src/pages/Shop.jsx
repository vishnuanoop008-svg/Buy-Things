import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/productCard';

const PRODUCTS_PER_PAGE = 10;

const Shop = () => {
  const products = useSelector((state) => state.product?.products ?? []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('');

  const selectedCategory = searchParams.get('category')?.trim() ?? '';

  const filteredProducts = useMemo(() => {
    const availableProducts = products.filter(
      (product) => product.active !== false && product.inStock !== false
    );

    if (!selectedCategory) return availableProducts;

    return availableProducts.filter(
      (product) =>
        String(product.category ?? '').trim().toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    if (sortOrder === 'price-low-high') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === 'price-high-low') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return sorted;
  }, [filteredProducts, sortOrder]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const clearCategory = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-20 text-[#173b32] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Browse our collection
            </p>
            <h1 className="text-3xl font-extrabold">
              {selectedCategory || 'Shop'}
            </h1>

            {selectedCategory && (
              <button
                type="button"
                onClick={clearCategory}
                className="mt-2 text-sm font-semibold text-emerald-800 hover:text-emerald-600"
              >
                Clear category filter
              </button>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-600">
            <span>Sort by:</span>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#173b32] outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            >
              <option value="">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </label>
        </div>

        {sortedProducts.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-600 shadow-sm">
            {selectedCategory
              ? `No products found in “${selectedCategory}”.`
              : 'No products are currently available.'}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.productId ?? product.id}
                  product={product}
                />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.max(totalPages, 1)}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
                className="rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Shop;