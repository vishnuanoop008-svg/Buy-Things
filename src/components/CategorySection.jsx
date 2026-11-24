import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CategorySection = () => {
  const products = useSelector((state) => state.product?.products ?? []);

  const categories = [
    ...new Map(
      products
        .filter(
          (product) =>
            product.active !== false &&
            product.inStock !== false &&
            product.category &&
            product.image
        )
        .map((product) => {
          const name = String(product.category).trim();

          return [
            name.toLowerCase(),
            {
              name,
              image: product.image,
            },
          ];
        })
    ).values(),
  ].slice(0, 5);

  if (categories.length === 0) return null;

  return (
    <section className="border-t border-gray-200 py-8 sm:py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Explore more
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-[#173b32] sm:text-2xl">
            A little of everything you love
          </h2>
        </div>

        <span className="hidden text-sm text-gray-500 sm:block">
          Find something for you
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            aria-label={`Browse ${category.name} products`}
            className="group w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#f3f5f3]">
              <img
                src={category.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h3 className="px-3 py-3 text-sm font-semibold capitalize text-[#173b32]">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;