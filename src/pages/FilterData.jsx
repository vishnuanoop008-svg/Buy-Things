import { useSelector } from 'react-redux';
import ProductCard from '../components/productCard';

const FilterData = () => {
  const filterProducts = useSelector(
    state => state.product?.filteredData ?? []
  );
  const searchTerm = useSelector(
    state => state.product?.searchTerm ?? ''
  );

  return (
    <main className="min-h-screen bg-[#09090b] px-4 pb-12 pt-36 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
          Search
        </p>

        <h1 className="mb-8 text-center text-3xl font-bold">
          {searchTerm.trim()
            ? `Results for “${searchTerm.trim()}”`
            : 'All Products'}
        </h1>

        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {filterProducts.map(product => (
              <ProductCard
                key={product.productId ?? product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-white/10 bg-[#111114] px-6 py-12 text-center text-gray-400">
            No products found. Try another search.
          </p>
        )}
      </div>
    </main>
  );
};

export default FilterData;