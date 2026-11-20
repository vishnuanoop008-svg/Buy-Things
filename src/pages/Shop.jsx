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

  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(page => Math.min(page + 1, totalPages));
  };

  const handleSortChange = event => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  return (
    <main className="mx-auto min-h-screen px-4 pb-12 pt-32 md:px-16 lg:px-24">
      <div className="mb-6">
        <h2 className="mb-2 text-center text-2xl font-bold">Shop</h2>

        <div className="flex justify-end">
          <label className="flex items-center gap-2 text-sm">
            <span>Sort by:</span>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="rounded border border-gray-300 bg-white px-3 py-2"
            >
              <option value="">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </label>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          No products found. Make sure your products have loaded.
        </p>
      ) : (
        <>
          <div className="grid cursor-pointer grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="rounded bg-violet-900 px-5 py-2 text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="rounded bg-violet-900 px-5 py-2 text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default Shop;