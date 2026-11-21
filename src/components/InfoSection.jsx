import {
  FaHeadset,
  FaLock,
  FaMoneyBillWave,
  FaShippingFast,
  FaTag,
} from 'react-icons/fa';

const InfoSection = () => {
  const infoItems = [
    {
      icon: <FaShippingFast />,
      title: 'Free Shipping',
      description: 'Get your orders delivered with no extra cost',
    },
    {
      icon: <FaHeadset />,
      title: 'Support 24/7',
      description: 'We are here to assist you anytime',
    },
    {
      icon: <FaMoneyBillWave />,
      title: '100% Money Back',
      description: 'Full refund if you are not satisfied',
    },
    {
      icon: <FaLock />,
      title: 'Payment Secure',
      description: 'Your payment information is safe with us',
    },
    {
      icon: <FaTag />,
      title: 'Discount',
      description: 'Enjoy the best prices on our products',
    },
  ];

  return (
    <section className="border-y border-white/10 bg-[#0d0d10] py-10">
      <div className="container mx-auto grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-5">
        {infoItems.map(item => (
          <div
            key={item.title}
            className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-purple-500/5"
          >
            <span className="text-3xl text-purple-500" aria-hidden="true">
              {item.icon}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoSection;