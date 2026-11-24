import { useState } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Thank you! Your message has been submitted.');

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-[#f5f8f6] p-3 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

  return (
    <main className="min-h-screen bg-[#f5f7f5] pt-28 text-[#173b32]">
      <section className="bg-[#e5f0e9] px-5 py-14 text-center md:py-16">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          We’re here to help
        </p>
        <h1 className="mb-3 text-4xl font-extrabold md:text-5xl">
          Contact us
        </h1>
        <p className="text-gray-600">
          We&apos;d love to hear from you. Get in touch with us!
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Get in touch
            </p>
            <h2 className="mb-4 text-3xl font-extrabold">
              How can we help?
            </h2>
            <p className="mb-8 max-w-xl leading-7 text-gray-600">
              Have questions about our products or your order? Our team is
              ready to help. Contact us using the information below.
            </p>

            <ContactInfo
              icon={<FaPhone />}
              title="Phone number"
              detail="+91 98765 43210"
            />
            <ContactInfo
              icon={<FaEnvelope />}
              title="Email address"
              detail="support@buythings.com"
            />
            <ContactInfo
              icon={<FaMapMarkerAlt />}
              title="Our location"
              detail="Kozhikode, Kerala, India"
            />
            <ContactInfo
              icon={<FaClock />}
              title="Working hours"
              detail="Monday - Saturday: 9 AM - 6 PM"
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-2xl font-extrabold">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={5}
                  required
                  className={`${inputClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-800 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

const ContactInfo = ({ icon, title, detail }) => (
  <div className="mb-6 flex items-center gap-4 last:mb-0">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-800">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-[#173b32]">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{detail}</p>
    </div>
  </div>
);

export default Contact;