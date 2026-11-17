import React from 'react';
import { useNavigate } from 'react-router-dom';

const Order = ({ order }) => {

    const navigate = useNavigate();

    // Check whether order data exists
    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">
                    No details not found!
                </h2>

                <button
                    onClick={() => navigate('/')}
                    className="bg-red-600 text-white px-6 py-2 rounded"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">

            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">

                <h2 className="text-3xl font-bold text-green-600 mb-4">
                    Thank You for your order!
                </h2>

                <p className="text-gray-600 mb-8">
                    Your order has been placed successfully.
                    You will receive an email confirmation shortly.
                </p>

                {/* Order Summary */}

                <div className="border-b pb-6 mb-6">

                    <h3 className="text-xl font-semibold mb-4">
                        Order Summary
                    </h3>

                    <p>
                        <strong>Order Number:</strong> {order.orderNumber}
                    </p>

                </div>

                {/* Shipping Information */}

                <div className="border-b pb-6 mb-6">

                    <h3 className="text-xl font-semibold mb-4">
                        Shipping Information
                    </h3>

                    <p>{order.shippingInformation?.address}</p>
                    <p>{order.shippingInformation?.city}</p>
                    <p>{order.shippingInformation?.zip}</p>

                </div>

                {/* Products Ordered */}

                <div className="border-b pb-6 mb-6">

                    <h3 className="text-xl font-semibold mb-4">
                        Products Ordered
                    </h3>

                    {order.products?.map((product) => (

                        <div
                            key={product.id}
                            className="flex justify-between py-3"
                        >

                            <p>
                                {product.name} x {product.quantity}
                            </p>

                            <p>
                                ₹{(product.price * product.quantity).toFixed(2)}
                            </p>

                        </div>

                    ))}

                </div>

                {/* Total Price */}

                <div className="flex justify-between text-xl font-bold mb-8">

                    <span>Total Price:</span>

                    <span>
                        ₹{Number(order.totalPrice).toFixed(2)}
                    </span>

                </div>

                {/* Buttons */}

                <div className="flex gap-4">

                    <button className="bg-blue-600 text-white px-5 py-3 rounded">
                        Order Tracking
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-red-600 text-white px-5 py-3 rounded"
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Order;