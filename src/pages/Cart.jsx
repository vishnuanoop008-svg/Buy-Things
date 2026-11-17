import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from '../assets/images/emptycart.jpg';
import { FaTrashAlt } from 'react-icons/fa';
import Modal from '../components/Modal';
import ChangeAddress from '../components/ChangeAddress';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const cart = useSelector(state => state.cart);
    const [address, setAddress] = useState('main street, 0012');
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <div className='container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24'>

            {cart.products.length > 0 ? (

                <div>

                    <h3 className='text-2xl font-semibold mb-4'>
                        SHOPPING CART
                    </h3>

                    <div className='flex flex-col md:flex-row justify-between gap-10 mt-8'>

                        {/* LEFT SIDE - PRODUCTS */}

                        <div className='md:w-2/3'>

                            {/* TABLE HEADINGS */}

                            <div className='grid grid-cols-[minmax(0,2fr)_0.8fr_1fr_0.9fr_35px] items-center border-b pb-4 mb-4 text-xs font-bold'>

                                <p>PRODUCTS</p>
                                <p>PRICE</p>
                                <p>QUANTITY</p>
                                <p>SUBTOTAL</p>
                                <p>REMOVE</p>

                            </div>

                            {/* PRODUCT LIST */}

                            {cart.products.map((product) => (

                                <div
                                    key={product.id}
                                    className='grid grid-cols-[minmax(0,2fr)_0.8fr_1fr_0.9fr_35px] items-center py-4 border-b'
                                >

                                    {/* PRODUCT IMAGE AND NAME */}

                                    <div className='flex items-center gap-3 min-w-0'>

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className='w-16 h-16 object-contain rounded'
                                        />

                                        <h3 className='text-sm font-semibold'>
                                            {product.name}
                                        </h3>

                                    </div>

                                    {/* PRICE */}

                                    <p className='text-sm'>
                                        ₹{product.price}
                                    </p>

                                    {/* QUANTITY */}

                                    <div className='flex items-center justify-center border w-fit'>

                                        <button className='text-xl font-bold px-2 border-r'
                                        onClick ={() =>dispatch(decreaseQuantity(product.id))}>
                                            -
                                        </button>

                                        <p className='text-lg px-2'>
                                            {product.quantity}
                                        </p>

                                        <button className='text-xl px-2 border-l'
                                        onClick ={() => dispatch(increaseQuantity(product.id))}>
                                            +
                                        </button>

                                    </div>

                                    {/* SUBTOTAL */}

                                    <p className='text-sm font-medium'>
                                        ₹{(product.quantity * product.price).toFixed(2)}
                                    </p>

                                    {/* REMOVE */}

                                    <button className='text-red-500 hover:text-red-700'
                                    onClick ={() => dispatch(removeFromCart(product.id))}>
                                        <FaTrashAlt />
                                    </button>

                                </div>

                            ))}

                        </div>


                        {/* RIGHT SIDE - CART TOTAL */}

                        <div className='md:w-1/3 bg-gray-50 p-6 rounded-lg h-fit'>

                            <h3 className='text-xl font-bold mb-6'>
                                CART TOTAL
                            </h3>

                            <div className='flex justify-between border-b py-3'>
                                <span>Total Items:</span>
                                <span>{cart.totalQuantity}</span>
                            </div>

                            <div className='border-b py-3'>

                                <p className='font-semibold mb-2'>
                                    Shipping:
                                </p>

                                <p>Shipping to:</p>

                                <div className='flex justify-between items-center mt-2'>

                                    <span className='text-gray-600 text-sm'>
                                        {address}
                                    </span>

                                    <button className='text-blue-600 text-sm hover:underline' onClick ={() => setIsModalOpen(true)}>
                                        Change address
                                    </button>

                                </div>

                            </div>

                            <div className='flex justify-between py-4 font-bold text-lg'>

                                <span>Total Price:</span>

                                <span>
                                    ₹{cart.totalPrice.toFixed(2)}
                                </span>

                            </div>

                            <button className='w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition'
                            onClick ={() => navigate('/checkout')}>
                                Proceed to checkout
                            </button>

                        </div>

                    </div>

                    <Modal 
                     isModalOpen= {isModalOpen}
                     setIsModalOpen ={setIsModalOpen}>
                        <ChangeAddress setAddress ={setAddress} setIsModalOpen ={setIsModalOpen}/>
                     </Modal>

                </div>

            ) : (

                <div className='flex justify-center'>
                    <img
                        src={EmptyCart}
                        alt="Empty Cart"
                        className='h-96'
                    />
                </div>

            )}

        </div>
    );
};

export default Cart;