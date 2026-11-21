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

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    alert('Thank you! Your message has been submitted.');

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <main className="min-h-screen bg-[#09090b] pt-32 text-white">
      <section className="border-y border-purple-500/20 bg-gradient-to-r from-[#11091c] via-[#1b0b2b] to-[#09090b] px-5 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
          We’re here to help
        </p>
        <h1 className="mb-3 text-4xl font-extrabold md:text-5xl">
          Contact Us
        </h1>
        <p className="text-gray-300">
          We&apos;d love to hear from you. Get in touch with us!
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              Get in touch
            </p>
            <h2 className="mb-4 text-3xl font-bold">How can we help?</h2>
            <p className="mb-8 max-w-xl leading-7 text-gray-400">
              Have questions about our products or your order? Our team is
              ready to help. Contact us using the information below.
            </p>

            <ContactInfo
              icon={<FaPhone />}
              title="Phone Number"
              detail="+91 98765 43210"
            />
            <ContactInfo
              icon={<FaEnvelope />}
              title="Email Address"
              detail="support@buythings.com"
            />
            <ContactInfo
              icon={<FaMapMarkerAlt />}
              title="Our Location"
              detail="Kozhikode, Kerala, India"
            />
            <ContactInfo
              icon={<FaClock />}
              title="Working Hours"
              detail="Monday - Saturday: 9 AM - 6 PM"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-purple-950/20 sm:p-8">
            <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#09090b] p-3 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#09090b] p-3 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#09090b] p-3 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#09090b] p-3 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-purple-700 py-3 font-semibold text-white transition duration-300 hover:bg-purple-600"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

function ContactInfo({ icon, title, detail }) {
  return (
    <div className="mb-7 flex items-center gap-5 last:mb-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-xl text-purple-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{detail}</p>
      </div>
    </div>
  );
}

export default Contact;