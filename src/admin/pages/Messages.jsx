import { useEffect, useState } from 'react';
import AdminTable from '../components/AdminTable';
import { getContactMessages } from '../../services/contactApi';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getContactMessages();
        setMessages(data.reverse());
      } catch {
        setError('Could not load contact messages.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (
        <p className="max-w-sm whitespace-normal break-words">
          {row.message}
        </p>
      ),
    },
    {
      key: 'createdAt',
      label: 'Received',
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleString()
          : '—',
    },
  ];

  return (
    <section className="text-[#173b32]">
      <h1 className="text-2xl font-extrabold">Contact Messages</h1>
      <p className="mt-1 text-sm text-gray-600">
        Messages submitted through the store contact form.
      </p>

      {error && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-gray-600">Loading messages…</p>
      ) : !error ? (
        <div className="mt-6">
          <AdminTable
            columns={columns}
            rows={messages}
            emptyMessage="No contact messages yet."
          />
        </div>
      ) : null}
    </section>
  );
};

export default Messages;