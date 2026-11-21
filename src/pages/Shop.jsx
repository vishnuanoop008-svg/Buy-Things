import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/productCard';

const PRODUCTS_PER_PAGE = 10;

const Shop = () => {
  const products = useSelector(state => state.product?.products ?? []);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('');

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    if (sortOrder === 'price-low-high') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === 'price-high-low') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return sorted;
  }, [products, sortOrder]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(page => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  const handleSortChange = event => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(page => Math.min(page + 1, totalPages));
  };

  return (
    <main className="mx-auto min-h-screen bg-[#09090b] px-4 pb-12 pt-10 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              Browse our collection
            </p>
            <h1 className="text-3xl font-bold text-white">Shop</h1>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-300">
            <span>Sort by:</span>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="rounded-lg border border-white/10 bg-[#17171b] px-3 py-2 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </label>
        </div>

        {products.length === 0 ? (
          <p className="py-16 text-center text-gray-400">
            No products found. Make sure your products have loaded.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
              {currentProducts.map(product => (
                <ProductCard
                  key={product.productId ?? product.id}
                  product={product}
                />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="rounded-lg bg-purple-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
              >
                Previous
              </button>

              <span className="text-sm text-gray-300">
                Page {currentPage} of {Math.max(totalPages, 1)}
              </span>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                className="rounded-lg bg-purple-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
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