import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearWishlist } from '../redux/wishlistSlice';
import ProductCard from '../components/productCard';

const Wishlist = () => {

    const dispatch = useDispatch();

    const wishlistItems = useSelector(
        state => state.wishlist.items
    );

    return (
        <div className="container mx-auto min-h-screen px-4 pb-12 pt-36 md:px-16 lg:px-24">

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-bold">
                    My Wishlist ({wishlistItems.length})
                </h2>

                {wishlistItems.length > 0 && (
                    <button
                        onClick={() => dispatch(clearWishlist())}
                        className="bg-violet-800 text-white px-4 py-2 rounded hover:bg-red-500"
                    >
                        Clear Wishlist
                    </button>
                )}

            </div>

            {wishlistItems.length > 0 ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

                    {wishlistItems.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}

                </div>

            ) : (

                <div className="text-center py-16">

                    <h3 className="text-xl font-semibold mb-4">
                        Your Wishlist is Empty!
                    </h3>

                    <p className="text-gray-500 mb-6">
                        You haven't added any products to your wishlist yet.
                    </p>

                    <Link
                        to="/shop"
                        className=" bg-violet-900 text-white px-6 py-3 rounded hover:bg-red-700"
                    >
                        Continue Shopping
                    </Link>

                </div>

            )}

        </div>
    );
};

export default Wishlist;