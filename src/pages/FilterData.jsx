import { useSelector } from 'react-redux';
import ProductCard from '../components/productCard';

const FilterData = () => {
  const filterProducts = useSelector(
    (state) => state.product?.filteredData ?? []
  );
  const searchTerm = useSelector(
    (state) => state.product?.searchTerm ?? ''
  );

  const trimmedSearchTerm = searchTerm.trim();

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Search
          </p>

          <h1 className="text-2xl font-extrabold sm:text-3xl">
            {trimmedSearchTerm
              ? `Results for “${trimmedSearchTerm}”`
              : 'All products'}
          </h1>

          {filterProducts.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {filterProducts.length}{' '}
              {filterProducts.length === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>

        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {filterProducts.map((product) => (
              <ProductCard
                key={product.productId ?? product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-600 shadow-sm">
            No products found. Try another search.
          </p>
        )}
      </div>
    </main>
  );
};

export default FilterData;