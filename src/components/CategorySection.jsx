import React from 'react'
import ManCategory from '../assets/images/man.png'
import WomanCategory from '../assets/images/kid.png'
import KidCategory from '../assets/images/woman.png'

const categories = [
  {
    title: 'Men',
    imageUrl: ManCategory
  },
  {
    title: 'Woman',
    imageUrl: WomanCategory
  },
  {
    title: 'Kids',
    imageUrl: KidCategory
  }
];

const CategorySection = () => {
  return (
    <section className="container mx-auto mt-10 px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Categories
      </h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.title}
            className="relative h-64 cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src={category.imageUrl}
              alt={category.title}
              className="h-full w-full rounded-lg object-cover shadow-md"
            />

            <div className="absolute left-12 top-20">
              <p className="text-xl font-bold">{category.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;