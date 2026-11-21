import ManCategory from '../assets/images/man.png';
import WomanCategory from '../assets/images/woman.png';
import KidCategory from '../assets/images/kid.png';

const categories = [
  { title: 'Men', imageUrl: ManCategory },
  { title: 'Women', imageUrl: WomanCategory },
  { title: 'Kids', imageUrl: KidCategory },
];

const CategorySection = () => {
  return (
    <section className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 py-10">
      <h2 className="mb-6 text-center text-2xl font-bold text-white">
        Categories
      </h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {categories.map(category => (
          <div
            key={category.title}
            className="group relative h-64 cursor-pointer overflow-hidden rounded-lg border border-white/10 transition duration-300 hover:-translate-y-1 hover:border-purple-500/50"
          >
            <img
              src={category.imageUrl}
              alt={`${category.title} clothing`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />

            <div className="absolute left-8 top-1/2 -translate-y-1/2">
              <p className="text-xl font-bold text-white drop-shadow-md">
                {category.title}
              </p>
              <div className="mt-2 h-1 w-10 rounded-full bg-purple-500 transition-all duration-300 group-hover:w-16" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;