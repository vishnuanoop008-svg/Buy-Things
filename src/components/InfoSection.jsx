import {
  FaHeadset,
  FaLock,
  FaMoneyBillWave,
  FaShippingFast,
  FaTag,
} from 'react-icons/fa';

const infoItems = [
  {
    icon: FaShippingFast,
    title: 'Free Shipping',
    description: 'On qualifying orders',
  },
  {
    icon: FaHeadset,
    title: 'Support 24/7',
    description: 'We are here to help',
  },
  {
    icon: FaMoneyBillWave,
    title: 'Money Back',
    description: 'Shop with confidence',
  },
  {
    icon: FaLock,
    title: 'Secure Payment',
    description: 'Your payment is protected',
  },
  {
    icon: FaTag,
    title: 'Great Deals',
    description: 'Save on your favorites',
  },
];

const InfoSection = () => {
  return (
    <section className="border-y border-gray-200 bg-white py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-5 sm:px-6 lg:px-8">
        {infoItems.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-xl bg-[#f5f8f6] p-4 transition hover:bg-[#eaf2ed]"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-800"
              aria-hidden="true"
            >
              <Icon />
            </span>

            <div>
              <h3 className="text-sm font-bold text-[#173b32]">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoSection;