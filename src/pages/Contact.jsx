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
    <main className="min-h-screen bg-gray-50 pt-32">
      <section className="scroll-mt-32 bg-violet-700 py-16 text-center text-white">
        <h1 className="mb-3 text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-100">
          We&apos;d love to hear from you. Get in touch with us!
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Get In Touch</h2>
            <p className="mb-8 leading-7 text-gray-600">
              Have questions about our products or your order? Our team is
              always ready to help you. Contact us using the information below.
            </p>

            <ContactInfo
              icon={<FaPhone size={22} />}
              title="Phone Number"
              detail="+91 98765 43210"
            />
            <ContactInfo
              icon={<FaEnvelope size={22} />}
              title="Email Address"
              detail="support@buythings.com"
            />
            <ContactInfo
              icon={<FaMapMarkerAlt size={22} />}
              title="Our Location"
              detail="Kozhikode, Kerala, India"
            />
            <ContactInfo
              icon={<FaClock size={22} />}
              title="Working Hours"
              detail="Monday - Saturday: 9 AM - 6 PM"
            />
          </div>

          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="mb-2 block font-medium">
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
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-violet-600"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="mb-2 block font-medium">
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
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-violet-600"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="subject" className="mb-2 block font-medium">
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
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-violet-600"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="mb-2 block font-medium">
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
                  className="w-full resize-none rounded-lg border border-gray-300 p-3 outline-none focus:border-violet-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-violet-800 py-3 font-semibold text-white transition duration-300 hover:bg-red-700"
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
      <div className="rounded-full bg-violet-900 p-4 text-white">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500">{detail}</p>
      </div>
    </div>
  );
}

export default Contact;